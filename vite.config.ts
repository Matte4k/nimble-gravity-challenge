import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://botfilter-h5ddh6dye8exb7ha.centralus-01.azurewebsites.net",
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
