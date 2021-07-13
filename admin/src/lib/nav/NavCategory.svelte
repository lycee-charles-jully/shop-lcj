<script lang="ts">
    export let label: string;
</script>


<div class="w-full mt-8">
    <div class="uppercase text-sm mb-3">{label}</div>
    <slot/>
</div>
