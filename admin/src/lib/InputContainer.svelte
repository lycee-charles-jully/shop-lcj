<script lang="ts">
    export let label: string | undefined;

    let id = Math.random().toString().slice(2);
</script>


<div class="my-4">
    <label for={id} class="block mb-2">{label}</label>
    <slot {id}/>
</div>
