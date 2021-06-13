<script>
    import '../../app.css';
    import Nav from '$lib/nav/Nav.svelte';
</script>


<style>
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
</style>


<svelte:head>
    <title>Panneau d'admin - Shop-lcj</title>
</svelte:head>

<Nav/>
<main class="sm:p-4 p-1 mx-auto max-w-5xl">
    <slot/>
</main>
