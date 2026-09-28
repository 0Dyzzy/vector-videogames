import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// En build (GitHub Pages): /vector-videogames/
// En dev local: /
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/vector-videogames/' : '/',
  plugins: [react()],
}));
