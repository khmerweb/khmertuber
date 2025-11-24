<script>
    import Layout from "$lib/components/Layout.svelte";
    import Home from "$lib/components/Home.svelte"
    let {data} = $props()
</script>

<Layout {data}>
    <Home {data} />
</Layout>
