<script lang="ts">
    export let mode: string;
    export let orderMode: string;
    export let disabled: boolean = false;
    export let last = false;
</script>


<div class="{!last ? 'mr-4' : ''} px-4 py-2 rounded select-none whitespace-nowrap {orderMode === mode ? 'bg-blue-500' : 'bg-gray-700 text-gray-300'} {disabled ? 'cursor-not-allowed' : 'cursor-pointer'}"
     on:click={() => !disabled && (orderMode = mode)}>
    <slot/>
</div>
