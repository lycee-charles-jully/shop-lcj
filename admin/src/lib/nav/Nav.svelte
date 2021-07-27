<script lang="ts">
    import NavLink from '$lib/nav/NavLink.svelte';
    import { session } from '$app/stores';
    import { staticImageUrl } from '$lib/image-url';
    import NavCategory from '$lib/nav/NavCategory.svelte';

    export let productTypes = [];

    let showMobileHeader = false;

    function handleHeaderClick(ev: CustomEvent) {
        if (showMobileHeader && (ev.target as HTMLElement | null)?.tagName?.toLowerCase() === 'a')
            showMobileHeader = false;
    }
</script>


<style>
    header {
        max-width: 16rem; /* max-w-64 */
    }

    #print-header {
        margin: 1cm 1cm 1rem;
    }
</style>


<header class="w-full max-h-screen h-screen sm:sticky fixed top-0 left-0 z-30 p-2
               bg-gray-700 text-gray-400
               overflow-y-auto print:hidden
               transform {showMobileHeader ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0
               scroll"
        on:click={handleHeaderClick}>
    <a class="h-12 w-full flex items-center justify-center" href="/admin">
        <img class="h-8 mr-3" src={staticImageUrl('shop-icon-v1.png')}/>
        <span class="font-bold transform translate-y-0.5">Shop LCJ admin</span>
    </a>

    <NavCategory label="Accueil">
        <NavLink href="" label="Dashboard"/>
        <NavLink external href="/account" label="Retour au shop"/>
    </NavCategory>

    <NavCategory label="Produits">
        {#each productTypes as { namePluralized: label, _id }}
            <NavLink {label} href="products/{_id}"/>
        {/each}
        <NavLink href="products/new" label="+ Nouveau type"/>
    </NavCategory>

    <NavCategory label="Commandes">
        <NavLink href="orders" label="Toutes les commandes"/>
    </NavCategory>
</header>


<button class="fixed bottom-5 right-5 bg-gray-400 text-gray-900 px-4 py-2 rounded-full sm:hidden z-40"
        on:click={() => showMobileHeader = !showMobileHeader}>
    Menu
</button>


<div class="fixed top-0 left-0 z-20 h-screen w-screen bg-gray-900 opacity-50 {showMobileHeader ? '' : 'hidden'} sm:hidden"
     on:click={() => showMobileHeader = false}/>


<div class="hidden print:flex px-4 justify-between items-center" id="print-header">
    <div class="flex items-center">
        <img class="h-8 w-8 inline mr-2" height="100" src={staticImageUrl('shop-icon-v1.png')} width="100"/>
        <span class="text-xl">Shop LCJ</span>
    </div>
    <span class="text-xl">
        {$session.user.firstname} {$session.user.lastname}
    </span>
</div>
