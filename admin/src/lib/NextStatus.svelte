<script lang="ts">
    import { statusColors } from '$lib/status-colors';

    export let currentStatus: 'WAITING_FOR_ACCEPTATION' | 'PREPARATING' | 'DELIVERING' | 'COMPLETED' | 'USER_CANCELLED' | 'ADMIN_CANCELLED';
    export let disabled: boolean = false;

    let nextStatus;

    $: if (currentStatus === 'WAITING_FOR_ACCEPTATION')
        nextStatus = 'PREPARATING';
    else if (currentStatus === 'PREPARATING')
        nextStatus = 'DELIVERING';
    else if (currentStatus === 'DELIVERING')
        nextStatus = 'COMPLETED';

    let color;
    $: color = statusColors.get(nextStatus);
</script>


<style>
    button {
        @apply rounded px-4 py-2 whitespace-nowrap;
    }
</style>


{#if nextStatus}
    <button class="bg-{color}" on:click {disabled}>
        {#if nextStatus === 'PREPARATING'}
            Marquer comme en préparation
        {:else if nextStatus === 'DELIVERING'}
            Marquer comme en livraison
        {:else if nextStatus === 'COMPLETED'}
            Marquer comme complétée
        {/if}
    </button>
{/if}
