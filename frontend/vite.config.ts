import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		host: true, // Allow external connections
		port: 5173,
	},
	build: {
		outDir: 'dist',
		sourcemap: false,
	},
	base: '/', // Ensure proper base path for production
})
