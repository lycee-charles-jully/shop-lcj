<script>
    import NavLink from '$lib/nav/NavLink.svelte';
</script>


<header class="w-full bg-gray-100 flex justify-between">
    <span class="h-10 flex items-center px-4">Panneau d'admin</span>
    <nav class="flex justify-end">
        <NavLink label="Accueil"/>
        <NavLink href="products" label="Produits"/>
        <NavLink href="orders" label="Commandes"/>
    </nav>
</header>
