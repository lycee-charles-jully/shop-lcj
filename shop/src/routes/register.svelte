<script lang="ts">
    import InputContainer from '$lib/inputs/InputContainer.svelte';
    import Center from '$lib/Center.svelte';

    let user = {
        email: '',
        firstname: '',
        lastname: '',
        password: '',
        grade: '',
        jeunestNumber: '',
    };

    let passwordConfirm;

    let error: string | null = null;

    let registering = false;

    function register() {
        if (registering)
            return;
        if (!checkPassword(user.password))
            return;
        if (user.password !== passwordConfirm) {
            error = 'Les deux mots de passe doivent être identique.';
            return;
        }
        registering = true;
    }

    function checkPassword(pwd: string) {
        if (!pwd.match(/[a-z]/)) {
            error = 'Le mot de passe doit contenir au moins une lettre minuscule.';
            return false;
        }
        if (!pwd.match(/[A-Z]/)) {
            error = 'Le mot de passe doit contenir au moins une lettre majuscule.';
            return false;
        }
        if (!pwd.match(/\d/)) {
            error = 'Le mot de passe doit contenir au moins un chiffre.';
            return false;
        }
        if (pwd.length <= 8) {
            error = 'Le mot de passe doit faire au moins 8 caractères.';
            return false;
        }
        return true;
    }
</script>


<style>
    form {
        width: 100%;
        max-width: 440px;
    }

    .two-cols {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-gap: var(--spacing);
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
    <form on:submit|preventDefault={register}>

        <h2>Créer un compte</h2>

        {#if error}
            <p class="error-message">{error}</p>
        {/if}

        <div class="two-cols">
            <InputContainer label="Nom" let:id>
                <input bind:value={user.lastname}
                       disabled={registering}
                       {id}
                       required type="text"
                       placeholder="Dupond"/>
            </InputContainer>
            <InputContainer label="Prénom" let:id>
                <input bind:value={user.firstname}
                       disabled={registering}
                       {id}
                       required
                       type="text"
                       placeholder="Timothé"/>
            </InputContainer>
        </div>

        <InputContainer label="Email" let:id>
            <input bind:value={user.email}
                   disabled={registering}
                   {id}
                   required
                   type="email"
                   placeholder="timothe.dupond@gmail.com"/>
        </InputContainer>

        <div class="two-cols">
            <InputContainer label="Classe" let:id>
                <input bind:value={user.grade}
                       disabled={registering}
                       {id}
                       required
                       type="text"
                       placeholder="TG1"/>
            </InputContainer>
            <InputContainer label="Numéro Jeun'Est" let:id>
                <input bind:value={user.jeunestNumber}
                       disabled={registering}
                       {id}
                       required
                       type="text"
                       placeholder="12345"
                       inputmode="numeric"/>
            </InputContainer>
            <!-- TODO: Jeun'Est hint -->
        </div>

        <InputContainer label="Mot de passe" let:id>
            <input bind:value={user.password}
                   disabled={registering}
                   {id}
                   required
                   minlength="8"
                   type="password"
                   placeholder="Au moins une majuscule, une minuscule et un chiffre"/>
        </InputContainer>

        <InputContainer label="Confirmation du mot de passe" let:id>
            <input bind:value={passwordConfirm}
                   disabled={registering}
                   {id}
                   required
                   minlength="8"
                   type="password"/>
        </InputContainer>

        <button class="btn-primary" class:disabled={registering}>Créer un compte</button>

    </form>

    <p>Déjà un compte ? <a href="/login" class="text-gradient">Se connecter</a></p>
</Center>
