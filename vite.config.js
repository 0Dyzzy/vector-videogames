import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Repo en GitHub Pages: https://0dyzzy.github.io/vector-videogames/
export default defineConfig({
  base: '/vector-videogames/',
  plugins: [react()],
});
