<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    export let title;

    const dispatch = createEventDispatcher();

    function handleBackdropClick(ev: CustomEvent<HTMLDivElement>) {
        if ((ev.target as HTMLDivElement).classList.contains('shop-backdrop'))
            dispatch('close');
    }
</script>


<div class="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-40 flex items-center justify-center shop-backdrop"
     on:click={handleBackdropClick}>
    <div class="w-96 max-w-full bg-white rounded bg-opacity-100 p-4">
        <h1 class="font-bold text-xl mb-4">
            <span class="inline-block mr-2 cursor-pointer" on:click={() => dispatch('close')}>✖</span>
            {title}
        </h1>
        <slot/>
    </div>
</div>
