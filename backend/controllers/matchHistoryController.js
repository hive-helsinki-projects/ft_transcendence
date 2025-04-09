import db from '../models/database.js';

const getMatchHistories = async (req, reply) => {
    try {
        const rows = db.prepare(`
            SELECT
                mh.id,
                mh.type,
                mh.tournament_id,
                mh.date,
                COALESCE(
                    (
                        SELECT json_group_array(
                        json_object('winner_id', mwh.winner_id)
                        )
                        FROM match_winner_history mwh
                        WHERE mwh.match_id = mh.id
                        ), '[]'
                ) AS winners,
                COALESCE(
                    (
                        SELECT json_group_array(
                        json_object(
                        'player_id', mph.player_id, 
                        'score', mph.score, 
                        'team', mph.team, 
                        'round', mph.round
                        )
                    )
                    FROM match_player_history mph
                    WHERE mph.match_id = mh.id
                    ), '[]'
                ) AS players
            FROM match_history mh
        `).all();

        const matches = rows.map(({ winners, players, ...rest }) => ({
            ...rest,
            winners: JSON.parse(winners),
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
                COALESCE(
                    (
                        SELECT json_group_array(
                        json_object('winner_id', mwh.winner_id)
                        )
                        FROM match_winner_history mwh
                        WHERE mwh.match_id = mh.id
                        ), '[]'
                ) AS winners,
                COALESCE(
                    (
                        SELECT json_group_array(
                        json_object(
                        'player_id', mph.player_id, 
                        'score', mph.score, 
                        'team', mph.team, 
                        'round', mph.round
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
            return reply.code(404).send({ error: 'Match not found '});
        }

        const match = {
            ...row,
            winners: JSON.parse(row.winners),
            players: JSON.parse(row.players)
        };

        return reply.code(200).send(match);
    } catch (error) {
        console.log(error);
        return reply.code(500).send({ error: 'Failed to fetch match-history '})
    }
}

const createMatchHistory = async (req, reply) => {
    const { type, tournament_id, winners, players } = req.body;

    try {
        const result = db.prepare(`INSERT INTO match_history (type, tournament_id) VALUES (?, ?)`).run(type, tournament_id);

        for (const winner of winners) {
            db.prepare(`INSERT INTO match_winner_history (match_id, winner_id) VALUES (?, ?)`).run(result.lastInsertRowid, winner.winner_id);
            db.prepare(`UPDATE players SET wins = wins + 1 WHERE id = ?`).run(winner.winner_id);
        }

        const winnerIds = winners.map(winner => winner.winner_id);

        for (const player of players) {
            db.prepare(`
                INSERT INTO match_player_history
                (match_id, player_id, score, team, round)
                VALUES (?, ?, ?, ?, ?)    
            `)
            .run(result.lastInsertRowid, player.player_id, player.score, player.team, player.round)

            if (!winnerIds.includes(player.player_id)) {
                db.prepare(`UPDATE players SET losses = losses + 1 WHERE id = ?`).run(player.player_id);
            }
        }

        return reply.code(200).send({ message: 'Successfully created match-history '})
    } catch (error) {
        console.log(error);
        return reply.code(500).send({ error: 'Failed to create a match-history' })
    }
}

export default {
    getMatchHistories,
    getMatchHistory,
    createMatchHistory
}