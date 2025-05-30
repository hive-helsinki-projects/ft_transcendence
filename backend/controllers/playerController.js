import db from '../models/database.js';

// Fetch all players for current authenticated user
const getPlayers = async (req, reply) => {
    const user_id = req.user.id;

    try {
        const players = db.prepare(`SELECT * FROM players WHERE user_id = ?`).all(user_id);

        return reply.code(200).send(players);
    } catch (error) {
        console.error(error);
        return reply.code(500).send({ error: 'Failed to fetch players' });
    }
};

// Fetch all players for a specific user
const getUserPlayers = async (req, reply) => {
    const { userId } = req.params;

    try {
        const players = db.prepare(`SELECT * FROM players WHERE user_id = ?`).all(userId);

        return reply.code(200).send(players);
    } catch (error) {
        console.error(error);
        return reply.code(500).send({ error: 'Failed to fetch players' });
    }
};

// Fetch a specific player by ID for the authenticated user
const getPlayer = async (req, reply) => {
    const { id } = req.params;

    try {
        const player = db.prepare(`SELECT * FROM players WHERE id = ?`).get(id);

        // If the player is not found or the user is not authorized
        if (!player) {
            return reply.code(404).send({ error: 'Player not found or user not authorized to access player info' });
        }

        return reply.code(200).send(player);
    } catch (error) {
        console.error(error);
        return reply.code(500).send({ error: 'Failed to fetch player' });
    }
};

// Create a new player for the authenticated user
const createPlayer = async (req, reply) => {
    const user_id = req.user.id;
    const { display_name, avatar_url } = req.body;

    const newPlayer = {
        user_id: parseInt(user_id),
        display_name,
        avatar_url: avatar_url ?? null
    };

    try {
        // Check if the user already has the maximum allowed number of players
        const playerCount = db.prepare(`SELECT COUNT(*) AS count FROM players WHERE user_id = ?`).get(user_id);
        if (playerCount.count >= 8) {
            return reply.code(400).send({ error: 'Cannot add another player. Max players is 8' });
        }

        // Insert the new player into the database
        const result = db.prepare(`INSERT INTO players (user_id, display_name, avatar_url) VALUES (?, ?, ?)`)
            .run(newPlayer.user_id, newPlayer.display_name, newPlayer.avatar_url);

        // Fetch the created player details
        const player = db.prepare('SELECT id, display_name, avatar_url, wins, losses, created_at FROM players WHERE id = ?')
            .get(result.lastInsertRowid);

        return reply.code(201).send({
            message: 'Player created successfully',
            item: player
        });
    } catch (error) {
        // Handle the unique constraint error for display_name
        if (error.message.includes('UNIQUE constraint failed: players.display_name')) {
            return reply.code(409).send({ error: 'Display name already exists' });
        }
        console.error(error);
        return reply.code(500).send({ error: 'Internal server error' });
    }
};

// Delete a player by ID for the authenticated user
const deletePlayer = async (req, reply) => {
    const user_id = req.user.id;
    const { id } = req.params;

    try {
        const result = db.prepare(`DELETE FROM players WHERE id = ? AND user_id = ?`).run(id, user_id);

        // If no rows were deleted, either the player doesn't exist or the user is unauthorized
        if (result.changes === 0) {
            return reply.code(404).send({ error: 'Player not found or user not authorized to delete this player' });
        }

        return reply.code(200).send({ message: 'Player deleted successfully' });
    } catch (error) {
        console.error(error);
        return reply.code(500).send({ error: 'Failed to delete player' });
    }
};

// Update a player's details by ID for the authenticated user
const updatePlayer = async (req, reply) => {
    const user_id = req.user.id;
    const { id } = req.params;
    const { display_name, avatar_url } = req.body;

    try {
        // Fetch the player to check if the user is authorized to update it
        const player = db.prepare(`SELECT * FROM players WHERE id = ? AND user_id = ?`).get(id, user_id);

        // If player not found or user is unauthorized
        if (!player) {
            return reply.code(404).send({ error: 'Player not found or user not authorized to update this player' });
        }

        // Check if the new display name is already taken
        if (display_name && display_name !== player.display_name) {
            const existingPlayer = db.prepare(`SELECT * FROM players WHERE display_name = ?`).get(display_name);
            if (existingPlayer) {
                return reply.code(400).send({ error: 'Display name already taken' });
            }
        }

        // Update the player's details
        const updatedPlayer = {
            display_name: display_name ?? player.display_name,
            avatar_url: avatar_url ?? player.avatar_url
        };

        db.prepare(`UPDATE players SET display_name = ?, avatar_url = ? WHERE id = ?`)
            .run(updatedPlayer.display_name, updatedPlayer.avatar_url, id);

        return reply.code(200).send({
            message: 'Player updated successfully',
            item: updatedPlayer
        });
    } catch (error) {
        console.error(error);
        return reply.code(500).send({ error: 'Failed to update player' });
    }
}

export default {
    getPlayers,
    getUserPlayers,
    getPlayer,
    createPlayer,
    deletePlayer,
    updatePlayer
}
