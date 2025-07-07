import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import tailwindcss from '@tailwindcss/vite';

// Load environment variables from client.env
dotenv.config();

export default defineConfig({
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
			'@components': path.resolve(__dirname, './src/components'),
			'@services': path.resolve(__dirname, './src/services'),
			'@pages': path.resolve(__dirname, './src/pages'),
			'@assets': path.resolve(__dirname, './src/assets'),
			'@hooks': path.resolve(__dirname, './src/hooks'),
			'@store': path.resolve(__dirname, './src/store'),
			'@types': path.resolve(__dirname, './src/types'),
			'@utils': path.resolve(__dirname, './src/utils'),
			'@features': path.resolve(__dirname, './src/features'),
			'@i18n': path.resolve(__dirname, './src/i18n'),
		},
	},
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
	plugins: [react(), tailwindcss()],
});