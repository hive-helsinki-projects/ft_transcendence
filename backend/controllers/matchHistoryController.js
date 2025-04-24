import db from '../models/database.js';

const getMatchHistories = async (req, reply) => {
    try {
        const rows = db.prepare(`
            SELECT
                mh.id,
                mh.type,
                mh.tournament_id,
                mh.date,
                mh.round, 
                COALESCE(
                    (
                        SELECT mwh.winner_id
                        FROM match_winner_history mwh
                        WHERE mwh.match_id = mh.id
                        LIMIT 1
                    ), NULL
                ) AS winner_id,
                COALESCE(
                    (
                        SELECT json_group_array(
                            json_object(
                                'player_id', mph.player_id, 
                                'score', mph.score
                            )
                        )
                        FROM match_player_history mph
                        WHERE mph.match_id = mh.id
                    ), '[]'
                ) AS players
            FROM match_history mh
        `).all();

        const matches = rows.map(({ players, ...rest }) => ({
            ...rest,
            players: JSON.parse(players)
        }));

        return reply.code(200).send(matches);
    } catch (error) {
        console.log(error);
        return reply.code(500).send({ error: 'Failed to fetch match-histories' })
    }
}

const getMatchHistory = async (req, reply) => {
    const { id } = req.params;

    try {
        const row = db.prepare(`
            SELECT
                mh.id,
                mh.type,
                mh.tournament_id,
                mh.date,
                mh.round, 
                COALESCE(
                    (
                        SELECT mwh.winner_id
                        FROM match_winner_history mwh
                        WHERE mwh.match_id = mh.id
                        LIMIT 1
                    ), NULL
                ) AS winner_id,
                COALESCE(
                    (
                        SELECT json_group_array(
                            json_object(
                                'player_id', mph.player_id, 
                                'score', mph.score
                            )
                        )
                        FROM match_player_history mph
                        WHERE mph.match_id = mh.id
                    ), '[]'
                ) AS players
            FROM match_history mh
            WHERE mh.id = ?
            `).get(id);

        if (!row) {
            return reply.code(404).send({ error: 'Match not found' });
        }

        const match = {
            ...row,
            winner_id: row.winner_id,
            players: JSON.parse(row.players)
        };

        return reply.code(200).send(match);
    } catch (error) {
        console.log(error);
        return reply.code(500).send({ error: 'Failed to fetch match-history' })
    }
}

const createMatchHistory = async (req, reply) => {
    const { type, tournament_id, players = [], round } = req.body;

    if (players.length != 2) {
        return reply.code(400).send({ error: 'Must have 2 players' });
    }
    const insertMatch = db.prepare(`INSERT INTO match_history (type, tournament_id, round) VALUES (?, ?, ?)`);
    const insertMatchPlayer =  db.prepare(`
        INSERT INTO match_player_history
        (match_id, player_id)
        VALUES (?, ?)`)

    const transaction = db.transaction((type, tournament_id, round, players) => {
        const result = insertMatch.run(type, tournament_id, round);
        for (const player of players) {
            insertMatchPlayer.run(result.lastInsertRowid, player.player_id)
        }
    })

    try {
        transaction(type, tournament_id, round, players);
        return reply.code(200).send({ message: 'Successfully created match-history'})
    } catch (error) {
        console.log(error);
        return reply.code(500).send({ error: 'Failed to create a match-history' })
    }
}

const updateMatchHistory = async (req, reply) => {
    const id = req.params.id;
    const { winners, players } = req.body;
    
    const getExistingPlayer = db.prepare(`SELECT * FROM match_player_history WHERE match_id = ? and player_id = ?`);
    const getExistingWinner = db.prepare(`SELECT * FROM match_winner_history WHERE match_id = ? AND winner_id = ?`);
    const insertMatchWinner =  db.prepare(`INSERT INTO match_winner_history (match_id, winner_id) VALUES (?, ?)`);
    const updatePlayerWin = db.prepare(`UPDATE players SET wins = wins + 1 WHERE id = ?`);
    const updateMatchPlayerHistory =  db.prepare(`
        UPDATE match_player_history SET
        score = ? WHERE match_id = ? AND player_id = ?  
    `)
    const updatePlayerLoss =  db.prepare(`UPDATE players SET losses = losses + 1 WHERE id = ?`);

    const allWinnersArePlayers = winners.every(winner =>
        players.some(player => player.player_id == winner.winner_id)
    );
    
    if (!allWinnersArePlayers) {
        return reply.code(400).send({ error: 'Winner must be part of the players list' });
    }

    const transaction = db.transaction((id, winners, players) => {
        const winnerIds = winners.map(winner => winner.winner_id);

        for (const player of players) {
            const existingPlayer = getExistingPlayer.get(id, player.player_id);
            if (!existingPlayer) {
                return reply.code(404).send({ error: 'Player not found in this match' });
            }

            updateMatchPlayerHistory.run(player.score, id, player.player_id)
    
            if (!winnerIds.includes(player.player_id)) {
                updatePlayerLoss.run(player.player_id);
            }
        }

        for (const winner of winners) {
            const existingWinner = getExistingWinner.get(id, winner.winner_id);
            if (!existingWinner) {
                insertMatchWinner.run(id, winner.winner_id);
                updatePlayerWin.run(winner.winner_id);
            }
        }
    })

    try {
        transaction(id, winners, players);
        return reply.code(200).send({ 
            message: 'Successfully updated match-history' })
    } catch (error) {
        console.log(error);
        if (error.message.includes('FOREIGN KEY constraint failed')) {
            return reply.code(409).send({ error: 'Match not found' });
        }
        return reply.code(500).send({ error: 'Failed to update a match-history' })
    }
}

const deleteMatchHistory = async (req, reply) => {
	const { id } = req.params;
	
	try {
		const result = db.prepare(`DELETE FROM match_history WHERE id = ?`).run(id)
		if (result.changes === 0) {
			return reply.code(404).send({ error: 'Match-history not found or user not authortized to delete this player'})
		}
		return reply.code(200).send({ message: 'Succesfully deleted match-history '})
	} catch (error) {
		console.log(error);
		return reply.code(500).send({ error: 'Failed to delete match-history' })
	}
}


export default {
    getMatchHistories,
    getMatchHistory,
    createMatchHistory,
    updateMatchHistory,
    deleteMatchHistory
}