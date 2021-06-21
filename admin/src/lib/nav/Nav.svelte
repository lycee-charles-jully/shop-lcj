<script>
    import NavLink from '$lib/nav/NavLink.svelte';
    import { session } from '$app/stores';
    import { staticImageUrl } from '$lib/image-url';
</script>


<style>
    #print-header {
        margin: 1cm 1cm 1rem;
    }
</style>


<header class="w-full bg-gray-100 flex justify-between fixed top-0 left-0 print:hidden">
    <span class="h-10 flex items-center px-4">Panneau d'admin</span>
    <nav class="flex justify-end">
        <NavLink label="Accueil"/>
        <NavLink href="products" label="Produits"/>
        <NavLink href="orders" label="Commandes"/>
    </nav>
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
