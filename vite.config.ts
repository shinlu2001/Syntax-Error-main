import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      // Proxy requests starting with /api/apollo to the Apollo endpoint.
      '/api/apollo': {
        target: 'https://api.apollo.io',
        changeOrigin: true,
        // Rewrite the URL so that /api/apollo is replaced by the Apollo API path.
        rewrite: (path) =>
          path.replace(/^\/api\/apollo/, '/api/v1/people/bulk_match?reveal_personal_emails=false&reveal_phone_number=false'),
      },
    },
  },
});
