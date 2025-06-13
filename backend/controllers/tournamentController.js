import db from '../models/database.js';
import { recordTournament } from '../services/blockchain.js';
import { getScores } from '../services/blockchain.js';

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

        // RETURN EMPTY ARRAY IF NO TOURNAMENTS
        if (rows.length === 0) {
            return reply.code(200).send(rows);
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
const advanceTournament = async (req, reply) => {
    const userId = req.user.id;
    const tourId = Number(req.params.id);

    const bumpRound = db.prepare(`UPDATE tournaments SET current_round = current_round + 1 WHERE id = ?`);
    const markFinished = db.prepare(`UPDATE tournaments SET status = 'finished', winner_id = ?, current_round = ? WHERE id = ?`);

    // Build a “pure” transaction; no HTTP logic here
    const txn = db.transaction((tId, uId) => {
      // ensure tournament exists & belongs to user
      const tour = db.prepare(`SELECT * FROM tournaments WHERE id = ? AND user_id = ?`).get(tId, uId);
      if (!tour) {
        throw { statusCode: 404, message: 'Tournament not found or unauthorized' };
      }
      if (tour.status === 'finished') {
        throw { statusCode: 200, message: 'Tournament already finished' };
      }

      // load all matches in the current round
      const matches = db
        .prepare(`SELECT * FROM match_history WHERE tournament_id = ? AND round = ?`)
        .all(tId, tour.current_round);
      if (matches.length === 0) {
        throw {statusCode: 404, message: 'No matches found for this tournament or round'};
      }

      // collect each match’s winner
      const winners = [];
      for (const m of matches) {
        const win = db.prepare(`SELECT * FROM match_winner_history WHERE match_id = ?`).all(m.id);
        if (!win[0]) {
          throw {statusCode: 404, message: `No winner found for match ${m.id}`
          };
        }
        winners.push(win[0].winner_id);
      }

      // generate next‐round pairings
      const { matchups } = generateMatchups(winners);

      // if that was the final matchup, mark the tournament finished
      if (matchups.length === 1 && matchups[0][1] == null) {
        const champ = winners[0];
        markFinished.run(champ, tour.current_round + 1, tId);
        // return all the rows so outer code can decide what to send
        return getExistingTournament.all(tId);
      }

      // otherwise insert the new matches and bump the round
      for (const [p1, p2] of matchups) {
        const res = insertMatchHistory.run(
          'tournament',
          tId,
          tour.current_round + 1,
          uId
        );
        insertMatchPlayer.run(res.lastInsertRowid, p1);
        insertMatchPlayer.run(res.lastInsertRowid, p2);
      }
      bumpRound.run(tId);
      return getExistingTournament.all(tId);
    });

    // call the transaction, catch any “throw”-style validation errors
    let rows;
    try {
      rows = txn(tourId, userId);
    } catch (err) {
      if (err.statusCode) {
        return reply.code(err.statusCode).send({ error: err.message });
      }
      console.error(err);
      return reply.code(500).send({ error: 'Failed to advance tournament' });
    }

    // now decide whether we just finished, or just advanced
    const first = rows[0];

    const matches = rows
      .filter(r => r.round === first.current_round)
      .map(r => ({
        match_id: r.match_id,
        type:     r.type,
        round:    r.round,
        date:     r.date,
        players:  JSON.parse(r.players)
      }));

    if (first.status === 'finished' && typeof first.winner_id === 'number') {
      const winnerName = db.prepare(`SELECT display_name FROM players WHERE id = ?`).get(first.winner_id).display_name;

      const allPlayerRows = db.prepare(`
        SELECT DISTINCT p.display_name
        FROM players p
          JOIN match_player_history mph ON mph.player_id = p.id
          JOIN match_history mh ON mh.id = mph.match_id
        WHERE mh.tournament_id = ?`).all(first.tournament_id);

        const allPlayerNames = allPlayerRows.map(r => r.display_name);

      const tx = await recordTournament(first.tournament_id, allPlayerNames, winnerName).catch(console.error);
    //   const txHash = tx.hash;
    //   const scores = await getScores();
    //   console.log('Scores from blockchain:', scores);
    //   console.log('Transaction hash:', txHash);
      return reply.code(200).send({message: 'Successfully finished tournament', item: { matches }});
    }

    // otherwise we “advanced”
    return reply.code(200).send({
      message: 'Successfully advanced tournament',
      item: { matches }
    });
  };

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
