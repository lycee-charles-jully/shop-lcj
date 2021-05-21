<script>
    import { goto } from '$app/navigation';
    import { session } from '$app/stores';
    import Meta from '$lib/Meta.svelte';
    import { onMount } from 'svelte';

    onMount(() => {
        if (!$session.user)
            goto('/login?r=/account');
    });
</script>


<Meta title="Compte"/>
