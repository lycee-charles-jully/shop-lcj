<script lang="ts">
    import ImagesPicker from '$lib/ImagesPicker.svelte';
    import { REMOTE_ENDPOINT } from '$lib/api-url';
    import { processApiError } from '$lib/process-api-error';
    import { goto } from '$app/navigation';

    export let oldProduct;

    let error: string | null = null;
    let images: File[] = [];
    let initialImages: File[] = [];
    let loadingImagesUpdate = false;

    let imagesChanged = false;
    let initialImagesLoaded = false;
    $: imagesChanged = images.length !== initialImages.length
        || !images.every((img, index) => img.name === initialImages[index].name && img.size === initialImages[index].size);

    function handleInitialImagesLoad() {
        initialImages = images;
        initialImagesLoaded = true;
    }

    // TODO: fix bugs with file pond (requesting deleted file and visually removing some)

    async function updateImages() {
        if (loadingImagesUpdate || !initialImagesLoaded || !imagesChanged)
            return;
        loadingImagesUpdate = true;

        // Make a copy of the image list to modify it
        let imagesList = [ ...images ];

        // Add new images
        const newImages = imagesList.filter(img => !initialImages.find(initialImg => initialImg.name === img.name && initialImg.size === img.size));

        if (newImages.length > 0) {
            const body = new FormData();
            newImages.forEach(img => {
                body.append('images', img);
            });

            const newImagesNames = await fetch(`${REMOTE_ENDPOINT}/v1/product/${oldProduct._id}/images`, {
                method: 'POST',
                body,
            })
                .then(async res => ({ res, data: await res.json() }))
                .then(({ res, data }) => {
                    if (!res.ok)
                        throw processApiError(data);
                    if (typeof data.coverImageUrl !== 'string')
                        throw new Error('Réponse de l\'API invalide, veuillez réessayer');
                    // Return the new names of the added images. They are at the end
                    return [ data.coverImageUrl, ...data.imagesUrls ].slice(-1 * newImages.length);
                })
                .catch((err: Error) => {
                    console.error(err);
                    error = err.message;
                    loadingImagesUpdate = false;
                });

            if (!newImagesNames)
                return;

            // Replace the new images names with the ones that are generated
            let newImageNameIndex = 0;
            imagesList = imagesList.map(img => {
                // If the image is not new, return it
                if (!newImages.some(i => i.name === img.name && i.size === img.size))
                    return img;
                newImageNameIndex++;
                return {
                    ...img,
                    name: newImagesNames[newImageNameIndex - 1],
                };
            });
        }


        let imagesNames = imagesList.map(img => img.name);

        // Reorder images
        await fetch(`${REMOTE_ENDPOINT}/v1/product/${oldProduct._id}`, {
            method: 'PATCH',
            body: JSON.stringify({
                coverImageUrl: imagesNames[0],
                imagesUrls: imagesNames.slice(1),
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(async res => ({ res, data: await res.json() }))
            .then(({ res, data }) => {
                if (!res.ok)
                    throw processApiError(data);
                goto('./');
            })
            .catch((err: Error) => {
                console.error(err);
                error = err.message;
                loadingImagesUpdate = false;
            });

    }
</script>


<h2 class="text-xl font-bold mt-8 mb-4">Mettre à jour les images</h2>

{#if error}
    <p class="text-red-600 mb-2">{error}</p>
{/if}

<form on:submit|preventDefault={updateImages}>
    <ImagesPicker bind:images
                  disabled={loadingImagesUpdate || !initialImagesLoaded}
                  initialImages={oldProduct.images.map(src => `${REMOTE_ENDPOINT}/v1/file/${src}`)}
                  on:error={err => error = err?.detail?.main}
                  on:initialload={handleInitialImagesLoad}
                  required/>
    <button class="btn w-full mt-4" disabled={loadingImagesUpdate || !initialImagesLoaded || !imagesChanged}>
        Mettre à jour
    </button>
</form>
