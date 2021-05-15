import sveltePreprocess from 'svelte-preprocess';
import node from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: sveltePreprocess(),
    kit: {
        adapter: node(),
        target: '#svelte',
        ssr: false,
        paths: {
            base: '/admin',
        },
    }
};

export default config;
