<script context="module" lang="ts">
    import type { Load } from '@sveltejs/kit/types/page';

    export const load: Load = ({ session }) => {
        if (!session.user)
            return {
                redirect: '/login?r=/cart',
                status: 302,
            };
        return {};
    };
</script>


<script lang="ts">
    import type { CartItemPopulated } from '$types/cart';
    import CartItem from '$lib/CartItem.svelte';
    import Meta from '$lib/Meta.svelte';
    import Button from '$lib/layout/Button.svelte';
    import Center from '$lib/layout/Center.svelte';
    import { onMount } from 'svelte';
    import { session } from '$app/stores';
    import { goto } from '$app/navigation';
    import { currencyFormat } from '$lib/helpers/currency-format';
    import { getCartItems } from '$lib/api/cart/get-cart';

    let items: CartItemPopulated[] = [];
    let fetched = false;
    let error: string | null = null;

    onMount(() => {
        getCartItems()
            .then(({ data, error: err }) => {
                if (err)
                    error = err;
                if (data)
                    items = data;
                fetched = true;
            });
    });
</script>


<Meta title="Panier"/>

<svelte:head>
    <link as="image" href="/icons/increase-btn.svg" rel="preload" type="image/svg+xml">
    <link as="image" href="/icons/decrease-btn.svg" rel="preload" type="image/svg+xml">
    <link as="image" href="/icons/trash-highlight.svg" rel="preload" type="image/svg+xml">
</svelte:head>


{#if error}<p class="error-message">{error}</p>{/if}


{#if !$session.user?.cart?.length}

    <Center>
        <h2>Votre panier est vide</h2>
    </Center>

{:else}

    {#if !fetched}
        {#each Array($session.user?.cart?.length || 0).fill() as _}
            <CartItem/>
        {/each}
    {:else}
        {#each items as item}
            <CartItem {...item}
                      on:countchange={ev => item.count = ev.detail}
                      on:error={ev => error = ev.detail?.message || ev.details}
                      on:delete={ev => items = items.filter(i => i.product._id !== ev.detail)}/>
        {/each}
        <Button on:click={() => goto('/order')}>
            Commander ({currencyFormat(items.reduce((prev, val) => prev + val.product.price * val.count, 0))})
        </Button>
    {/if}

{/if}
