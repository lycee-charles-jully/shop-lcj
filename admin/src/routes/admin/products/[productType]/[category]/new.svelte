<script lang="ts">
    import InputContainer from '$lib/InputContainer.svelte';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { REMOTE_ENDPOINT } from '$lib/api-url';
    import { processApiError } from '$lib/process-api-error';
    import ImagesPicker from '$lib/ImagesPicker.svelte';
    import { onMount } from 'svelte';

    const productTypeID = $page.params.productType;
    const categorySlug = $page.params.category;

    let categoryID: string;

    onMount(() => {
        fetch(`${REMOTE_ENDPOINT}/v1/category`)
            .then(res => res.json())
            .then(categories => {
                categoryID = categories.find(c => c.slug === categorySlug)._id;
            });
    });

    let error: string | null = null;

    let loading = false;

    let name: string = '';
    let description: string = '';
    let price: number;
    let images: any[];


    function createProduct() {

        if (loading)
            return;
        loading = true;

        const body = new FormData();
        body.append('name', name);
        body.append('description', description);
        body.append('category', categoryID);
        body.append('price', price.toString());
        images.forEach(i => {
            body.append('images', i);
        });

        fetch(`${REMOTE_ENDPOINT}/v1/product`, {
            method: 'POST',
            body,
            credentials: 'same-origin',
        })
            .then(async res => ({ res, data: await res.json() }))
            .then(({ res, data }) => {
                if (!res.ok) {
                    throw processApiError(data);
                } else {
                    goto(`/admin/products/${productTypeID}/${categorySlug}/${data.slug}`);
                }
            })
            .catch(e => error = e?.message || e)
            .finally(() => loading = false);
    }
</script>


<h1 class="text-2xl mb-4">Nouveau produit</h1>

{#if error}
    <div class="text-red-600">{error}</div>
{/if}

<form on:submit|preventDefault={createProduct}>

    <InputContainer label="Nom" let:id>
        <input bind:value={name} class="input w-full" disabled={loading} {id} required/>
    </InputContainer>

    <InputContainer label="Description" let:id>
        <textarea bind:value={description} class="input w-full" disabled="{loading}" {id} required/>
    </InputContainer>

    <InputContainer label="Prix" let:id>
        <input bind:value={price} class="input w-full" disabled="{loading}" {id} min="0" required step="0.01"
               type="number"/>
    </InputContainer>

    <InputContainer label="Images (la première sera utilisée en couverture)">
        <ImagesPicker bind:images disabled={loading} required on:error={e => error = e?.detail?.main}/>
    </InputContainer>

    <button class="btn w-full mt-4" disabled={loading}>Créer</button>

</form>
