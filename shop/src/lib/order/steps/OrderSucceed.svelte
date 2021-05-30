<script lang="ts">
    import Button from '$lib/layout/Button.svelte';
    import { onDestroy, onMount } from 'svelte';
    import { goto } from '$app/navigation';

    let endingTime: number;
    let intervalID: number;

    let h: number = 48;
    let m: number = 0;
    let s: number = 0;

    // TODO: easter egg on 0
    onMount(() => {
        endingTime = Date.now() + 86400 * 1000 * 2; // ends in 48h
        updateRemainingTime();
        intervalID = setInterval(updateRemainingTime, 1000) as number;
    });

    onDestroy(() => {
        clearInterval(intervalID);
    });

    function updateRemainingTime() {
        let remainingTime = (endingTime - Date.now()) / 1000;
        h = Math.floor(remainingTime / 3600);
        m = Math.floor((remainingTime - h * 3600) / 60);
        s = Math.floor(remainingTime - h * 3600 - m * 60);
    }

    function toDoubleDigits(time: number = 0) {
        const t = time.toString();
        return t.length === 2 ? t : `0${t}`;
    }
</script>


<h3>Yay, votre commande a bien été effectuée !</h3>
<p>
    Vous pouvez désormais prendre un coktail et vous relaxer pendant que nous nous occupons de tout !<br/>
    Vous pouvez à tout moment suivre l'avancement de votre commande ou l'annuler dans l'onglet
    <a href="/account" on:click|preventDefault={() => goto('/account', { replaceState: true })}>Compte</a>.
    À noter que vous disposez de {toDoubleDigits(h)}h {toDoubleDigits(m)}min {toDoubleDigits(s)}s pour l'annuler.
    Alors si vous n'êtes pas sûr, décidez vous !
</p>


<Button on:click={() => goto('/', { replaceState: true })}>
    Retour à l'accueil
</Button>
