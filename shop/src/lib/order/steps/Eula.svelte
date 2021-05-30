<script>
    import Button from '$lib/layout/Button.svelte';
    import { createEventDispatcher } from 'svelte';
    import { goto } from '$app/navigation';

    const dispatch = createEventDispatcher();

    let accepted = false;
</script>


<h3>Conditions générales d'utilisation</h3>

<p>CGU</p>

<label>
    <input bind:checked={accepted} type="checkbox">
    J'ai lu et j'accepte les conditions
</label>

<Button disabled={!accepted} on:click={() => accepted && dispatch('nextstep')}>
    Commander
</Button>

<Button nomargin on:click={() => goto('/cart')} type="secondary">
    Refuser
</Button>
