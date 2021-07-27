<script context="module" lang="ts">
    import { getCartItems } from '$lib/api/cart/get-cart';
    import type { Load } from '@sveltejs/kit/types/page';

    export const load: Load = async ({ session, fetch }) => {
        if (!session.user)
            return {
                redirect: '/login?r=/cart',
                status: 302,
            };

        const { data: items, error, status } = await getCartItems(fetch);

        return {
            props: {
                items,
            },
            error: error && new Error(error),
            status,
        };
    };
</script>


<script lang="ts">
    import type { CartItemPopulated } from '$types/cart';
    import CartItem from '$lib/CartItem.svelte';
    import Meta from '$lib/Meta.svelte';
    import Button from '$lib/layout/Button.svelte';
    import Center from '$lib/layout/Center.svelte';
    import { session } from '$app/stores';
    import { goto } from '$app/navigation';
    import { currencyFormat } from '$lib/helpers/currency-format';

    export let items: CartItemPopulated[] = [];

    let error: string | null = null;
</script>


<Meta noindex title="Panier"/>


{#if error}<p class="error-message">{error}</p>{/if}


{#if !$session.user?.cart?.length}

    <Center>
        <h2>Votre panier est vide</h2>
    </Center>

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
