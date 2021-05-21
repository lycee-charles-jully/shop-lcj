<script lang="ts">
    import type { CartItemPopulated } from '$types/cart';
    import CartItem from '$lib/CartItem.svelte';
    import Meta from '$lib/Meta.svelte';
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


{#if error}<p class="error-message">{error}</p>{/if}


{#if !fetched}
    {#each Array($session.user?.cart?.length || 0).fill() as _}
        <CartItem/>
    {/each}
{:else}
    {#each items as item}
        <CartItem {...item}/>
    {/each}
{/if}