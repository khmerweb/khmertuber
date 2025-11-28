<script>
    import Layout from "$lib/components/admin/Layout.svelte"
    import Items from "$lib/components/admin/Items.svelte"
    import { browser } from '$app/environment'
    import jq from 'jquery'
    import { activePage } from "$lib/stores/page.js"
    let { data, form } = $props()
    let category = $state(undefined)
    let categories = $state(data.post.categories)
    let json = $state(data.post.videos)
    let type = $state(undefined)
    let id = $state(undefined)
    let status = $state(undefined)
    let videos = $state([])
    if(data.post?.videos){
        videos = JSON.parse(data.post.videos)
    }else{
        videos = []
    }
    
    function getCategory(){
        if(categories === ''){
            categories += category
        }else{
            categories += (`, ${category}`)
        }
    }

    function submitForm(){
        if(videos.length){
            let newVideos = []
            let part = {}
            let key = {0:'type', 1:'id', 2:'status'}

            for(let v=1; v<=videos.length; v++){
                for(let j=0; j<3; j++){
                    part[key[j]] = jq(`.viddata div:eq(${v}) input:eq(${j})`).val()
                }

                newVideos.push({...part})
            }

            json = JSON.stringify(newVideos)
        }
    }

    const genJson = () => {        
        let video = {type, id, status}
        let success = false
    
        for(let v in video){
            if(!video[v]){
                alert('ចូរ​បំពេញ​កន្លែង​អត្តសញ្ញាណ​វីដេអូ')
                success = false
                break
            }else{
                success = true
            }
        }

        if(success){
            videos = [video, ...videos]
            json = JSON.stringify(videos)
        }  
    }

    function deleteRow(e) {
        let index = parseInt(e.target.innerHTML)
        videos.splice(videos.length - index, 1)
        videos = [...videos]
        json = JSON.stringify(videos)
    }

</script>

<Layout {data}>
    {#snippet editor()}
    <div class="Editor">
        <form action={`?/update&p=${$activePage}`} method="post" onsubmit={submitForm}>
            <input type="hidden" name="id" value={data.post._id} />
            <input type="hidden" name="author" value={data.post.author} />
            <input type="text" name="title" value={data.post.title} requred placeholder="ចំណងជើង" />
            <div class="wrapper">
                <textarea name="content" id="editor">{data.post.content}</textarea>
            </div>
            <input type="text" value={categories} oninput={e => categories = e.target.value} name="categories" required placeholder="ជំពូក" />
            <div class="frame">
                <select name="category" bind:value={category} onchange={getCategory} >
                    <option disabled selected>ជ្រើសរើស​យក​ជំពូក</option>
                    {#each data.categories as category}
                    <option>{category.title}</option>
                    {/each}
                </select>
                <input type="text" name="thumb" value={data.post.thumb} required placeholder="រូប​​តំណាង" />
                <input type="datetime-local" value={data.post.date} step="1" name="date" required />
                <input type="submit" value="ចុះ​ផ្សាយ" />
                <input type="hidden" name="videos" bind:value={json} />
            </div>
            {#if browser}
            <script src="/scripts/ckeditor/config.js"></script>
            {/if}
        </form>
        <div class='form'>
            <select name='type' bind:value={type} >
                <option>YouTube</option>
                <option>YouTubePlaylist</option>
                <option>iQIYI</option>
                <option>Facebook</option>
                <option>OK</option>
                <option>Dailymotion</option>
                <option>Vimeo</option>
            </select>
            <input name='videoid' bind:value={id} type='text' placeholder="អត្តសញ្ញាណ​វីដេអូ" required />
            <select name='status' bind:value={status} >
                <option>ចប់</option>
                <option>នៅ​មាន​ត</option>
                <option>~ ចប់</option>
            </select>
            <input onclick={genJson} type="button" value="បញ្ចូលវីដេអូ" />
        </div>

        <div class='viddata'>
            <div>
                {#if videos.length}
                <b>ប្រភេទ​វីដេអូ​</b><b>អត្តសញ្ញាណ​វីដេអូ​</b><b>ស្ថានភាព</b><b>ភាគ/លុប</b>
                {/if}
            </div>
            {#each videos as video, i}
            <div>
                <input value={video.type} required />
                <input value={video.id} required />
                <input value={video.status} required />
                <p title="Delete" onclick={deleteRow} class="episode">{videos.length-i}</p>
            </div>
            {/each}
        </div>
    </div>
    {/snippet}
    {#snippet items(data)}
        <Items {data} {form} />
    {/snippet}
</Layout>

<style>
    .Editor{
        background-color: white;
        height: 100%;
    } 
    .Editor .wrapper{
        height: 300px;
    }
    .Editor input, .Editor select,
    .Editor .form input, .Editor .form select{
        width: 100%;
        font: var(--body-font);
        padding: 3px 5px;
    }
    .Editor .frame, .Editor .form, .Editor .viddata div{
        display: grid;
        grid-template-columns: 20% 32.5% 32.5% 15%;
    }
    .Editor .viddata div{
        width: 100%;
    }
    .Editor .viddata div p:hover{
        cursor: pointer;
        color: red;
    }
    .Editor .viddata b,
    .Editor .viddata input,
    .Editor .viddata p{
        font: var(--body-font);
        padding: 5px;
        background: lightgrey;
        border: 1px solid grey;
        text-align: center;
        color: black;
    }
    .Editor .viddata input{
        background: white;
    }
</style>
