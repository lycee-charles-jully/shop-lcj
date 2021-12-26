<script lang="ts">
    import { createEventDispatcher, onMount } from 'svelte';
    import type { FilePond, FilePondFile } from 'filepond';

    export let images: File[] = [];
    export let disabled = false;
    export let required = false;
    export let allowDuplicates = false;
    export let initialImages = [];

    const dispatch = createEventDispatcher();


    let FilePond;
    let pond: FilePond;
    let allFilesLoaded = initialImages.length === 0;

    onMount(async () => {
        FilePond = await import('$lib/file-pond').then(c => c.default);
    });

    const syncFiles = () => images = pond.getFiles().map(f => f.file as File);

    function handleAddFile(err, img: FilePondFile) {
        syncFiles();

        if (err)
            return dispatch('error', err);

        // Remove image if it's duplicated
        if (!allowDuplicates && allFilesLoaded && images.filter(i => i.name === img.file.name && i.size === img.file.size).length > 1) {
            console.error(`[DUPLI] ${img.file.name}`);
            pond.removeFile(img.id);
            dispatch('error', { main: 'Ce fichier est déjà présent' });
            syncFiles();
        }

        // When all the initial images are loaded
        if (!allFilesLoaded && images.length === initialImages.length) {
            allFilesLoaded = true;
            dispatch('initialload');
        }
    }
</script>


<style global>
    .filepond--panel-root {
        border-radius: 0.25rem !important; /* rounded */
        background-color: rgb(75, 85, 99) !important; /* bg-gray-600 */
    }

    .filepond--drop-label {
        color: rgb(243, 244, 246) !important; /* bg-gray-100 */
    }

    .filepond--item-panel, .filepond--image-preview {
        border-radius: 0.25rem !important; /* rounded */
    }
</style>


{#if FilePond}
    <svelte:component this={FilePond}
                      bind:this={pond}
                      maxFiles={10}
                      {disabled}
                      {required}
                      allowMultiple
                      allowReorder
                      files={initialImages.map(source => ({ source }))}
                      acceptedFileTypes={['image/*']}
                      onaddfile={handleAddFile}
                      onremovefile={syncFiles}
                      onreorderfiles={syncFiles}/>
{:else}
    <div class="italic">Chargement du picker...</div>
{/if}
