<script>
    export let label;

    let id = Math.random().toString().slice(2);
</script>


<style>
    div {
        display: block;
    }
</style>


<div>
    {#if label}
        <!--suppress XmlInvalidId -->
        <label for={id}>{label}</label>
    {/if}
    <slot {id}/>
</div>
