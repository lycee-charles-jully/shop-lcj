<script>
    import { tweened } from 'svelte/motion';
    import { cubicOut } from 'svelte/easing';
    import { fade } from 'svelte/transition';
    import { onMount } from 'svelte';


    export let status = 'hidden';

    const progress = tweened(0, {
        duration: 5000,
        easing: cubicOut
    });

    onMount(start);

    $: if (status === 'full')
        fill();

    $: if ($progress > 110)
        hide();

    function start() {
        $progress = 90;
    }

    function fill() {
        $progress += 600;
    }

    function hide() {
        status = 'hidden';
    }
</script>


<style>
    progress, progress::-webkit-progress-bar {
        width: 100%;
        outline: none;
        border: none;
        background: transparent;
        position: fixed;
        top: 0;
        left: 0;
        height: 5px;
        -webkit-appearance: none;
        appearance: none;
        z-index: 20;
    }

    @media all and (min-width: 768px) {
        progress, progress::-webkit-progress-bar {
            top: var(--header-height);
        }
    }

    progress::-moz-progress-bar {
        background-image: var(--gradient);
    }

    progress::-webkit-progress-value {
        background-image: var(--gradient);
    }
</style>


<progress max="100" out:fade={{duration: 100}} value={$progress}/>
