import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
    vite: {
        plugins: [tailwindcss()]
    },
    output: 'static',

    adapter: netlify({
        imageCDN: false, //Ensure that images are actually being optimized at build time not site load time
    }),

    image: { 
        domains: ['epurfjikrqmjfjrdnuyy.supabase.co']
    },

    site: 'https://monarchmediallc.com'
});
