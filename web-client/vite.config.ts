import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, "../.env") });

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  define: {
    SERVICE_API_HOST: JSON.stringify(process.env.SERVICE_API_HOST),
    CLIENT_REQUEST_TIMEOUT: JSON.stringify(process.env.CLIENT_REQUEST_TIMEOUT),
  },
})
