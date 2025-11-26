<script>
    let { data } = $props()
    import Layout from '$lib/components/Layout.svelte'
    import Category from "$lib/components/Category.svelte"
</script>

<Layout { data } >
    <Category { data } />
</Layout>