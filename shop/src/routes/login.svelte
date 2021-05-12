<script>
    import Center from '$lib/Center.svelte';
    import InputContainer from '$lib/inputs/InputContainer.svelte';

    let email;
    let password;
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
    <form on:submit|preventDefault={() => console.log({email, password})}>

        <h2>Se connecter</h2>

        <InputContainer label="Email" let:id>
            <input bind:value={email} {id} required type="email"/>
        </InputContainer>

        <InputContainer label="Mot de passe" let:id>
            <input bind:value={password} {id} required type="password"/>
        </InputContainer>

        <button class="btn-primary">Connexion</button>

    </form>

    <p>Pas de compte ? <a class="text-gradient">Créer un compte</a></p>
</Center>
