<style>
    .order-preview {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--spacing);
        height: calc(38px + var(--spacing) * 2);
        padding: var(--spacing);
        background-color: var(--white);
        border-radius: var(--round);
        margin-bottom: var(--spacing);
        cursor: progress;
    }

    .order-preview-body {
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        flex: 1;
        height: 100%;
    }

    .order-preview-text {
        background-color: var(--light-gray);
        width: 100%;
        height: 18px;
    }

    .chevron {
        height: 30px;
        width: 30px;
    }
</style>


<div class="order-preview">
    <div class="order-preview-body">
        <div class="order-preview-text"/>
        <div class="order-preview-text"/>
    </div>
    <img alt=">" class="chevron" height="24" src="/icons/chevron-right.svg" width="24"/>
</div>
