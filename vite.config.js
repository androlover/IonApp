import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: true, // required for LAN or ngrok access
    allowedHosts: 'all'
  }
});
