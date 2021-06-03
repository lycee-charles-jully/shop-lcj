<script lang="ts">
    import Popup from '$lib/layout/Popup.svelte';
    import { REMOTE_ENDPOINT } from '$lib/helpers/api-url';
    import Button from '$lib/layout/Button.svelte';
    import { session } from '$app/stores';
    import { goto } from '$app/navigation';

    export let show = false;
    export let processing = false;


    function disconnect() {
        if (processing)
            return;
        processing = true;

        fetch(`${REMOTE_ENDPOINT}/v1/auth/logout`)
            .then(res => {
                if (!res.ok)
                    return;
                show = false;
                $session.user = null;
                goto('/login', { replaceState: true });
            })
            .finally(() => processing = false);
    }
</script>


<style>
    .header {
        display: flex;
        align-items: center;
        width: 100%;
    }

    .close-popup-btn {
        cursor: pointer;
        height: 30px;
    }

    .header h1 {
        display: inline-block;
        font-size: 1.6rem;
        margin: 0 0 0 var(--spacing);
    }
</style>


{#if show}
    <Popup backdrop on:close={() => !processing && (show = false)}>
        <div class="header">
            <img alt="x"
                 class="close-popup-btn"
                 height="24"
                 on:click={() => !processing && (show = false)}
                 src="/icons/cross-highlight.svg"
                 width="24"/>
            <h1>Déconnexion</h1>
        </div>

        <p>Êtes vous sûr de vouloir vous déconnecter ?</p>

        <Button disabled={processing} on:click={disconnect}>Déconnexion</Button>
        <Button nomargin type="secondary" disabled={processing}>Retour</Button>
    </Popup>
{/if}
