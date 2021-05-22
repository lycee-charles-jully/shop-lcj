<script lang="ts">
    import type { BasicProduct } from '$types/products';
    import QuantitySelector from '$lib/QuantitySelector.svelte';
    import { imageUrl } from '$lib/image-url';
    import { currencyFormat } from '$lib/currency-format';
    import { REMOTE_ENDPOINT } from '$lib/api-url';
    import { session } from '$app/stores';
    import type { User } from '$types/user';
    import { createEventDispatcher } from 'svelte';

    export let product: BasicProduct | null = null;
    export let count = 1;


    const dispatch = createEventDispatcher();


    function updateProductCount(ev: CustomEvent) {
        const type = ev.detail.type as 'INCREASE' | 'DECREASE';
        fetch(`${REMOTE_ENDPOINT}/v1/cart/${product._id}`, {
            method: 'PATCH',
            body: JSON.stringify({ count }),
            credentials: 'same-origin',
            headers: [
                [ 'Content-Type', 'application/json' ],
            ],
        })
            .then(async res => ({ res, data: await res.json() }))
            .then(({ res, data }) => {
                if (!res.ok)
                    throw new Error(data.message || data);
                $session.user.cart = ($session.user as User).cart.map(item => {
                    if (item.product !== product._id)
                        return item;
                    item.count = count;
                    return item;
                });
                dispatch('countchange', count);
            })
            .catch(err => {
                if (type === 'INCREASE')
                    count--;
                else
                    count++;
                dispatch('error', err);
            })
            .finally();
    }

    let deletingItem = false;

    function deleteItem() {

        if (deletingItem)
            return;
        deletingItem = true;

        fetch(`${REMOTE_ENDPOINT}/v1/cart/${product._id}`, {
            method: 'DELETE',
            credentials: 'same-origin',
        })
            .then(async res => ({ res, data: await res.json() }))
            .then(({ res, data }) => {
                if (!res.ok)
                    throw new Error(data.message || data);
                $session.user.cart = ($session.user as User).cart.filter(i => i.product !== product._id);
                dispatch('delete', product._id);
            })
            .catch(e => dispatch('error', e))
            .finally(() => deletingItem = false);
    }
</script>


<style>
    .card {
        --card-height: 100px;
        width: 100%;
        height: var(--card-height);
        background-color: var(--white);
        margin: 0 0 var(--spacing);
        border-radius: var(--round);
        display: flex;
    }

    .thumbnail {
        width: var(--card-height);
        height: var(--card-height);
        border-radius: var(--round) 0 0 var(--round);
    }

    .body {
        display: flex;
        flex-direction: column;
        flex: 1;
        padding: var(--spacing);
    }

    .body > * {
        line-height: 20px;
    }

    h2 {
        margin: 0;
        font-size: 18px;
    }

    h2 a {
        color: var(--black);
    }

    .quantity-select {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex: 1;
    }

    .trash-icon {
        cursor: pointer;
        transform: translateY(2px);
    }

    .gray-bg {
        background-color: var(--light-gray);
        color: var(--light-gray);
        user-select: none;
    }

    @media all and (min-width: 768px) {
        .gray-bg {
            background-color: var(--dark-gray);
            color: var(--dark-gray);
        }
    }
</style>


{#if product}

    <div class="card" class:disabled={deletingItem}>
        <a href="/product/{product.slug}">
            <img src={imageUrl(product.coverImageUrl, 200)} class="thumbnail"/>
        </a>

        <div class="body">
            <h2>
                <a href="/product/{product?.slug}">
                    {product.name}
                </a>
            </h2>
            <div class="quantity-select" style="transform: translateY(-2px)">
                <span>
                    Quantité :
                    <QuantitySelector bind:quantity={count} on:update={updateProductCount}/>
                </span>
                <img src="/icons/trash-highlight.svg" height="24" width="24" class="trash-icon" on:click={deleteItem}/>
            </div>
            <div>Prix total : {currencyFormat(product.price * count)}</div>
        </div>
    </div>

{:else}

    <div class="card">
        <div class="thumbnail gray-bg"/>

        <div class="body">
            <h2 class="gray-bg">easter egg haha</h2>
            <div class="quantity-select">
                <h2 class="gray-bg" style="width: 100%">easter egg haha</h2>
            </div>
            <h2 class="gray-bg">easter egg haha</h2>
        </div>
    </div>

{/if}
