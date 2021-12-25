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
    },
    onwarn(warning, defaultHandler) {
        if (warning.message === 'A11y: <img> element should have an alt attribute')
            return;
        defaultHandler(warning);
    }
};

export default config;
