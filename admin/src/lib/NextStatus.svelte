<script lang="ts">
    export let currentStatus: 'WAITING_FOR_ACCEPTATION' | 'PREPARATING' | 'DELIVERING' | 'COMPLETED' | 'USER_CANCELLED' | 'ADMIN_CANCELLED';
    export let disabled: boolean = false;

    let nextStatus;

    $: if (currentStatus === 'WAITING_FOR_ACCEPTATION')
        nextStatus = 'PREPARATING';
    else if (currentStatus === 'PREPARATING')
        nextStatus = 'DELIVERING';
    else if (currentStatus === 'DELIVERING')
        nextStatus = 'COMPLETED';
</script>


<style>
    button {
        @apply rounded px-4 py-2 whitespace-nowrap mb-1;
    }
</style>


{#if nextStatus}
    {#if nextStatus === 'PREPARATING'}
        <button on:click {disabled} class="bg-purple-400">
            Marquer comme en préparation
        </button>
    {:else if nextStatus === 'DELIVERING'}
        <button on:click {disabled} class="bg-blue-400">
            Marquer comme en livraison
        </button>
    {:else if nextStatus === 'COMPLETED'}
        <button on:click {disabled} class="bg-green-400">
            Marquer comme complétée
        </button>
    {/if}
{/if}
