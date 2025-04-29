import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from client.env
dotenv.config();

export default defineConfig({
	server: {
		https: {
			key: fs.readFileSync(path.resolve(process.env.SSL_KEY!)),
			cert: fs.readFileSync(path.resolve(process.env.SSL_CERT!)),
		},
		port: 5173,
		headers: {
			'Cross-Origin-Opener-Policy': '',
			'Cross-Origin-Embedder-Policy': '',
		},
	},
	plugins: [react()],
});