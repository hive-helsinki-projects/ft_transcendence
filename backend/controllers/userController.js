import db from '../models/database.js';
import bcrypt from 'bcryptjs';
import fs   from 'fs'
import path from 'path'

// Fetch all users
const getUsers = async (req, reply) => {
    try {
        const users = db.prepare('SELECT * FROM users').all();
        return reply.send(users);
    } catch (error) {
        console.error(error);
        return reply.code(500).send({ error: 'Failed to fetch users' });
    }
};

// Fetch a single user by ID
const getUser = async (req, reply) => {
    const { id } = req.params;

    try {
        const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
        if (!user) {
            return reply.code(404).send({ error: 'User not found' });
        }
        return reply.send(user);
    } catch (error) {
        console.error(error);
        return reply.code(500).send({ error: 'Failed to fetch user' });
    }
};

// Update user information
const updateUser = async (req, reply) => {
  const { id } = req.params
  const userId = parseInt(id, 10)

  // Only the logged-in user may update their own profile
  if (req.user.id !== userId) {
    return reply.code(403).send({ error: "Unauthorized to update this user’s information" })
  }

  try {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId)
    if (!user) {
      return reply.code(404).send({ error: 'User not found' })
    }

    const {
      username,
      password,
      email,
      avatar_url,      // allow updating avatar_url via JSON if needed
      two_fa_enabled,
      two_fa_secret,
    } = req.body

    // Check for username/email conflicts
    if (username && username !== user.username) {
      const existing = db.prepare('SELECT * FROM users WHERE username = ?').get(username)
      if (existing) {
        return reply.code(400).send({ error: 'Username already taken' })
      }
    }
    if (email && email !== user.email) {
      const existingEmail = db.prepare('SELECT * FROM users WHERE email = ?').get(email)
      if (existingEmail) {
        return reply.code(400).send({ error: 'Email already in use' })
      }
    }

    // Build updated record
    const updateData = {
      username:     username ?? user.username,
      password_hash: user.password_hash,
      email:        email ?? user.email,
      avatar_url:   avatar_url ?? user.avatar_url,
      two_fa_enabled: two_fa_enabled ?? user.two_fa_enabled,
      two_fa_secret:  two_fa_secret ?? user.two_fa_secret,
    }

    // If password provided, hash it
    if (password) {
      const saltRounds = parseInt(process.env.SALT_ROUNDS, 10) || 10
      updateData.password_hash = await bcrypt.hash(password, saltRounds)
    }

    // Run the UPDATE
    db.prepare(
      `UPDATE users
         SET username     = ?,
             password_hash= ?,
             email        = ?,
             avatar_url   = ?,
             two_fa_enabled = ?,
             two_fa_secret  = ?
       WHERE id = ?`
    ).run(
      updateData.username,
      updateData.password_hash,
      updateData.email,
      updateData.avatar_url,
      updateData.two_fa_enabled ? 1 : 0,
      updateData.two_fa_secret,
      userId
    )

    // Return the fresh user row (excluding password_hash)
    const updated = db
      .prepare(`
        SELECT id,
               username,
               email,
               avatar_url,
               online_status,
               created_at,
               two_fa_enabled
        FROM users
        WHERE id = ?
      `)
      .get(userId)

    updated.avatar_url    = updated.avatar_url || ''
    updated.online_status = Boolean(updated.online_status)
    updated.two_fa_enabled = Boolean(updated.two_fa_enabled)

    return reply.send({ message: 'User updated successfully', item: updated })
  } catch (error) {
    console.error(error)
    return reply.code(500).send({ error: 'Internal server error' })
  }
};

// Delete a friend from the user's friend list
const deleteUser = async (req, reply) => {
  const { id } = req.params
  const userId = parseInt(id, 10)

  if (req.user.id !== userId) {
    return reply.code(403).send({ error: "Unauthorized to delete this user" })
  }

  try {
    const userExist = db.prepare('SELECT COUNT(*) AS count FROM users WHERE id = ?').get(userId)
    if (!userExist.count) {
      return reply.code(404).send({ error: 'User not found' })
    }

    db.prepare('DELETE FROM users WHERE id = ?').run(userId)
    return reply.send({ message: 'User deleted successfully' })
  } catch (error) {
    console.error(error)
    return reply.code(500).send({ error: 'Internal server error' })
  }
};

const uploadAvatar = async (req, reply) => {
  const { id } = req.params
  const userId = parseInt(id, 10)

  if (req.user.id !== userId) {
    return reply.code(403).send({ error: 'Unauthorized to upload avatar for this user' })
  }

  let file
  try {
    file = await req.file()   // fastify-multipart puts the stream here
  } catch {
    return reply.code(400).send({ error: 'No file provided' })
  }

  const { file: fileStream, filename, mimetype } = file

  if (!/^image\/(png|jpe?g|gif)$/.test(mimetype)) {
    return reply.code(400).send({ error: 'Only PNG/JPG/GIF files are allowed' })
  }

  // Build a unique filename: "user_<id>_<timestamp>.<ext>"
  const ext = path.extname(filename) || ''
  const newFilename = `user_${userId}_${Date.now()}${ext}`

  // Ensure the uploads folder exists
  const uploadDir = path.join(process.cwd(), 'uploads')
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
  }

  const destPath = path.join(uploadDir, newFilename)

  // Save the file on disk
  try {
    await new Promise((resolve, reject) => {
      const writeStream = fs.createWriteStream(destPath)
      fileStream.pipe(writeStream).on('finish', resolve).on('error', reject)
    })
  } catch (err) {
    console.error('File write error:', err)
    return reply.code(500).send({ error: 'Failed to save file' })
  }

  const publicUrl = `/uploads/${newFilename}`

  // Update the user’s avatar_url in the database
  try {
    db.prepare('UPDATE users SET avatar_url = ? WHERE id = ?').run(publicUrl, userId)

    const updated = db
      .prepare(`
        SELECT id,
               username,
               email,
               avatar_url,
               online_status,
               created_at,
               two_fa_enabled
        FROM users
        WHERE id = ?
      `)
      .get(userId)

    updated.avatar_url     = updated.avatar_url || ''
    updated.online_status  = Boolean(updated.online_status)
    updated.two_fa_enabled = Boolean(updated.two_fa_enabled)

    return reply.send({
      message: 'Avatar uploaded successfully',
      item:    updated,
    })
  } catch (dbErr) {
    // Roll back on DB failure: delete the file we just wrote
    fs.unlinkSync(destPath)
    console.error('DB update error:', dbErr)
    return reply.code(500).send({ error: 'Failed to update avatar in database' })
  }
}

export default {
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    uploadAvatar
};
