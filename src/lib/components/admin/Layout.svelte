<script>
    let { data, children} = $props()
    import Header from "./Header.svelte";
</script>

<svelte:head>
	<link href="/styles/base-backend.css" rel="stylesheet" />
</svelte:head>

<Header {data} />
{@render children(data)}