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
    import Popup from '$lib/Popup.svelte';

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


    let showDeletePopup = false;
    let deleteInputName = '';
    let deletingProduct = false;

    function promptDeletePopup() {
        deleteInputName = '';
        showDeletePopup = true;
    }

    function deleteProduct() {
        if (deletingProduct || deleteInputName !== product.name)
            return;
        deletingProduct = true;
        fetch(`${REMOTE_ENDPOINT}/v1/product/${product._id}`, {
            method: 'DELETE',
            body: JSON.stringify({ name: deleteInputName }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(async res => ({ res, data: await res.json() }))
            .then(({ res, data }) => {
                if (!res.ok)
                    throw new Error(data.message || JSON.stringify(data));
                goto('./', { replaceState: true });
            })
            .catch(err => {
                console.error(err);
                error = err.message || err;
                showDeletePopup = false;
                deletingProduct = false;
            });
    }
</script>


{#if error}
    <p class="text-red-500">{error}</p>
{/if}

{#if product && product._id}
    <h1 class="text-2xl font-bold mb-4">{product?.name}</h1>

    <div class="grid lg:grid-cols-2 gap-4">
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

            <button class="{product.available ? 'bg-red-500' : 'bg-green-500'} text-white w-full px-4 py-2 rounded mb-1"
                    on:click={toggleProductAvailability}>
                Rendre {product.available ? 'in' : ''}disponible
            </button>

            <button class="bg-red-600 text-white w-full px-4 py-2 rounded" on:click={promptDeletePopup}>
                Supprimer
            </button>
        </div>
    </div>
{/if}


{#if showDeletePopup}
    <Popup title="Supprimer le produit" on:close={() => showDeletePopup = false}>
        <p class="mb-2">Êtes-vous sur de vouloir supprimer <b>{product.name}</b> ?</p>
        Veuillez prendre en compte ces conséquences :
        <ul class="mb-2 list-disc list-inside">
            <li>Le produit sera supprimé définitivement, sans retour en arrière possible</li>
            <li>Les images seront supprimées</li>
            <li>Le produit sera retiré du panier de tous les utilisateurs</li>
        </ul>
        <p class="mb-2">À noter qu'il est impossible de supprimer un produit si il a été commandé au moins une fois.</p>
        <p class="mb-1">
            Afin de confirmer la suppression, veuillez écrire <b>{product.name}</b> dans l'encadré ci-dessous :
        </p>
        <input type="text"
               class="input bg-gray-100 w-full mb-2"
               bind:value={deleteInputName}
               on:paste|preventDefault on:dragenter|preventDefault on:dragover|preventDefault on:drop|preventDefault/>
        <button class="btn bg-red-600 text-white w-full"
                on:click={deleteProduct}
                disabled={deleteInputName !== product.name || deletingProduct}>
            Supprimer
        </button>
    </Popup>
{/if}
