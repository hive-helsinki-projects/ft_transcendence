import db from '../models/database.js';

// Query to fetch tournament details along with match history and players
const getExistingTournament = db.prepare(`
    SELECT
        t.id AS tournament_id,
        t.name,
        t.status,
        t.current_round,
        t.winner_id,
        mh.id as match_id,
        mh.type,
        mh.round,
        mh.date,
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
    JOIN tournaments t ON t.id = mh.tournament_id
    WHERE t.id = ?
`);

// Controller to fetch all tournaments with match details
const getTournaments = async (req, reply) => {
    try {
        // Fetch all tournaments along with match details
        const rows = db.prepare(`
            SELECT
                t.id AS tournament_id,
                t.name,
                t.status,
                t.current_round,
                t.winner_id,
                mh.id as match_id,
                mh.type,
                mh.date,
                mh.round,
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
            JOIN tournaments t ON t.id = mh.tournament_id
        `).all();

        if (rows.length === 0) {
            return reply.code(404).send({ error: 'No tournaments found' });
        }

        // Organize data by tournament ID
        const tournamentsMap = new Map();
        for (const row of rows) {
            const tid = row.tournament_id;
            if (!tournamentsMap.has(tid)) {
                tournamentsMap.set(tid, {
                    id: tid,
                    name: row.name,
                    status: row.status,
                    current_round: row.current_round,
                    winner_id: row.winner_id,
                    matches: []
                });
            }

            // Organize match data for each tournament
            const match = {
                match_id: row.match_id,
                type: row.type,
                round: row.round,
                date: row.date,
                players: JSON.parse(row.players)
            };

            tournamentsMap.get(tid).matches.push(match);
        }

        // Convert Map to array for response
        const tournaments = Array.from(tournamentsMap.values());

        return reply.code(200).send(tournaments);
    } catch (error) {
        console.log(error);
        return reply.code(500).send({ error: 'Failed to fetch tournaments' });
    }
};

// Controller to fetch a single tournament by ID
const getTournament = async (req, reply) => {
    const { id } = req.params;

    try {
        const rows = getExistingTournament.all(id);

        if (rows.length === 0) {
            return reply.code(404).send({ error: 'Tournament not found' });
        }

        const { id: tournament_id, name: tournament_name, status, current_round, winner_id } = rows[0];

        // Prepare match details for the tournament
        const matches = rows.map(row => ({
            match_id: row.match_id,
            type: row.type,
            round: row.round,
            date: row.date,
            players: JSON.parse(row.players)
        }));

        return reply.code(200).send({
            id: tournament_id,
            name: tournament_name,
            status,
            current_round,
            winner_id,
            matches
        });
    } catch (error) {
        console.log(error);
        return reply.code(500).send({ error: 'Failed to fetch tournament' });
    }
};

// Helper function to generate matchups and handle byes
const generateMatchups = (players) => {
    const shuffledPlayers = [...players];
    shuffledPlayers.sort(() => Math.random() - 0.5); // Shuffle players randomly

    // Calculate the number of byes needed to ensure the player count is a power of 2
    const byeCount = (2 ** Math.ceil(Math.log2(shuffledPlayers.length))) - shuffledPlayers.length;

    let matchups = [];
    let byePlayers = [];

    // Assign byes if necessary
    if (byeCount > 0) {
        for (let i = 0; i < byeCount; i++) {
            byePlayers.push(shuffledPlayers.pop());
        }
    }

    // Pair up the remaining players for matchups
    for (let i = 0; i < shuffledPlayers.length; i += 2) {
        matchups.push([shuffledPlayers[i], shuffledPlayers[i + 1]]);
    }

    return { matchups, byePlayers };
};

// Database queries for inserting match history and players
const insertMatchHistory = db.prepare('INSERT INTO match_history (type, tournament_id, round, user_id) VALUES (?, ?, ?, ?)');
const insertMatchPlayer = db.prepare(`INSERT INTO match_player_history (match_id, player_id) VALUES (?, ?)`);

