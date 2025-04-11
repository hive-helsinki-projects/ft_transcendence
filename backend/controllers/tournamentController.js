import db from '../models/database.js';

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
                mh.date,
                COALESCE(
                    (
                        SELECT json_group_array(
                        json_object(
                        'player_id', mph.player_id, 
                        'team', mph.team, 
                        'round', mph.round
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

    let matchups = [];
    let byePlayer = null;

    if (shuffledPlayers.length % 2 === 1) {
        byePlayer = shuffledPlayers.pop();
    }

    for (let i = 0; i < shuffledPlayers.length; i += 2) {
        matchups.push([shuffledPlayers[i], shuffledPlayers[i + 1]]);
    }
    return { matchups, byePlayer };
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
        const { matchups, byePlayer } = generateMatchups(player_ids);
    
        for (const [player1, player2] of matchups) {
            const result = db.prepare('INSERT INTO match_history (type, tournament_id) VALUES (?, ?)').run('tournament', tournament.lastInsertRowid);
            db.prepare(`INSERT INTO match_player_history (match_id, player_id, team, round)
                    VALUES (?, ?, ?, ?)`).run(result.lastInsertRowid, player1, 1, 0);
            db.prepare(`INSERT INTO match_player_history (match_id, player_id, team, round)
                VALUES (?, ?, ?, ?)`).run(result.lastInsertRowid, player2, 2, 0);
        }
        if (byePlayer) {
            const result = db.prepare('INSERT INTO match_history (type, tournament_id) VALUES (?, ?)').run('tournament', tournament.lastInsertRowid);
            db.prepare(`INSERT INTO match_player_history (match_id, player_id, team, round)
                    VALUES (?, ?, ?, ?)`).run(result.lastInsertRowid, byePlayer, 1, 1);
        }

        const rows = db.prepare(`
            SELECT
                t.id AS tournament_id,
                t.name,
                t.status,
                t.current_round,
                mh.id as match_id,
                mh.type,
                mh.date,
                COALESCE(
                    (
                        SELECT json_group_array(
                        json_object(
                        'player_id', mph.player_id, 
                        'team', mph.team, 
                        'round', mph.round
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

export default {
    getTournament,
    createTournament
}

// update tournament status when tournament is finished and also the winner_id 

// update tournament current_round when tournament round has finnished