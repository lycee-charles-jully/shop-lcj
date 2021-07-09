<script context="module" lang="ts">
    import type { Load } from '@sveltejs/kit/types/page';
    import { API_URL, REMOTE_ENDPOINT } from '$lib/api-url';

    export const load: Load = async ({ fetch, page }) => {

        let error: string | null = null, oldProduct;

        try {
            await fetch(`${API_URL}/v1/product/${page.params.product}`)
                .then(async res => ({ res, data: await res.json() }))
                .then(({ res, data }) => {
                    if (!res.ok)
                        throw new Error(data.message || JSON.stringify(data));
                    if (!data._id)
                        throw new Error('Le produit n\'est pas valide');
                    oldProduct = {
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
                oldProduct,
                error,
            },
        };
    };
</script>


<script lang="ts">
    import InputContainer from '$lib/InputContainer.svelte';
    import { goto } from '$app/navigation';
    import EditProductImages from '$lib/EditProductImages.svelte';

    export let oldProduct;
    export let error: string | null = null;

    let loading = false;

    let newProduct = { ...oldProduct };

    const hasChanged = (old, current) => typeof current === 'string'
        ? old.trim() !== current.trim()
        : old !== current;

    let canUpdate = false;
    $: canUpdate = hasChanged(oldProduct.name, newProduct.name)
        || hasChanged(oldProduct.description, newProduct.description)
        || hasChanged(oldProduct.price, newProduct.price);


    function updateProduct() {
        if (loading || !canUpdate)
            return;
        loading = true;

        delete newProduct._id;
        delete newProduct.images;

        fetch(`${REMOTE_ENDPOINT}/v1/product/${oldProduct._id}`, {
            method: 'PATCH',
            body: JSON.stringify(newProduct),
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'same-origin',
        })
            .then(async res => ({ res, data: await res.json() }))
            .then(({ res, data }) => {
                if (!res.ok)
                    throw new Error(data.message || JSON.stringify(data));
                return goto('./');
            })
            .catch(err => {
                console.error(err);
                error = err.message || err;
            })
            .finally(() => {
                newProduct._id = oldProduct._id;
                loading = false;
            });
    }
</script>


{#if error}
    <p class="text-red-600 mb-2">{error}</p>
{/if}


{#if newProduct?._id}

    <h2 class="text-xl font-bold">Mettre à jour les informations</h2>

    <form on:submit|preventDefault={updateProduct}>
        <div class="{hasChanged(oldProduct.name, newProduct.name) ? 'italic' : ''}">
            <InputContainer label="Nom" let:id>
                <input bind:value={newProduct.name}
                       class="input w-full"
                       disabled={loading} {id} required/>
            </InputContainer>
        </div>

        <div class="{hasChanged(oldProduct.description, newProduct.description) ? 'italic' : ''}">
            <InputContainer label="Description" let:id>
                <textarea bind:value={newProduct.description} class="input w-full" disabled="{loading}" {id} required
                          spellcheck="true"/>
            </InputContainer>
        </div>

        <div class="{hasChanged(oldProduct.price, newProduct.price) ? 'italic' : ''}">
            <InputContainer label="Prix" let:id>
                <input bind:value={newProduct.price} class="input w-full" disabled="{loading}" {id} min="0" required
                       step="0.01"
                       type="number"/>
            </InputContainer>
        </div>

        <button class="btn w-full mt-4" disabled={loading || !canUpdate}>Mettre à jour</button>
    </form>

    <EditProductImages {oldProduct}/>
{/if}
