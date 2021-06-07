<script lang="ts">
    import Popup from '$lib/layout/Popup.svelte';
    import { REMOTE_ENDPOINT } from '$lib/helpers/api-url';
    import Button from '$lib/layout/Button.svelte';
    import { session } from '$app/stores';
    import { goto } from '$app/navigation';
    import { disconnectUser } from '../api/auth/disconnect-user';

    export let show = false;
    export let processing = false;
    export let error: null | string = null;


    const closePopup = () => !processing && (show = false);

    function disconnect() {
        if (processing)
            return;
        processing = true;
        error = null;

        disconnectUser()
            .then(({ error: err }) => {
                processing = false;
                if (err)
                    return error = err;
                show = false;
                $session.user = null;
                goto('/login', { replaceState: true });
            });
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
    <Popup backdrop on:close={closePopup}>
        <div class="header">
            <img alt="x"
                 class="close-popup-btn"
                 height="24"
                 on:click={closePopup}
                 src="/icons/cross-highlight.svg"
                 width="24"/>
            <h1>Déconnexion</h1>
        </div>

        <p>Êtes vous sûr de vouloir vous déconnecter ?</p>

        {#if error}
            <p class="error-message">{error}</p>
        {/if}

        <Button disabled={processing} on:click={disconnect}>Déconnexion</Button>
        <Button nomargin type="secondary" disabled={processing} on:click={closePopup}>Retour</Button>
    </Popup>
{/if}
