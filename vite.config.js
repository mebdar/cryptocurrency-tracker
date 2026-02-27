import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Split out big charting libraries
            if (id.includes('apexcharts') || id.includes('recharts')) {
              return 'vendor-charts';
            }
            // Split out the rest as generic vendor
            return 'vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Optional: adjust the limit if you want to avoid warnings for 1MB
  },
})
