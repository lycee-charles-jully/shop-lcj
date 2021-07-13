<script>
    import { page } from '$app/stores';

    export let href = '';
    export let label;

    let pageSelected;
    $: pageSelected = $page.path === `/admin/${href}` || `${$page.path}/` === `/admin/${href}`;
</script>


<a class="mt-2 block {pageSelected ? 'text-gray-100' : ''} hover:text-gray-100 duration-200"
   href="/admin/{href}">
    {label}
</a>
