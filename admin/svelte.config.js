import sveltePreprocess from 'svelte-preprocess';
import node from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: sveltePreprocess(),
    kit: {
        adapter: node({ out: 'build' }),
        target: '#svelte',
        appDir: 'admin',
        prerender: {
            enabled: false,
        },
    }
};

export default config;
