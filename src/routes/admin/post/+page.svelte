<script>
    import Layout from "$lib/components/admin/Layout.svelte"
    import Items from "$lib/components/admin/Items.svelte"
    import { browser } from '$app/environment'
    import jq from 'jquery'

    let { data, form } = $props()
    let category = $state(undefined)
    let categories = $state('')
    let json = $state('')
    let type = $state(undefined)
    let id = $state(undefined)
    let status = $state(undefined)
    let videos = $state([])

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

    $effect(()=>{
        const date = new Date()
        const offsetMs = date.getTimezoneOffset() * 60 * 1000
        const dt = new Date(date.getTime() - offsetMs)
        const datetime = dt.toISOString()
        const now = datetime.split('.')[0]
        const element = document.querySelector('input[type="datetime-local"]')
        element.value = now
    })
    
    </script>
<Layout { data } >
    {#snippet editor()}
    <div class="Editor">
        <form action="/admin/post?/create" method="post" onsubmit={submitForm}>
            <input type="text" name="title" required placeholder="ចំណងជើង" />
            <div class="wrapper">
                <textarea name="content" id="editor"></textarea>
            </div>
            <input type="text" bind:value={categories} name="categories" required placeholder="ជំពូក" />
            <div class="frame">
                <select name="category" bind:value={category} onchange={getCategory} >
                    <option disabled selected>ជ្រើសរើស​យក​ជំពូក</option>
                    {#each data.categories as category}
                    <option>{category.title}</option>
                    {/each}
                </select>
                <input type="text" name="thumb" required placeholder="រូប​​តំណាង" />
                <input type="datetime-local" step="1" name="date" required />
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
                <button title="Delete" onclick={deleteRow} class="episode">{videos.length-i}</button>
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
        height: 310px;
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
    .Editor .viddata div button:hover{
        cursor: pointer;
        color: red;
    }
    .Editor .viddata b,
    .Editor .viddata input{
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