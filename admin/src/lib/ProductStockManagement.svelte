<script>
    import { REMOTE_ENDPOINT } from '$lib/api-url';
    import Popup from '$lib/Popup.svelte';
    import { onMount } from 'svelte';

    export let product;

    const DEFAULT_STOCK_COUNT = 20;

    let loading;
    let error;

    let newStockCount;
    onMount(() => {
        newStockCount = product.stockCount ?? DEFAULT_STOCK_COUNT;
    });


    const enableStockManagement = () => updateStockCountValue(DEFAULT_STOCK_COUNT);
    const updateStockCount = () => newStockCount !== product.stockCount && updateStockCountValue(newStockCount);
    const disableStockManagement = () => updateStockCountValue(null)
        .then(() => isStockDisablePopupVisible = false);


    let isStockDisablePopupVisible = false;

    function closeStockDisablePopup() {
        if (loading)
            return;
        isStockDisablePopupVisible = false;
    }


    async function updateStockCountValue(stock) {
        if (loading)
            return;
        loading = true;

        await fetch(`${REMOTE_ENDPOINT}/v1/product/${product._id}`, {
            method: 'PATCH',
            body: JSON.stringify({
                stockCount: stock,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(async res => ({ res, data: await res.json() }))
            .then(({ res, data }) => {
                if (!res.ok)
                    throw new Error(data.message || JSON.stringify(data));
                product.stockCount = data.stockCount;
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

{#if product.stockCount === null}
    <p>Gestion du stock désactivée</p>
    <button class="btn bg-yellow-500 text-gray-800 w-full" on:click={enableStockManagement} disabled="{loading}">
        Activer
    </button>
{:else}
    Gestion du stock activée, {product.stockCount} en stock

    <div class="grid grid-cols-2 gap-2 md:gap-4 mt-2">
        <input class="input" type="number" min="0" max="500" bind:value={newStockCount} disabled={loading}/>
        <button class="btn bg-green-500 text-gray-800 w-full"
                disabled={loading || newStockCount === product.stockCount}
                on:click={updateStockCount}>
            Appliquer
        </button>
    </div>

    <button class="btn bg-orange-500 text-white mt-2 w-full"
            on:click={() => !loading && (isStockDisablePopupVisible = true)}
            disabled={loading}>
        Désactiver la gestion du stock
    </button>
{/if}


{#if isStockDisablePopupVisible}
    <Popup title="Désactiver la gestion du stock" on:close={closeStockDisablePopup}>
        <p class="mb-4">
            Désactiver la gestion du stock va permettre la commande d'un nombre illimité de {product.name}.
        </p>
        <button class="btn w-full bg-red-500 mb-2" on:click={disableStockManagement} disabled={loading}>
            Désactiver
        </button>
        <button class="btn w-full bg-transparent border border-red-500 border-solid"
                on:click={closeStockDisablePopup}
                disabled={loading}>
            Retour
        </button>
    </Popup>
{/if}