<script>
    let { data } = $props()
    import Layout from '$lib/components/Layout.svelte'
    import Search from "$lib/components/Search.svelte"
</script>

<Layout { data } >
    <Search { data } />
</Layout>