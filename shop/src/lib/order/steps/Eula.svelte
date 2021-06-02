<script>
    import Button from '$lib/layout/Button.svelte';
    import Popup from '$lib/layout/Popup.svelte';
    import { createEventDispatcher } from 'svelte';
    import { goto } from '$app/navigation';

    const dispatch = createEventDispatcher();

    let accepted = false;
    let showDisallowPopup = false;
</script>


<style>
    .no-bm {
        margin-bottom: 5px;
    }

    .no-mt {
        margin-top: 5px;
    }

    ul {
        padding-inline-start: 30px;
    }

    .big-mb {
        margin-bottom: calc(var(--spacing) * 2);
    }
</style>


<h3>Conditions générales d'utilisation</h3>

<h4>Clause n° 1 : Objet</h4>
<p>
    Les conditions générales de vente décrites ci-après détaillent les droits et obligations de la Maison des lycéens et
    des élèves dans le cadre de la vente des marchandises suivantes : goodies LCJ et support rétroéclairé. <br/>
    Toute prestation accomplie par la Maison des lycéens implique donc l'adhésion sans réserve de l'acheteur aux
    présentes conditions générales de vente.
</p>

<h4>Clause n° 2 : Prix</h4>
Les prix des marchandises vendues sont ceux en vigueur au jour de la
prise de commande. Ils sont libellés en euros et calculés hors taxes.
La Maison des lycéens s'accorde le droit de modifier ses tarifs à tout
moment. Toutefois, elle s'engage à facturer les marchandises commandées
aux prix indiqués lors de l'enregistrement de la commande.

<h4>Clause n° 3 : Modalités de paiement</h4>
<p class="no-bm">
    Le règlement des commandes s'effectue au moment de la livraison :
</p>
<ul class="no-mt">
    <li>soit par liquide</li>
    <li>soit par chèque</li>
</ul>

<h4>Clause n° 4 : Annulation de commande</h4>
<p>
    Si dans les 48 heures qui suivent la commande, l'acheteur n’a pas annulé sa commande, il sera dans l’obligation
    d’honorer son paiement.
</p>

<h4>Clause n° 5 : Livraison</h4>
<p class="big-mb">
    La livraison est effectuée par la remise directe de la marchandise à l'acheteur au bureau des surveillants. Le délai
    de livraison indiqué lors de l'enregistrement de la commande n'est donné qu'à titre indicatif et n'est aucunement
    garanti.
</p>

<label>
    <input bind:checked={accepted} type="checkbox">
    J'ai lu et j'accepte les conditions
</label>

<Button disabled={!accepted} on:click={() => accepted && dispatch('nextstep')}>
    Commander
</Button>

<Button nomargin on:click={() => showDisallowPopup = true} type="secondary">
    Refuser
</Button>

{#if showDisallowPopup}
    <Popup on:close={() => showDisallowPopup = false} backdrop>
        <h1>Refuser les CGU</h1>
        <p>Vous devez accepter les conditions générales d'utilisation afin d'effectuer une commande.</p>
        <Button on:click={() => showDisallowPopup = false}>Retour</Button>
        <Button type="secondary" on:click={() => goto('/cart')} nomargin>Refuser</Button>
    </Popup>
{/if}