// Controller to create a new tournament
const createTournament = async (req, reply) => {
    const user_id = req.user.id;
    const { name, player_ids } = req.body;

    const insertTournamentName = db.prepare('INSERT INTO tournaments (name, user_id) VALUES (?, ?)');
    const insertMatchWinner = db.prepare(`INSERT INTO match_winner_history (match_id, winner_id) VALUES (?, ?)`);
    
    const transaction = db.transaction((name, player_ids, user_id) => {
        // Check if a tournament with the same name already exists
        const existingTournament = db.prepare('SELECT * FROM tournaments WHERE name = ?').get(name);
        if (existingTournament) {
            return reply.code(400).send({ error: 'Tournament name is already taken' });
        }

        // Validate players' existence
        for (const player_id of player_ids) {
            const player = db.prepare('SELECT * FROM players WHERE id = ?').get(player_id);
            if (!player) {
                return reply.code(400).send({ error: `Player with ID ${player_id} does not exist` });
            }
        }

        // Insert tournament record
        let tournament = insertTournamentName.run(name, user_id);
        const { matchups, byePlayers } = generateMatchups(player_ids);

        // Insert match history and players
        for (const [player1, player2] of matchups) {
            const result = insertMatchHistory.run('tournament', tournament.lastInsertRowid, 0, user_id);
            insertMatchPlayer.run(result.lastInsertRowid, player1);
            insertMatchPlayer.run(result.lastInsertRowid, player2);
        }

        // Handle byes
        for (const byePlayer of byePlayers) {
            const result = insertMatchHistory.run('tournament', tournament.lastInsertRowid, 0, user_id);
            insertMatchPlayer.run(result.lastInsertRowid, byePlayer);
            insertMatchWinner.run(result.lastInsertRowid, byePlayer);
        }

        // Fetch the newly created tournament
        const rows = getExistingTournament.all(tournament.lastInsertRowid);
        return rows;
    });

    try {
        const rows = transaction(name, player_ids, user_id);
        const { tournament_id, name: tournament_name, status, current_round, winner_id } = rows[0];

        // Prepare match details for the new tournament
        const matches = rows
            .filter(row => row.round === current_round)
            .map(row => ({
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
            winner_id,
            matches
        } });
    } catch (error) {
        console.log(error);
        return reply.code(500).send({ error: 'Failed to create tournament' });
    }
}

// Controller to advance a tournament to the next round
const advanceTournament = async(req, reply) => {
    const user_id = req.user.id;
    const { id } = req.params;

    const updateTournamentRound =  db.prepare(`UPDATE tournaments SET current_round = current_round + 1 WHERE id = ?`);
    const updateTournamentStatus = db.prepare(`UPDATE tournaments SET status = 'finished', winner_id = ?, current_round = ? WHERE id = ?`);

    const transaction = db.transaction((id, user_id) => {
        // Fetch tournament and verify user authorization
        const tournament = db.prepare('SELECT * FROM tournaments WHERE id = ? AND user_id = ?').get(id, user_id);
        if (!tournament) {
            return reply.code(404).send({ error: 'Tournament not found or unauthorized' });
        } else if (tournament.status === 'finished') {
            return reply.code(400).send({ error: 'Tournament already finished' });
        }
        
        // Fetch matches for current round
        let matches = db.prepare('SELECT * FROM match_history WHERE tournament_id = ? AND round = ?').all(id, tournament.current_round);
        if (matches.length === 0) {
            return reply.code(404).send({ error: 'No matches found for this tournament or round' });
        }

        let winners_id = [];
        // Determine winners for each match
        for (const match of matches) {
            const winner = db.prepare(`SELECT * FROM match_winner_history WHERE match_id = ?`).all(match.id);
            if (!winner[0]) {
                return reply.code(404).send({ error: `No winner found for match ${match.id}` });
            }
            winners_id.push(winner[0].winner_id);
        }
        
        const { matchups } = generateMatchups(winners_id);

        // If only one player remains, finish the tournament
        if (matchups.length === 1 && matchups[0][1] === undefined) {
            updateTournamentStatus.run(winners_id[0], tournament.current_round + 1, id);
            return reply.code(200).send({ message: 'Successfully finished tournament' });
        }

        // Insert new matches for the next round
        for (const [player1, player2] of matchups) {
            const result = insertMatchHistory.run('tournament', id, tournament.current_round + 1, user_id);
            insertMatchPlayer.run(result.lastInsertRowid, player1);
            insertMatchPlayer.run(result.lastInsertRowid, player2);
        }
        
        updateTournamentRound.run(id);
        const rows = getExistingTournament.all(id);
        return rows;
    });

    try {
        const rows = transaction(id, user_id);
        const { tournament_id, name: tournament_name, status, current_round, winner_id } = rows[0];

        const matches = rows
        .filter(row => row.round === current_round)
        .map(row => ({
            match_id: row.match_id,
            type: row.type,
            round: row.round,
            date: row.date,
            players: JSON.parse(row.players)
        }));

        return reply.code(200).send({ message: 'Successfully advanced tournament', item: {
            matches
        } });
    } catch (error) {
        console.log(error);
        return reply.code(500).send({ error: 'Failed to update tournament' });
    }
}

// Controller to delete a tournament
const deleteTournament = async(req, reply) => {
    const user_id = req.user.id;
    const { id } = req.params;
    
    try {
        // Delete the tournament by ID and user
        const result = db.prepare('DELETE FROM tournaments WHERE id = ? and user_id = ?').run(id, user_id);
        if (result.changes === 0) {
            return reply.code(404).send({ error: 'Tournament not found or unauthorized' });
        }
        return reply.code(200).send({ message: 'Tournament deleted successfully' });
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
};
