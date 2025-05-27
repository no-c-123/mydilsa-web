//ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import tailwind from '@astrojs/tailwind';

import vercel from '@astrojs/vercel/serverless'; // <-- Add this

// https://astro.build/config
export default defineConfig({
  integrations: [react(), tailwind()],
  output: 'server', // Required for SSR
  adapter: vercel(), // <-- Add this
});
