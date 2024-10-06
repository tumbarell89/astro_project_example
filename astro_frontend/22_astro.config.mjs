import { defineConfig } from 'astro/config';
import { pwaIntegration } from 'astro-pwa';

import tailwind from '@astrojs/tailwind';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  plugins: [pwaIntegration()],
  integrations: [tailwind(), react()]
});