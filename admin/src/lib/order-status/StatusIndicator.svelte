<script>
    let background;
    export { background as class };
    export let label;
    export let shrink = false;
</script>


<style>
    .labelled {
        @apply rounded px-2 py-1 whitespace-nowrap ;
    }

    .pellet {
        @apply h-8 w-8 rounded-full;
    }

    @media print {
        .labelled {
            display: inline-block;
            padding: 0;
            text-transform: lowercase;
        }

        .pellet {
            display: none;
        }
    }
</style>


<div class="labelled text-gray-800 print:text-black {shrink ? 'hidden md:inline-block' : ''} {background}">{label}</div>
<div class="pellet {shrink ? 'md:hidden' : 'hidden'} {background}"/>
