<script>
    import { imageUrl } from '$lib/image-url';

    export let href;
    export let thumb;
    export let target;
    export let disabled = false;
</script>


<a class="block w-full bg-white rounded-md my-2 h-14 flex justify-start" {href} {target}>
    {#if thumb}
        <img src={imageUrl(thumb, 200)} class="h-14 w-14 rounded-l-md {disabled ? 'filter grayscale' : ''}"/>
    {/if}
    <div class="p-4 flex-1">
        <slot/>
    </div>
</a>
