import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt', // Change to prompt to avoid auto-registration
      includeAssets: ['rupee-icon.svg'],
      manifest: {
        name: 'RupeeTrack - Smart Expense Manager',
        short_name: 'RupeeTrack',
        description: 'Smart expense tracker for Indian users with budgeting, analytics, and financial insights',
        theme_color: '#4F46E5',
        icons: [
          {
            src: '/rupee-icon.svg',
            sizes: '192x192',
            type: 'image/svg+xml'
          },
          {
            src: '/rupee-icon.svg',
            sizes: '512x512',
            type: 'image/svg+xml'
          }
        ]
      },
      // Disable service worker in development
      devOptions: {
        enabled: false
      }
    })
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});