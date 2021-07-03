<script lang="ts">
    import { imageUrl } from '$lib/helpers/image-url';
    import { imgload } from '$lib/helpers/imgload';

    export let images: string[] = [];
    export let productName: string;

    let selectedImage = images[0];
</script>


<style>
    .container {
        width: 100%;
        margin-bottom: var(--spacing);
        display: grid;
        grid-template-columns: 1fr;
    }

    .main-image {
        height: auto;
        width: 100%;
        max-width: 400px;
        max-height: 400px;
        padding-top: min(400px, 100%);
    }

    .side-images {
        display: flex;
        flex-direction: row;
        overflow: auto;
        gap: var(--spacing);
        padding: 4px;
    }

    .side-images picture {
        width: 70px;
        height: 70px;
        object-fit: contain;
        margin: var(--spacing) 0;
        cursor: pointer;
        flex-shrink: 0;
    }

    .side-images picture.highlight {
        outline: var(--primary) 4px solid;
    }

    @media all and (min-width: 440px) {
        .container {
            grid-template-columns: 1fr calc(var(--spacing) * 2 + 78px);
        }

        .side-images {
            flex-direction: column;
        }

        .side-images picture {
            margin: 0 var(--spacing);
        }
    }

    @media all and (min-width: 768px) {
        .container {
            grid-template-columns: 1fr;
        }

        .side-images {
            flex-direction: row;
        }

        .side-images picture {
            margin: var(--spacing) 0;
        }
    }
</style>


<div class="container">
    {#each images as src}
        {#if selectedImage === src}
            <picture class="product-img main-image" use:imgload>
                <img src={imageUrl(src, 500)} alt={productName} height="500" width="500"/>
            </picture>
        {/if}
    {/each}
    <div class="side-images">
        {#each images as src}
            <picture class="product-img"
                     use:imgload
                     class:highlight={src === selectedImage}
                     on:click={() => selectedImage = src}>
                <img src={imageUrl(src, 70)} height="70" width="70" alt={productName}/>
            </picture>
        {/each}
    </div>
</div>
