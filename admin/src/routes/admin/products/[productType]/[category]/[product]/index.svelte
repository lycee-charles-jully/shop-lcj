<script context="module" lang="ts">
    import type { Load } from '@sveltejs/kit/types/page';
    import { API_URL } from '$lib/api-url';

    export const load: Load = async ({ fetch, page }) => {

        let error: string | null = null, product;

        try {
            await fetch(`${API_URL}/v1/product/${page.params.product}`)
                .then(async res => ({ res, data: await res.json() }))
                .then(({ res, data }) => {
                    if (!res.ok)
                        throw new Error(data.message || JSON.stringify(data));
                    if (!data._id)
                        throw new Error('Le produit n\'est pas valide');
                    product = data;
                })
                .catch(e => {
                    console.error(e);
                    error = e.message || e;
                });
        } catch (e) {
            error = e || e.message;
        }

        return {
            props: {
                product,
                error,
            },
        };
    };
</script>


<script lang="ts">
    import ProductImages from '$lib/ProductImages.svelte';
    import { sanitize } from '$lib/sanitize';
    import { currencyFormat } from '$lib/currency-format';
    import dayjs from 'dayjs';
    import { goto } from '$app/navigation';
    import { REMOTE_ENDPOINT } from '$lib/api-url';

    export let product;
    export let error: string | null = null;

    let loading = false;


    function toggleProductAvailability() {
        if (loading)
            return;
        loading = true;

        fetch(`${REMOTE_ENDPOINT}/v1/product/${product._id}`, {
            method: 'PATCH',
            body: JSON.stringify({
                available: !product.available,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'same-origin',
        })
            .then(async res => ({ res, data: await res.json() }))
            .then(({ res, data }) => {
                if (!res.ok)
                    throw new Error(data.message || JSON.stringify(data));
                product.available = !product.available;
            })
            .catch(err => {
                console.error(err);
                error = err.message || err;
            })
            .finally(() => {
                loading = false;
            });
    }
</script>


{#if error}
    <p class="text-red-500">{error}</p>
{/if}

{#if product && product._id}
    <h1 class="text-2xl font-bold mb-4">{product?.name}</h1>

    <div class="grid md:grid-cols-2 gap-4">
        <ProductImages images={[product.coverImageUrl, ...product.imagesUrls]}/>
        <div>
            <div class="mb-4">
                {@html sanitize(product.description).replace(/\n/g, '<br/>')}
            </div>
            <div class="mb-1">
                Prix : {currencyFormat(product.price)}
            </div>
            <div class="mb-1">
                Visible : {product.available ? 'oui' : 'non'}
            </div>
            <div class="mb-1">
                Tags : {product.tags.join(', ')}
            </div>
            <div class="mb-1">
                Identifiant dans l'URL : {product.slug}
            </div>
            <div class="mb-1">
                Identifiant dans la base de données : {product._id}
            </div>
            <div class="mb-1">
                Ajouté le {dayjs(product.createdAt).format('DD/MM/YYYY à HH:mm')}
            </div>
            <div class="mb-1">
                {#if product.stockCount === -1}
                    Gestion du stock désactivée
                {:else}
                    Gestion du stock activée, {product.stockCount} restant
                {/if}
            </div>
            <div class="mb-4">
                {product.viewCount} vue{product.viewCount > 1 ? 's' : ''},
                commandé {product.orderCount} fois
            </div>

            <button class="bg-blue-500 text-white w-full px-4 py-2 rounded mb-1"
                    on:click={() => goto(`./${product.slug}/edit`)}>
                Modifier
            </button>

            <button class="{product.available ? 'bg-red-500' : 'bg-green-500'} text-white w-full px-4 py-2 rounded"
                    on:click={toggleProductAvailability}>
                Rendre {product.available ? 'in' : ''}disponible
            </button>
        </div>
    </div>
{/if}
