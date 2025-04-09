import db from '../models/database.js';

const getMatchHistories = async (req, reply) => {
    try {
        const matches = db.prepare(`
            SELECT
                mh.id AS match_id,
                mh.type,
                mh.tournament_id,
                mh.date,
                mwh.winner_id,
                mph.player_id,
                mph.score,
                mph.team,
                mph.round
            FROM match_history mh
            LEFT JOIN match_winner_history mwh
                ON mh.id = mwh.match_id
            LEFT JOIN match_player_history mph
                ON mh.id = mph.match_id;
        `)
        return reply.code(200).send(matches);
    } catch (error) {
        console.log(error);
        return reply.code(500).send({ error: 'Failed to fetch match-histories' })
    }
}

const getMatchHistory = async (req, reply) => {
    const { id } = req.params;

    try {
        const match = db.prepare(`
            SELECT
                mh.id AS match_id = ?,
                mh.type,
                mh.tournament_id,
                mh.date,
                mwh.winner_id,
                mph.player_id,
                mph.score,
                mph.team,
                mph.round
            FROM match_history mh
            LEFT JOIN match_winner_history mwh
                ON mh.id = mwh.match_id
            LEFT JOIN match_player_history mph
                ON mh.id = mph.match_id;
            `).get(id);
        if (!match) {
            return reply.code(404).send({ error: 'Match not found '});
        }
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
        console.log(result.lastInsertRowid);

        for (const winner of winners) {
            db.prepare(`INSERT INTO match_winner_history (match_id, winner_id) VALUES (?, ?)`).run(result.lastInsertRowid, winner.winner_id);
        }

        for (const player of players) {
            db.prepare(`
                INSERT INTO match_player_history
                (match_id, player_id, score, team, round)
                VALUES (?, ?, ?, ?, ?)    
            `)
            .run(result.lastInsertRowid, player.player_id, player.score, player.team, player.round)
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