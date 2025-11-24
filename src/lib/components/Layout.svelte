<script>
    import Ad from './partials/Ad.svelte'
    import Header from './partials/Header.svelte'
    import Menu from './partials/Menu.svelte';
    let { data, children } = $props()
</script>

<scetion class="Layout">
    <Header {data} />
    <Menu {data} />
    <Ad />
    {@render children(data)}
</scetion>