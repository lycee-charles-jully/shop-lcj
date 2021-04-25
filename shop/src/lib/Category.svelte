<script lang="ts">
    export let title: string;
</script>


<style>
    .products-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    }

    @supports (grid-gap: var(--spacing)) {
        .products-container {
            grid-gap: var(--spacing);
        }
    }
</style>


<h2 class="category-title">{title}</h2>

<div class="products-container">
    <slot/>
</div>
