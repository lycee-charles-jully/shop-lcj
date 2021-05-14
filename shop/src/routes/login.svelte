<script lang="ts">
    import Center from '$lib/Center.svelte';
    import InputContainer from '$lib/inputs/InputContainer.svelte';
    import { REMOTE_ENDPOINT } from '$lib/api-url';
    import { goto } from '$app/navigation';
    import { session } from '$app/stores';
    import { onMount } from 'svelte';

    let email: string;
    let password: string;

    let loggingIn = false;

    let error: string | null = null;


    onMount(() => {
        if ($session.auth)
            goto('/account', { replaceState: true });
    });

    function login() {
        if (loggingIn)
            return;
        loggingIn = true;
        error = null;
        fetch(`${REMOTE_ENDPOINT}/v1/auth/login`, {
            method: 'POST',
            body: JSON.stringify({
                email,
                password,
            }),
            headers: [
                [ 'Content-Type', 'application/json' ],
            ],
        })
            .then(res => {
                if (res.status === 401)
                    return error = 'Email ou mot de passe invalide.';
                if (res.status.toString().match(/[45]\d{2}/))
                    return error = 'Une erreur inconnue est survenue. Veuillez réessayer.';
                $session.auth = true;
                goto('/account', { replaceState: true });
            })
            .catch(err => {
                console.error(err);
                return error = 'Une erreur inconnue est survenue. Veuillez réessayer.';
            })
            .finally(() => loggingIn = false);
    }
</script>


<style>
    form {
        width: 100%;
        max-width: 440px;
    }

    input {
        width: 100%;
        margin-bottom: calc(var(--spacing) * 2);
    }

    button {
        width: 100%;
    }
</style>


<Center>
    <form on:submit|preventDefault={login}>

        <h2>Se connecter</h2>

        {#if error}
            <p class="error-message">{error}</p>
        {/if}

        <InputContainer label="Email" let:id>
            <input bind:value={email} disabled={loggingIn} {id} required type="email"/>
        </InputContainer>

        <InputContainer label="Mot de passe" let:id>
            <input bind:value={password} disabled={loggingIn} {id} required type="password"/>
        </InputContainer>

        <button class="btn-primary" class:disabled={loggingIn}>Connexion</button>

    </form>

    <p>Pas de compte ? <a href="/register" class="text-gradient">Créer un compte</a></p>
</Center>
