import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
    vite: {
        plugins: [tailwindcss()]
    },

    integrations: [
        icon(),
        sitemap({
            filter: (page) => {
                const { pathname } = new URL(page);

                return !pathname.startsWith('/admin') && !pathname.startsWith('/api');
            }
        })
    ],

    output: 'static',

    adapter: netlify({
        imageCDN: false //Ensure that images are actually being optimized at build time not site load time
    }),

    image: {
        domains: ['epurfjikrqmjfjrdnuyy.supabase.co']
    },

    site: 'https://monarchmediallc.com'
});
