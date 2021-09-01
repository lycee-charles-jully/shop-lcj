<script lang="ts">
    import { session } from '$app/stores';
    import { updateAccount } from '$lib/api/account/update-account';
    import Meta from '$lib/Meta.svelte';
    import type { User } from '$types/user';
    import InputContainer from '$lib/layout/InputContainer.svelte';

    let newUserData = {
        firstname: ($session.user as User).firstname,
        lastname: ($session.user as User).lastname,
        grade: ($session.user as User).grade,
        jeunestNumber: ($session.user as User).jeunestNumber,
        phone: ($session.user as User).phone,
    };

    let updating = false;
    let success = false;
    let error: string | null = null;

    let hasInformationChanged = false;
    $: hasInformationChanged = ($session.user as User).firstname !== newUserData.firstname.trim()
        || ($session.user as User).lastname !== newUserData.lastname.trim()
        || ($session.user as User).grade !== newUserData.grade.trim()
        || ($session.user as User).jeunestNumber !== newUserData.jeunestNumber.trim()
        || ($session.user as User).phone !== newUserData.phone.trim();

    function update() {
        if (updating || !hasInformationChanged)
            return;
        updating = true;
        error = null;
        success = false;
        updateAccount(newUserData)
            .then(({ error: err, data: newUser }) => {
                updating = false;
                if (err)
                    return error = err;
                $session.user = newUser;
                success = true;
            });
    }
</script>


<style>
    h1 {
        margin-top: 0;
    }

    h1 img {
        height: 1em;
        transform: translateY(.12em);
    }

    input {
        width: 100%;
        margin-bottom: calc(var(--spacing) * 2);
    }

    button {
        width: 100%;
    }

    .success-message {
        color: #059669;
    }
</style>


<Meta noindex title="Modifier mes informations"/>


<h1>
    <a href="/account">
        <img alt="<" height="30" src="/icons/back-highlight.svg" width="30"/>
    </a>
    Modifier mes informations
</h1>

{#if error}
    <p class="error-message">{error}</p>
{/if}

{#if success}
    <p class="success-message">Vos informations ont été modifiées avec succès.</p>
{/if}

<form on:submit|preventDefault={update}>
    <InputContainer label="Nom" let:id>
        <input bind:value={newUserData.lastname}
               disabled={updating}
               {id}
               required
               type="text"/>
    </InputContainer>
    <InputContainer label="Prénom" let:id>
        <input bind:value={newUserData.firstname}
               disabled={updating}
               {id}
               required
               type="text"/>
    </InputContainer>
    <InputContainer label="Classe" let:id>
        <input bind:value={newUserData.grade}
               disabled={updating}
               {id}
               required
               type="text"/>
    </InputContainer>
    <InputContainer label="Numéro Jeun'Est" let:id>
        <input bind:value={newUserData.jeunestNumber}
               disabled={updating}
               {id}
               placeholder="12345"
               required
               type="text"/>
    </InputContainer>
    <InputContainer label="Téléphone portable" let:id>
        <input bind:value={newUserData.phone}
               disabled={updating}
               {id}
               pattern={'^(0[67](\\.\\d{2}){4}|0[67]\\d{8})$'}
               type="tel"/>
    </InputContainer>

    <button class="btn-primary" class:disabled={updating || !hasInformationChanged}>Mettre à jour</button>
</form>
