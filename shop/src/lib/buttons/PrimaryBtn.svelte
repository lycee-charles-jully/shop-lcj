<script lang="ts">
    export let disabled = false;
    export let icon: string | null = null;
</script>


<style>
    .add-cart-container {
        width: 100%;
        display: flex;
        justify-content: center;

    }

    .add-cart-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        max-width: 440px;
        padding: calc(var(--spacing) - 2px) var(--spacing)
    }

    .add-cart-text {
        display: inline-block;
        margin-left: 8px;
    }
</style>


<div class="add-cart-container">
    <button class="btn-primary add-cart-btn" on:click class:disabled>
        {#if icon}
            <img alt="+" height="24" src="/icons/{icon}" width="24"/>
        {/if}
        <span class="add-cart-text">
            <slot/>
        </span>
    </button>
</div>
