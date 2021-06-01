<script lang="ts">
    import { imageUrl } from '$lib/image-url';

    export let images: string[] = [];
    export let productName: string;

    let selectedImage = images[0];
</script>


<style>
    @media all and (min-width: 440px) {
        .container {
            grid-template-columns: 1fr 100px;
        }
    }

    @media all and (min-width: 768px) {
        .container {
            grid-template-columns: 1fr;
        }
    }
</style>


<div class="w-full mb-4 grid grid-cols-1">
    <img alt={productName}
         class="w-full h-auto max-w-sm max-h-sm"
         height="500"
         src={imageUrl(selectedImage, 500)} width="500"/>
    <div class="flex flex-row overflow-auto">
        {#each images as src}
            <img src={imageUrl(src, 70)}
                 on:click={() => selectedImage = src}
                 height="70" width="70"
                 class="m-2 cursor-pointer border-2 {src === selectedImage ? 'border-red-600' : 'border-transparent'}"
                 alt={productName}/>
        {/each}
    </div>
</div>
