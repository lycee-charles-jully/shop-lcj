<style>
    .container {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        margin: auto;
        min-height: calc(100vh - var(--header-height) - var(--spacing) * 2);
    }

    @media all and (min-width: 768px) {
        .container {
            min-height: calc(100vh - var(--header-height) * 3 - var(--spacing) * 2);
        }
    }
</style>


<div class="container">
    <slot/>
</div>
