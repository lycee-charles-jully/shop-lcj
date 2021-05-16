<script>
    import { onMount } from 'svelte';

    export let images = [];
    export let disabled = false;
    export let required = false;
    export let id;


    let FilePond;

    onMount(async () => {
        FilePond = await import('$lib/file-pond').then(c => c.default);
    });


    function handleAddFile(_, img) {
        images = [...images, img.file];
    }

    function handleRemoveFile(_, img) {
        images = images.filter(i => i.name !== img.file.name && i.size !== img.file.size);
    }
</script>

<!-- TODO: handle allowReorder -->
<!-- TODO: handle errors -->

{#if FilePond}
    <svelte:component this={FilePond}
                      maxFiles={5}
                      {disabled}
                      {required}
                      allowMultiple={true}
                      acceptedFileTypes={['image/*']}
                      onaddfile={handleAddFile}
                      onremovefile={handleRemoveFile}/>
{/if}
