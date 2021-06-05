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

    function handleReorderFiles(files) {
        images = files.map(img => img.file);
    }
</script>


{#if FilePond}
    <svelte:component this={FilePond}
                      maxFiles={10}
                      {disabled}
                      {required}
                      allowMultiple
                      allowReorder
                      acceptedFileTypes={['image/*']}
                      onaddfile={handleAddFile}
                      onremovefile={handleRemoveFile}
                      onreorderfiles={handleReorderFiles}/>
{:else}
    <div class="italic">Chargement du picker...</div>
{/if}
