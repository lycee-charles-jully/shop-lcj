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
                    product = {
                        name: data.name,
                        description: data.description,
                        price: data.price,
                        _id: data._id,
                        images: [ data.coverImageUrl, ...data.imagesUrls ],
                    };
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
    import EditProductImages from '$lib/EditProductImages.svelte';

    export let product;
    export let error: string | null = null;
</script>


{#if error}
    <p class="text-red-500 mb-2">{error}</p>
{/if}


{#if product?._id}
    <h2 class="text-xl font-bold mb-4">Mettre à jour les images</h2>

    <p class="mb-2">L'ordre des images compte. La première est utilisée comme image de couverture du produit.</p>

    <EditProductImages {product} bind:error/>
{/if}
