<script lang="ts">
    export let message;
</script>


<style>
    p {
        padding: var(--spacing);
        margin: 0 0 calc(var(--spacing) / 2) 0;
        background-color: rgba(208, 0, 0, .25);
        color: var(--primary);
        font-weight: bold;
        white-space: pre;
        border-radius: var(--round);
    }
</style>


<p>
    {message}
</p>
