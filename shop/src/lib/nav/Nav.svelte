<script>
    import NavLink from '$lib/nav/NavLink.svelte';
    import { session } from '$app/stores';
    import { staticImageUrl } from '$lib/helpers/image-url';
</script>


<style>
    header {
        display: flex;
        justify-content: space-between;
        height: var(--header-height);
        width: 100%;
        position: fixed;
        bottom: 0;
        left: 0;
        background-color: var(--light-gray);
        z-index: 10;
    }

    .header-img {
        display: none;
    }

    nav {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: flex-end;
        flex: 1;
    }

    @media all and (min-width: 768px) {
        header {
            top: 0;
            bottom: inherit;
        }

        .header-img {
            height: var(--header-height);
            width: var(--header-height);
            padding: 3px;
            display: block;
        }
    }
</style>


<header>
    <a href="/">
        <img class="header-img" height="100" src={staticImageUrl('shop-icon-v1.png')} width="100"/>
    </a>
    <nav>
        <NavLink href="/" icon="home" label="Accueil"/>
        <!--<NavLink href="/search" icon="search" label="Recherche"/>-->
        <NavLink href="/categories" icon="categories" label="Catégories" pattern={/^\/categories(\/|$)/}/>
        <NavLink href="/cart" icon="cart" label="Panier"/>
        <NavLink href="/{$session.user ? 'account' : 'login'}"
                 icon="person"
                 label={$session.user ? 'Compte' : 'Connexion'}
                 pattern={/^\/(account|login|register|order\/[a-f0-9]{24})(\/|$)/}/>
    </nav>
</header>
