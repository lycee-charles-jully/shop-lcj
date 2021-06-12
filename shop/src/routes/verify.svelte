<script context="module" lang="ts">
    import type { Load } from '@sveltejs/kit/types/page';
    import type { User } from '$types/user';

    export const load: Load = ({ session }) => {
        if ((session.user as User | null)?.role !== 500)
            return {
                redirect: '/',
                status: 302,
            };
        return {};
    };
</script>


<script lang="ts">
    import Meta from '$lib/Meta.svelte';
    import InputContainer from '$lib/layout/InputContainer.svelte';
    import Button from '$lib/layout/Button.svelte';
    import Center from '$lib/layout/Center.svelte';
    import { session, page } from '$app/stores';
    import { getRedirectionUrl } from '$lib/helpers/get-redirection-url';
    import { verifyEmail } from '$lib/api/auth/verify-email';
    import { goto } from '$app/navigation';
    import * as Sentry from '@sentry/browser';

    let confirming = false;
    let code = '';
    let error: string | null = null;
    const redirectionURL = getRedirectionUrl($page.query);

    const lcjMail = [
        'mailto:lcjoff@gmail.com',
        '?subject=Impossible de recevoir l\'email de confirmation LCJ Shop',
        `&body=<Description du problème>%0A%0AAdresse email du compte : ${$session.user.email}`,
    ]
        .join('')
        .replace(/ /g, '%20')
        .replace(/'/g, '%27');


    function confirmCode() {
        confirming = true;

        verifyEmail(code)
            .then(({ data, error: err }) => {
                confirming = false;
                if (err)
                    return error = err;
                $session.user = data;
                Sentry.setUser({ email: data.email });
                goto(redirectionURL || '/', { replaceState: true });
            });
    }
</script>


<style>
    form {
        width: 100%;
        max-width: 440px;
    }

    input {
        width: 100%;
    }
</style>


<Meta title="Confirmation de l'email"/>


<Center>
    <form on:submit|preventDefault={confirmCode}>

        <h1>Confirmation de l'email</h1>

        <p>
            Un email contenant un code à 6 chiffres vous a été envoyé à l'adresse email <b>{$session.user.email}</b>.
            <br/>
            Veuillez entrer ce code dans l'encadré ci-dessous.
        </p>

        <p>
            <i>
                Note : si vous ne voyez pas ce mail, regardez dans vos spams. Et si vous ne le voyez toujours pas,
                contactez-nous à l'adresse <a href={lcjMail}>lcjoff@gmail.com</a>.
            </i>
        </p>

        {#if error}
            <p class="error-message">{error}</p>
        {/if}

        <InputContainer>
            <input bind:value={code}
                   disabled={confirming} inputmode="numeric"
                   maxlength="6" minlength="6" pattern={'^\\d{6}$'}
                   required
                   type="text">
        </InputContainer>

        <Button disabled={confirming}>Confirmer</Button>

    </form>
</Center>

