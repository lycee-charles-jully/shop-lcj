<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    export let quantity = 1;
    export let min = 1;
    export let max = 10;
    export let disabled = false;

    const dispatch = createEventDispatcher();

    function increaseQuantity() {
        if (quantity >= max || disabled)
            return;
        quantity++;
        dispatch('increase', quantity);
        dispatch('update', { type: 'INCREASE', quantity });
    }

    function decreaseQuantity() {
        if (quantity <= min || disabled)
            return;
        quantity--;
        dispatch('decrease', quantity);
        dispatch('update', { type: 'DECREASE', quantity });
    }
</script>


<style>
    div {
        display: inline-block;
        user-select: none;
    }

    img {
        cursor: pointer;
        display: inline-block;
        margin: 0 calc(var(--spacing) / 2);
        transform: translateY(4px);
    }
</style>


<div>
    <img alt="-" height="20" on:click={decreaseQuantity} src="/icons/decrease-btn.svg" width="20" class:disabled/>
    {quantity}
    <img alt="+" height="20" on:click={increaseQuantity} src="/icons/increase-btn.svg" width="20" class:disabled/>
</div>
