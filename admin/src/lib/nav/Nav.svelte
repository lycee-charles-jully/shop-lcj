<script>
    import NavLink from '$lib/nav/NavLink.svelte';
    import { session } from '$app/stores';
    import { staticImageUrl } from '$lib/image-url';
    import NavCategory from '$lib/nav/NavCategory.svelte';

    export let productTypes = [];
</script>


<style>
    #print-header {
        margin: 1cm 1cm 1rem;
    }
</style>


<header class="w-64 h-screen bg-gray-700 text-gray-400 sticky top-0 left-0 z-10 p-2 max-h-screen overflow-y-auto print:hidden scroll">
    <a class="h-12 w-full flex items-center justify-center" href="/admin">
        <img class="h-8 mr-3" src={staticImageUrl('shop-icon-v1.png')}/>
        <span class="font-bold transform translate-y-0.5">Shop LCJ admin</span>
    </a>

    <NavCategory label="Accueil">
        <NavLink href="" label="Dashboard"/>
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


<div class="hidden print:flex px-4 justify-between items-center" id="print-header">
    <div class="flex items-center">
        <img class="h-8 w-8 inline mr-2" height="100" src={staticImageUrl('shop-icon-v1.png')} width="100"/>
        <span class="text-xl">Shop LCJ</span>
    </div>
    <span class="text-xl">
        {$session.user.firstname} {$session.user.lastname}
    </span>
</div>
