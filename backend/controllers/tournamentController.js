import db from '../models/database.js';

const getTournaments = async (req, reply) => {
    try {
        const rows = db.prepare(`
            SELECT
                t.id AS tournament_id,
                t.name,
                t.status,
                t.current_round,
                mh.id as match_id,
                mh.type,
                mh.date,
                mh.round,
                COALESCE(
                    (
                        SELECT json_group_array(
                            json_object(
                                'player_id', mph.player_id, 
                                'team', mph.team
                            )
                        )
                        FROM match_player_history mph
                        WHERE mph.match_id = mh.id
                    ), '[]'
                ) AS players
            FROM match_history mh
            JOIN tournaments t ON t.id = mh.tournament_id
        `).all();

        if (rows.length === 0) {
            return reply.code(404).send({ error: 'No tournaments found' });
        }

        const tournamentsMap = new Map();

        for (const row of rows) {
            const tid = row.tournament_id;

            if (!tournamentsMap.has(tid)) {
                tournamentsMap.set(tid, {
                    id: tid,
                    name: row.name,
                    status: row.status,
                    current_round: row.current_round,
                    matches: []
                });
            }

            const match = {
                match_id: row.match_id,
                type: row.type,
                round: row.round,
                date: row.date,
                players: JSON.parse(row.players)
            };

            tournamentsMap.get(tid).matches.push(match);
        }

        const tournaments = Array.from(tournamentsMap.values());

        return reply.code(200).send(tournaments);
    } catch (error) {
        console.log(error);
        return reply.code(500).send({ error: 'Failed to fetch tournaments' });
    }
};

const getTournament = async (req, reply) => {
    const { id } = req.params;

    try {
        const rows = db.prepare(`
            SELECT
                t.id AS tournament_id,
                t.name,
                t.status,
                t.current_round,
                mh.id as match_id,
                mh.type,
                mh.round,
                mh.date,
                COALESCE(
                    (
                        SELECT json_group_array(
                        json_object(
                        'player_id', mph.player_id, 
                        'team', mph.team
                        )
                    )
                    FROM match_player_history mph
                    WHERE mph.match_id = mh.id
                    ), '[]'
                ) AS players
            FROM match_history mh
            JOIN tournaments t ON t.id = mh.tournament_id
            WHERE t.id = ?
        `).all(id);

        if (rows.length === 0) {
            return reply.code(404).send({ error: 'Tournament not found' });
        }

        const { id: tournament_id, name: tournament_name, status, current_round } = rows[0];

        const matches = rows.map(row => ({
            match_id: row.match_id,
            type: row.type,
            row: row.round,
            date: row.date,
            players: JSON.parse(row.players)
        }));

        return reply.code(200).send({
            id: tournament_id,
            name: tournament_name,
            status,
            current_round,
            matches
        });
    } catch (error) {
        console.log(error);
        return reply.code(500).send({ error: 'Failed to fetch tournaments' });
    }
};

const generateMatchups = (players) => {
    const shuffledPlayers = [...players];
    shuffledPlayers.sort(() => Math.random() - 0.5);
    const byeCount = (2 ** Math.ceil(Math.log2(shuffledPlayers.length))) - shuffledPlayers.length;

    let matchups = [];
    let byePlayers = [];

    if (byeCount > 0) {
        for (let i = 0; i < byeCount; i++) {
            byePlayers.push(shuffledPlayers.pop());
        }
    }

    for (let i = 0; i < shuffledPlayers.length; i += 2) {
        matchups.push([shuffledPlayers[i], shuffledPlayers[i + 1]]);
    }
    return { matchups, byePlayers };
}

