<script>
    import { imageUrl } from '$lib/image-url';

    export let href;
    export let thumb;
</script>


<a class="block w-full bg-white rounded-md my-2 h-14 flex justify-start" {href}>
    {#if thumb}
        <img src={imageUrl(thumb)} class="h-14 w-14 rounded-l-md"/>
    {/if}
    <div class="p-4">
        <slot/>
    </div>
</a>
