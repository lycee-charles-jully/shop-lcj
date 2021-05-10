<script lang="ts">
    import { page } from '$app/stores';

    export let icon: string;
    export let label: string;
    export let href: string;
    export let recurrent = false;

    let isLinkActive: boolean;

    $: isLinkActive = recurrent ? $page.path.startsWith(href) : $page.path === href;
</script>


<style>
    a {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }

    img {
        height: 40px;
        width: 40px;
    }

    span {
        font-size: .7rem;
    }

    @media all and (min-width: 440px) {
        span {
            font-size: 1rem;
        }
    }

    @media all and (min-width: 768px) {
        a {
            flex-direction: row;
            margin: auto 10px auto 30px;
            flex: none;
            font-weight: bold;
        }

        img {
            margin-right: 5px;
        }

        span {
            font-size: 1.1rem;
        }
    }

    @media all and (min-width: 1024px) {
        a {
            margin: auto 20px auto 40px;
        }

        img {
            margin-right: 10px;
        }

        span {
            font-size: 1.5rem;
        }
    }
</style>


<a {href}>
    <img src="/icons/{icon}{isLinkActive ? '-highlight' : ''}.svg">
    <span class:text-gradient={isLinkActive}>{label}</span>
</a>