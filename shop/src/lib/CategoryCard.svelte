<script lang="ts">
    import type { CategoryPopulated } from '$lib/categories';

    export let category: CategoryPopulated;
</script>


<style>
    .card {
        color: var(--black);
        background-color: var(--white);
        border-radius: var(--round);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .card img {
        border-radius: var(--round) var(--round) 0 0;
    }

    .card span {
        text-align: center;
        display: block;
        margin: var(--short-spacing) var(--spacing);
    }
</style>


<a class="card" href="/categories/{category.slug}">
    <img alt={category.name} src={category?.products[0]?.coverImageUrl}/>
    <span>{category.name}</span>
</a>
