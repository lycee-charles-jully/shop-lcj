<script lang="ts">
    import type { CategoryPopulated } from '$types/categories';
    import { imageUrl } from '$lib/helpers/image-url';
    import { imgload } from '$lib/helpers/imgload';

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

    .card picture {
        width: 100%;
        border-radius: var(--round) var(--round) 0 0;
        padding-top: 100%;
    }

    .card span {
        text-align: center;
        display: block;
        margin: var(--short-spacing) var(--spacing);
    }
</style>


<a class="card" href="/categories/{category.slug}">
    <picture class="product-img" use:imgload>
        <img alt={category.name} height="200" loading="lazy" src={imageUrl(category?.products[0]?.coverImageUrl, 200)}
             width="200"/>
    </picture>
    <span>{category.name}</span>
</a>
