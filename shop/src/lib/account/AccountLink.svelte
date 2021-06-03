<script lang="ts">
    export let href: string;
    export let target;
</script>


<style>
    a, a:link, a:visited {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: calc(var(--spacing) / 2);
        background-color: var(--white);
        color: var(--black);
        border-radius: var(--round);
    }

    div {
        padding: var(--spacing);
    }

    .chevron {
        height: 30px;
        width: 30px;
        margin-right: var(--spacing);
    }
</style>


<a {href} on:click {target}>
    <div>
        <slot/>
    </div>
    <img alt=">" class="chevron" height="24" src="/icons/chevron-right.svg" width="24"/>
</a>
