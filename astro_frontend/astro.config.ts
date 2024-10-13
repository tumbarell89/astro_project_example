import { defineConfig } from 'astro/config';
// import starlight from '@astrojs/starlight';
import type { ManifestOptions } from "vite-plugin-pwa";
import manifest from "./webmanifest.json";
import AstroPWA from "@vite-pwa/astro";
import tailwind from '@astrojs/tailwind';

import react from '@astrojs/react';

import sentry from '@sentry/astro';
import spotlightjs from '@spotlightjs/astro';

// https://astro.build/config
export default defineConfig({
    integrations: [
    AstroPWA({
        workbox: {
          skipWaiting: true,
          clientsClaim: true,
          navigateFallback: "/404",
          ignoreURLParametersMatching: [/./],
          globPatterns: ['**/*.{html,js,css,png,svg,json,ttf,pf_fragment,pf_index,pf_meta,pagefind,wasm,tsx}'],
        },
         experimental: {
          directoryAndTrailingSlashHandler: true,
        },
        mode: "production",
        registerType: 'autoUpdate',
        manifest: (manifest as Partial<ManifestOptions>)
		  }), tailwind(), react(), sentry(), spotlightjs()],
       
});
