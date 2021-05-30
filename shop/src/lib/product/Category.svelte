<script lang="ts">
    export let title: string;
    export let smallCards = false;
</script>


<style>
    .products-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    }

    .small-cards {
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    }

    @supports (grid-gap: var(--spacing)) {
        .products-container {
            grid-gap: var(--spacing);
        }
    }
</style>

{#if title}
    <h2 class="category-title">{title}</h2>
{/if}

<div class="products-container" class:small-cards={smallCards}>
    <slot/>
</div>
