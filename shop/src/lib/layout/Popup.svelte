<script>
    import { createEventDispatcher } from 'svelte';

    export let backdrop = false;

    const dispatch = createEventDispatcher();
</script>


<style>
    .backdrop {
        z-index: 50;
        position: fixed;
        top: 0;
        left: 0;
        height: 100vh;
        width: 100vw;
        background-color: var(--blur);
    }

    .popup {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        height: auto;
        width: 440px;
        max-width: calc(100vw - var(--spacing) * 2);
        max-height: calc(100vh - var(--spacing) * 2);
        padding: var(--spacing);
        background-color: var(--white);
        border-radius: var(--round);
        overflow: hidden auto;
    }
</style>


<div class:backdrop on:click={e => e.target.classList.contains('backdrop') && dispatch('close')}>
    <div class="popup">
        <slot/>
    </div>
</div>
