<script lang="ts">
    import InputContainer from '$lib/InputContainer.svelte';
    import { slugify } from '$lib/slugify';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { REMOTE_ENDPOINT } from '$lib/api-url';
    import { processApiError } from '$lib/process-api-error';

    const productType = $page.params.productType;

    let error: string | null = null;

    let loading = false;

    let name: string = '';
    let slug: string = '';

    let slugChanged = false;

    $: if (!slugChanged)
        slug = slugify(name);

    const resetSlugChanged = () => slugChanged = false;

    $: if (slugChanged && slugify(name) === slug)
        resetSlugChanged();


    function createCategory() {
        fetch(`${REMOTE_ENDPOINT}/v1/category`, {
            method: 'POST',
            body: JSON.stringify({ name, slug, productType }),
            credentials: 'same-origin',
            headers: [
                [ 'Content-Type', 'application/json' ],
            ],
        })
            .then(async res => ({ res, data: await res.json() }))
            .then(({ res, data }) => {
                if (!res.ok) {
                    throw processApiError(data);
                } else {
                    goto(`/admin/products/${productType}/${data._id}`);
                }
            })
            .catch(e => error = e?.message || e)
            .finally(() => loading = false);
    }
</script>


<h1 class="text-2xl mb-4">Nouvelle catégorie</h1>

{#if error}
    <div class="text-red-600">{error}</div>
{/if}

<form on:submit|preventDefault={createCategory}>

    <InputContainer label="Nom" let:id>
        <input bind:value={name} class="input w-full" disabled={loading} {id} required/>
    </InputContainer>

    <InputContainer label="Slug (= nom sans caractères spéciaux, affiché dans l'URL)" let:id>
        <input bind:value={slug}
               class="input w-full"
               disabled={loading}
               {id}
               on:keydown={() => slugChanged = true}
               pattern="[a-z-]+"
               required/>
    </InputContainer>

    <button class="btn w-full mt-4" disabled={loading}>Créer</button>

</form>
