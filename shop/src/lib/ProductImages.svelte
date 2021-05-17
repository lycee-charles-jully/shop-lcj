<script lang="ts">
    import { imageUrl } from '$lib/image-url';

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
    }

    .side-images {
        display: flex;
        flex-direction: row;
        overflow: auto;
    }

    .side-images img {
        width: 70px;
        height: 70px;
        object-fit: contain;
        margin: var(--spacing);
        cursor: pointer;
    }

    .side-images img.highlight {
        outline: var(--primary) 2px solid;
        outline-offset: 2px;
    }

    @media all and (min-width: 440px) {
        .container {
            grid-template-columns: 1fr calc(var(--spacing) * 2 + 70px);
        }

        .side-images {
            flex-direction: column;
        }
    }

    @media all and (min-width: 768px) {
        .container {
            grid-template-columns: 1fr;
        }

        .side-images {
            flex-direction: row;
        }
    }
</style>


<div class="container">
    <img alt={productName} class="main-image" src={imageUrl(selectedImage, 400)}/>
    <div class="side-images">
        {#each images as src}
            <img src={imageUrl(src, 70)}
                 on:click={() => selectedImage = src}
                 class:highlight={src === selectedImage}
                 alt={productName}/>
        {/each}
    </div>
</div>
