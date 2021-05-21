<script lang="ts">
    export let title;
    export let nomarker = false;

    const defaultTitle = 'Shop LCJ';
</script>

<svelte:head>
    <title>{title || defaultTitle}{title && !nomarker ? ' - Shop LCJ' : ''}</title>
</svelte:head>