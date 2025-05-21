import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import db from '../models/database.js';
import { setup2faOpts, verify2faOpts, delete2faOpts, check2faOpts } from "../models/2faSchemas.js";

export default function twoFaRoutes(fastify, opts, done) {
    fastify.addHook("onRequest", fastify.jwtAuth);

    fastify.get("/2fa/status", check2faOpts, async (request, reply) => {
      const userId = request.user.id;
      const row = db
        .prepare("SELECT two_fa_enabled FROM users WHERE id = ?")
        .get(userId);

      if (!row) {
        return reply.code(404).send({ error: "User not found" });
      }

      return reply.send({ twoFaEnabled: !!row.two_fa_enabled });
    });

    fastify.get("/2fa/setup", setup2faOpts, async (request, reply) => {
      const userId = request.user.id;
      const secret = speakeasy.generateSecret({
        name: `PingPongApp (${request.user.email})`,
      });

      db.prepare("UPDATE users SET two_fa_secret = ? WHERE id = ?")
        .run(secret.base32, userId);

      const qrDataUrl = await qrcode.toDataURL(secret.otpauth_url);

      return reply.send({ qrDataUrl });
    });

    fastify.post("/2fa/verify", verify2faOpts, async (request, reply) => {
      const userId = request.user.id;
      const { token } = request.body;

      const row = db
        .prepare("SELECT two_fa_secret FROM users WHERE id = ?")
        .get(userId);

      if (!row || !row.two_fa_secret) {
        return reply.code(400).send({ error: "2FA is not set up" });
      }

      const verified = speakeasy.totp.verify({
        secret:   row.two_fa_secret,
        encoding: "base32",
        token,
        window:   1,
      });

      if (!verified) {
        return reply.code(400).send({ error: "Invalid 2FA code" });
      }

      db.prepare("UPDATE users SET two_fa_enabled = 1 WHERE id = ?").run(userId);
      return reply.send({ message: "2FA enabled" });
    });

    fastify.delete('/2fa', delete2faOpts, async (request, reply) => {
        const userId = request.user.id;

        // Check if the user has 2FA set up
        const row = db.prepare(`SELECT two_fa_secret FROM users WHERE id = ?`).get(userId);
        if (!row || !row.two_fa_secret) {
            return reply.code(400).send({ error: '2FA is not set up' });
        }

        // Remove the 2FA secret and disable 2FA
        db.prepare(`UPDATE users SET two_fa_secret = NULL, two_fa_enabled = 0 WHERE id = ?`).run(userId);

        return reply.send({ message: '2FA disabled' });
        })

    done();
  }
