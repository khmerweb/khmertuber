<script>
let { data = '' } = $props()
let videos = JSON.parse(data.post.videos).reverse()
let title = data.post.title
let clicked = 0
let myElement
let url = $state(undefined)
let clickedPart = false

function setScreen(video,id,click){
    if(video['type'] == 'OK'){
        url = `//ok.ru/videoembed/${video['id']}`
    }else if(video['type'] == 'YouTube'){
        url = `https://www.youtube.com/embed/${video['id']}`
    }else if(video['type'] == 'YouTubePlaylist'){
        url = `https://www.youtube.com/embed/videoseries?list=${video['id']}`
    }else if(video['type'] === "Facebook"){
        url = `https://www.facebook.com/watch/?v=${video['id']}`
    }else if(video['type'] === "GoogleDrive"){
        url = `https://docs.google.com/file/d/${video['id']}/preview`
    }else if(video['type'] === "Vimeo"){
        url = `https://player.vimeo.com/video/${video['id']}`
    }else if(video['type'] === "Dailymotion"){
        url = `https://www.dailymotion.com/embed/video/${video['id']}`
    }else if(video['type'] === "iQIYI"){
        url = `https://em.iq.com/player.html?id=${video['id']}`
    }
}

function onClick(video,id,click){
    let myElement = document.getElementById("part"+clicked)
    myElement.classList.remove('clickedPart')
    let myElement2 = document.getElementById("part"+id)
    myElement2.classList.add('clickedPart')
    clicked = id
    setScreen(video,id,click)
}

setScreen(videos[0],0,false)

$effect(() => {
    myElement = document.getElementById("part0")
    myElement.classList.add('clickedPart')
})
</script>

{#if videos}
<div class="video">
    <div class="screen">
        {#if videos.type !== 'Facebook'}
        <div><iframe title=''  src={url} frameborder="0" allowfullscreen></iframe></div>
        {:else}
        <div class="fb-video" data-href={url} data-width="auto" data-show-captions="true"></div>
        {/if}
    </div>
    <div class="playlist">
    {#each videos as item, index }
        {#if index === videos.length-1}
        <button class="part" class:clickedPart={clickedPart} id="part{index}" onclick={() => onClick(videos[index], index,true)}>
            { title } ភាគ { index+1 } { videos[index].status }
        </button>
        {:else}
        <button class="part" class:clickedPart={clickedPart} id="part{index}" onclick={() => onClick(videos[index], index,true)}>
            { title } ភាគ { index+1 }
        </button>
        {/if}
    {/each}
    </div>
</div>
{/if}

<style>
    .video{
        padding-top: 20px;
    }
    .video .screen div{
        position: relative;
        padding-top: 56.25%;
        border: 1px solid black;
        overflow: hidden;
    }
    .video .screen div iframe{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
    .video .playlist{
        max-height: 405px;
        overflow: auto;
    }
    .video .playlist .part{
    text-align: left;
    padding: 10px;
    color: var(--playlist-color);
    display: block;
    height: auto;
    background: var(--playlist-part);
    border: 1px solid black;
    width: 100%;
    font: var(--body-font);
    font-size: 16px;
}
.video .playlist .part:last-child{
    margin-bottom: 0;
}
.video .playlist .part:hover{
    cursor: pointer;
    opacity: .7;
}
.clickedPart{
    background: var(--playlist-clicked-bg) !important;
    color: var(--playlist-clicked) !important;
}
</style>