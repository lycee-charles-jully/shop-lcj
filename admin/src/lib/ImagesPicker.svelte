<script>
    import { createEventDispatcher, onMount } from 'svelte';

    export let images = [];
    export let disabled = false;
    export let required = false;
    export let id;

    const dispatch = createEventDispatcher();


    let FilePond;

    onMount(async () => {
        FilePond = await import('$lib/file-pond').then(c => c.default);
    });


    function handleAddFile(err, img) {
        if (err)
            return dispatch('error', err);
        images = [...images, img.file];
    }

    function handleRemoveFile(err, img) {
        if (err)
            return dispatch('error', err);
        images = images.filter(i => i.name !== img.file.name && i.size !== img.file.size);
    }
</script>

<!-- TODO: handle allowReorder -->

{#if FilePond}
    <svelte:component this={FilePond}
                      maxFiles={5}
                      {disabled}
                      {required}
                      allowMultiple={true}
                      acceptedFileTypes={['image/*']}
                      onaddfile={handleAddFile}
                      onremovefile={handleRemoveFile}/>
{:else}
    <div class="italic">Chargement du picker...</div>
{/if}
