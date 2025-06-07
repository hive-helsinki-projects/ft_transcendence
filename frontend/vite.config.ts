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
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
			'@/app': path.resolve(__dirname, './src/app'),
			'@/pages': path.resolve(__dirname, './src/pages'),
			'@/components': path.resolve(__dirname, './src/components'),
			'@/hooks': path.resolve(__dirname, './src/hooks'),
			'@/utils': path.resolve(__dirname, './src/utils'),
			'@/assets': path.resolve(__dirname, './src/assets'),
			'@/styles': path.resolve(__dirname, './src/styles'),
			'@/types': path.resolve(__dirname, './src/types'),
			'@/services': path.resolve(__dirname, './src/services'),
			'@/contexts': path.resolve(__dirname, './src/contexts'),
		},
	},
});