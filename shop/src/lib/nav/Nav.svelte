<script>
    import NavLink from './NavLink.svelte';
</script>
<style>
    nav {
        width: 100%;
        height: var(--header-height);
        background-color: var(--light-gray);
        position: fixed;
        bottom: 0;
        left: 0;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: flex-end;
    }

    @media all and (min-width: 768px) {
        nav {
            top: 0;
            bottom: inherit;
        }
    }
</style>


<nav>
    <NavLink href="/" icon="home" label="Accueil"/>
    <NavLink href="/search" icon="search" label="Recherche"/>
    <NavLink href="/categories" icon="categories" label="Catégories"/>
    <NavLink href="/cart" icon="cart" label="Panier"/>
    <NavLink href="/account" icon="person" label="Compte"/>
</nav>
