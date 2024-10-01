import { defineConfig } from 'astro/config';
import { pwaIntegration } from 'astro-pwa';

import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  plugins: [pwaIntegration()],
  integrations: [tailwind()]
});