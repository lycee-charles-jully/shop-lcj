<script lang="ts">
    import { page } from '$app/stores';
    import { imageUrl, staticImageUrl } from '$lib/helpers/image-url';

    export let title;
    export let nomarker = false;
    export let description = 'Shop LCJ est le site de réservation en ligne des objets vendus par le Lycée Charles Jully, comme des goodies ou des diffuseurs.';
    export let remoteImage = false;
    export let noindex = false;
    export let image = 'android-chrome-512x512.png';

    const defaultTitle = 'Shop LCJ';
</script>

<svelte:head>
    <!-- Primary Meta Tags -->
    <title>{title || defaultTitle}{title && !nomarker ? ' - Shop LCJ' : ''}</title>
    <meta content="{title || defaultTitle}{title && !nomarker ? ' - Shop LCJ' : ''}" name="title">
    <meta content={description} name="description">

    <!-- Open Graph / Facebook -->
    <meta content="website" property="og:type">
    <meta content="https://shop-lcj.fr{$page.path}" property="og:url">
    <meta content={title} property="og:title">
    <meta content={description} property="og:description">
    <meta content={remoteImage ? imageUrl(image, 1000) : staticImageUrl(image)} property="og:image">

    <!-- Twitter -->
    <meta content="summary_large_image" property="twitter:card">
    <meta content="https://shop-lcj.fr{$page.path}" property="twitter:url">
    <meta content={title} property="twitter:title">
    <meta content={description} property="twitter:description">
    <meta content={remoteImage ? imageUrl(image, 1000) : staticImageUrl(image)} property="twitter:image">

    <!-- Search engines -->
    {#if noindex}
        <meta name="robots" content="noindex"/>
    {/if}
</svelte:head>
