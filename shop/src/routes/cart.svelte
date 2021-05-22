<script lang="ts">
    import type { CartItemPopulated } from '$types/cart';
    import CartItem from '$lib/CartItem.svelte';
    import Meta from '$lib/Meta.svelte';
    import Center from '../lib/Center.svelte';
    import { onMount } from 'svelte';
    import { session } from '$app/stores';
    import { goto } from '$app/navigation';
    import { REMOTE_ENDPOINT } from '$lib/api-url';

    let items: CartItemPopulated[] = [];
    let fetched = false;
    let error: string | null = null;

    onMount(() => {
        if (!$session.user) {
            goto(`/login?r=/cart`, { replaceState: true });
            return;
        }

        fetch(`${REMOTE_ENDPOINT}/v1/cart`, {
            credentials: 'same-origin',
        })
            .then(async res => ({ res, data: await res.json() }))
            .then(({ res, data }) => {
                if (!res.ok)
                    throw new Error(data?.message || data);
                items = data;
                fetched = true;
            })
            .catch(e => error = e?.message || e);
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
{/if}


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
{/if}
