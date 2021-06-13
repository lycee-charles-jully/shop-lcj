<script lang="ts">
    export let mode: string;
    export let orderMode: string;
    export let disabled: boolean = false;
</script>


<div class="mr-4 px-4 py-2 rounded select-none whitespace-nowrap {orderMode === mode ? 'bg-blue-500 text-white' : 'bg-white'} {disabled ? 'cursor-not-allowed' : 'cursor-pointer'}"
     on:click={() => !disabled && (orderMode = mode)}>
    <slot/>
</div>
