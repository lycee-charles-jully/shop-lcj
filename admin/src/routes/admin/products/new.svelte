<script lang="ts">
    import InputContainer from '$lib/InputContainer.svelte';
    import { REMOTE_ENDPOINT } from '$lib/api-url';
    import { goto } from '$app/navigation';
    import { processApiError } from '$lib/process-api-error';

    let name;
    let namePluralized;

    let loading;

    let error: string | null = null;

    function createProductType() {
        loading = true;
        error = null;

        fetch(`${REMOTE_ENDPOINT}/v1/product-type`, {
            method: 'POST',
            body: JSON.stringify({ name, namePluralized }),
            headers: [
                [ 'Content-Type', 'application/json' ],
            ],
            credentials: 'same-origin',
        })
            .then(async res => ({ res, data: await res.json() }))
            .then(({ res, data }) => {
                if (!res.ok) {
                    throw processApiError(data);
                } else {
                    goto(`/admin/products/${data._id}`);
                }
            })
            .catch(e => error = e?.message || e)
            .finally(() => loading = false);
    }
</script>


<h1 class="text-2xl mb-4">Nouveau type de produit</h1>

{#if error}
    <div class="text-red-500">{error}</div>
{/if}

<form on:submit|preventDefault={createProductType}>

    <InputContainer label="Nom" let:id>
        <input bind:value={name} {id} class="input w-full" disabled={loading} required/>
    </InputContainer>

    <InputContainer label="Nom au pluriel" let:id>
        <input bind:value={namePluralized} {id} class="input w-full" disabled={loading} required/>
    </InputContainer>

    <button class="btn w-full mt-4" disabled={loading}>Créer</button>

</form>
