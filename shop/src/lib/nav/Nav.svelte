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
        justify-content: end;
    }

    @media all and (min-width: 768px) {
        nav {
            top: 0;
            bottom: inherit;
        }
    }
</style>


<nav>
    <NavLink icon="home" label="Accueil" href="/"/>
    <NavLink icon="search" label="Recherche" href="/search"/>
    <NavLink icon="categories" label="Catégories" href="/categories"/>
    <NavLink icon="cart" label="Panier" href="/cart"/>
    <NavLink icon="person" label="Compte" href="/account"/>
</nav>
