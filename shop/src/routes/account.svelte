<script>
    import { goto } from '$app/navigation';
    import { session } from '$app/stores';
    import { onMount } from 'svelte';

    onMount(() => {
        if (!$session.user)
            goto('/login', { replaceState: true });
    });
</script>