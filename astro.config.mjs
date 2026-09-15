// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';
import { satteri } from "@astrojs/markdown-satteri";
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://shannonhubbell.com/',

  vite: {
    plugins: []
  },
  markdown: {
    processor: satteri(),
  },
  integrations: [sitemap(), mdx()]
});