const createTournament = async (req, reply) => {
    const { name, player_ids } = req.body;
    
    try {
        const existingTournament = db.prepare('SELECT * FROM tournaments WHERE name = ?').get(name);
        if (existingTournament) {
            return reply.code(400).send({ error: 'Tournament already exists' });
        }
    
        for (const player_id of player_ids) {
            const player = db.prepare('SELECT * FROM players WHERE id = ?').get(player_id);
            if (!player) {
                return reply.code(400).send({ error: `Player with ID ${player_id} does not exist` });
            }
        }
    
        if (player_ids.length < 3 || player_ids.length > 8) {
            return reply.code(400).send({ error: 'Min 3 and max 8 players are required to create a tournament' });
        }
    
        let tournament = db.prepare('INSERT INTO tournaments (name) VALUES (?)').run(name);
        const { matchups, byePlayers } = generateMatchups(player_ids);
    
        for (const [player1, player2] of matchups) {
            const result = db.prepare('INSERT INTO match_history (type, tournament_id, round) VALUES (?, ?, ?)').run('tournament', tournament.lastInsertRowid, 0);
            db.prepare(`INSERT INTO match_player_history (match_id, player_id, team)
                    VALUES (?, ?, ?, ?)`).run(result.lastInsertRowid, player1, 1);
            db.prepare(`INSERT INTO match_player_history (match_id, player_id, team)
                VALUES (?, ?, ?, ?)`).run(result.lastInsertRowid, player2, 2);
        }
        for (const byePlayer of byePlayers) {
            const result = db.prepare('INSERT INTO match_history (type, tournament_id, round) VALUES (?, ?)').run('tournament', tournament.lastInsertRowid, 0);
            db.prepare(`INSERT INTO match_player_history (match_id, player_id, team)
                    VALUES (?, ?, ?, ?)`).run(result.lastInsertRowid, byePlayer, 1);
            db.prepare(`INSERT INTO match_winner_history (match_id, winner_id) VALUES (?, ?)`).run(result.lastInsertRowid, byePlayer);
        }

        const rows = db.prepare(`
            SELECT
                t.id AS tournament_id,
                t.name,
                t.status,
                t.current_round,
                mh.id as match_id,
                mh.type,
                mh.round,
                mh.date,
                COALESCE(
                    (
                        SELECT json_group_array(
                        json_object(
                        'player_id', mph.player_id, 
                        'team', mph.team, 
                        )
                    )
                    FROM match_player_history mph
                    WHERE mph.match_id = mh.id
                    ), '[]'
                ) AS players
            FROM match_history mh
            JOIN tournaments t ON t.id = mh.tournament_id
            WHERE t.id = ?
        `).all(tournament.lastInsertRowid);

        const { tournament_id, name: tournament_name, status, current_round } = rows[0];

        const matches = rows.map(row => ({
            match_id: row.match_id,
            type: row.type,
            round: row.round,
            date: row.date,
            players: JSON.parse(row.players)
        }));

        return reply.code(200).send({ message: 'Successfully created tournament', item: {
            tournament_id,
            name: tournament_name,
            status,
            current_round,
            matches
        } });
    } catch (error) {
        console.log(error);
        return reply.code(500).send({ error: 'Failed to create tournament' });
    }
}

const advanceTournament = async(req, reply) => {
    const { id } = req.params;

    try {
        const tournament = db.prepare('SELECT * FROM tournaments WHERE id = ?').get(id);
        if (!tournament) {
            return reply.code(404).send({ error: 'Tournament not found' });
        }
        
        let matches = db.prepare('SELECT * FROM match_history WHERE tournament_id = ? AND round = ?').all(id, tournament.current_round);
        if (matches.length === 0) {
            return reply.code(404).send({ error: 'No matches found for this tournament or round' });
        }

        let winners_id = [];
        for (const match of matches) {
            winner = db.prepare(`SELECT * FROM match_winner_history WHERE match_id = ?`).all(match.id);
            if (winner.length === 0) {
                return reply.code(404).send({ error: 'No winner found for this match' });
            }
            winners_id.push(winner.id);
        }

        const { matchups } = generateMatchups(winners_id);

        for (const [player1, player2] of matchups) {
            const result = db.prepare('INSERT INTO match_history (type, tournament_id, round) VALUES (?, ?, ?)').run('tournament', id, tournament.current_round + 1);
            db.prepare(`INSERT INTO match_player_history (match_id, player_id, team)
                    VALUES (?, ?, ?, ?)`).run(result.lastInsertRowid, player1, 1);
            db.prepare(`INSERT INTO match_player_history (match_id, player_id, team)
                VALUES (?, ?, ?, ?)`).run(result.lastInsertRowid, player2, 2);
        }

        db.prepare(`UPDATE tournaments SET current_round = current_round + 1 WHERE id = ?`).run(id);
        const rows = db.prepare(`
            SELECT
                t.id AS tournament_id,
                t.name,
                t.status,
                t.current_round,
                mh.id as match_id,
                mh.type,
                mh.round,
                mh.date,
                COALESCE(
                    (
                        SELECT json_group_array(
                        json_object(
                        'player_id', mph.player_id, 
                        'team', mph.team, 
                        )
                    )
                    FROM match_player_history mph
                    WHERE mph.match_id = mh.id
                    ), '[]'
                ) AS players
            FROM match_history mh
            JOIN tournaments t ON t.id = mh.tournament_id
            WHERE t.id = ?
        `).all(tournament.lastInsertRowid);

        const { tournament_id, name: tournament_name, status, current_round } = rows[0];

        matches = rows.map(row => ({
            match_id: row.match_id,
            type: row.type,
            round: row.round,
            date: row.date,
            players: JSON.parse(row.players)
        }));

        return reply.code(200).send({ message: 'Successfully advanced tournament', item: {
            tournament_id,
            name: tournament_name,
            status,
            current_round,
            matches
        } });
    } catch (error) {
        console.log(error);
        return reply.code(500).send({ error: 'Failed to update tournament' });
    }
}

const deleteTournament = async(req, reply) => {
    const { id } = req.params;
    
    try {
        const result = db.prepare('DELETE FROM tournaments WHERE id = ?').run(id);
        if (result.changes === 0) {
            return reply.code(404).send({ error: 'Tournament not found' });
        }
        return reply.code(200).send({ message: 'Successfully deleted tournament' });
    } catch (error) {
        console.log(error);
        return reply.code(500).send({ error: 'Failed to delete tournament' });
    }
}

export default {
    getTournaments,
    getTournament,
    createTournament,
    advanceTournament,
    deleteTournament
}

// update tournament status when tournament is finished and also the winner_id 
