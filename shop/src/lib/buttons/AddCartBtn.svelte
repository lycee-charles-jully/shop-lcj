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
    <button class="btn-primary add-cart-btn"
            on:click>
        <img alt="+" height="24" src="/icons/cart-add-white.svg" width="24"/>
        <span class="add-cart-text">Ajouter au panier</span>
    </button>
</div>
