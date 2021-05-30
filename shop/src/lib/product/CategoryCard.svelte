<script lang="ts">
    import type { CategoryPopulated } from '$types/categories';
    import { imageUrl } from '$lib/helpers/image-url';

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
    <img alt={category.name} src={imageUrl(category?.products[0]?.coverImageUrl, 200)}/>
    <span>{category.name}</span>
</a>
