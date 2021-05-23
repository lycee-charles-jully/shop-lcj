<script lang="ts">
    export let disabled = false;
    export let icon: string | null = null;
</script>


<style>
    .btn-container {
        width: 100%;
        display: flex;
        justify-content: center;

    }

    button {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        max-width: 440px;
        padding: calc(var(--spacing) - 2px) var(--spacing)
    }

    .btn-text {
        display: inline-block;
        margin-left: 8px;
    }
</style>


<div class="btn-container">
    <button class="btn-primary" class:disabled on:click>
        {#if icon}
            <img alt="+" height="24" src="/icons/{icon}" width="24"/>
        {/if}
        <span class="btn-text">
            <slot/>
        </span>
    </button>
</div>
