<script>
    import Ad from './partials/Ad.svelte'
    import Header from './partials/Header.svelte'
    import Menu from './partials/Menu.svelte';
    import Footer from './partials/Footer.svelte'
    let { data, children } = $props()
</script>

<svelte:head>
	<link href="/styles/base-frontend.css" rel="stylesheet" />
</svelte:head>

<scetion class="Layout">
    <Header {data} />
    <Menu {data} />
    <img style='display:none;' src={data.thumb} alt='' />
    {@render children(data)}
    <Ad />
    <Footer />
</scetion>