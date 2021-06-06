<script lang="ts">
    import Center from '$lib/layout/Center.svelte';
    import InputContainer from '$lib/layout/InputContainer.svelte';
    import { goto } from '$app/navigation';
    import { session, page } from '$app/stores';
    import Meta from '$lib/Meta.svelte';
    import * as Sentry from '@sentry/browser';
    import { onMount } from 'svelte';
    import { getRedirectionUrl } from '$lib/helpers/get-redirection-url';
    import { logUserIn } from '../lib/api/auth/log-user-in';

    let email: string;
    let password: string;

    let loggingIn = false;

    let error: string | null = null;

    const redirectionURL = getRedirectionUrl($page.query);


    onMount(() => {
        if ($session.user)
            goto('/account', { replaceState: true });
    });

    function login() {
        if (loggingIn)
            return;
        loggingIn = true;
        error = null;
        logUserIn({ email, password })
            .then(({ data, error: err }) => {
                if (err)
                    error = err;
                if (data && data.email) {
                    $session.user = data;
                    Sentry.setUser({ email: data.email });
                    if (redirectionURL?.startsWith('/admin'))
                        window.location.href = window.location.origin + redirectionURL;
                    else
                        goto(redirectionURL || '/', { replaceState: true });
                }
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


<Meta title="Connexion"/>


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

    <p>
        Pas de compte ?
        <a class="text-gradient" href="/register{redirectionURL ? `?r=${redirectionURL}` : ''}">
            Créer un compte
        </a>
    </p>
</Center>
