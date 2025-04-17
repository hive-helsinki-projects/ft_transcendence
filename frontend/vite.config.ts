import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
	],
	server: {
		host: '0.0.0.0',
		headers: {
			'Content-Security-Policy': "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.gstatic.com https://apis.google.com; frame-ancestors 'self' https://accounts.google.com"
        }
	},
})