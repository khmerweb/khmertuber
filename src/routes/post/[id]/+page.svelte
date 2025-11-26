<script>
    let { data } = $props()
    import Layout from '$lib/components/Layout.svelte'
    import Post from '$lib/components/Post.svelte';
</script>

<Layout { data } >
    <Post { data } />
</Layout>