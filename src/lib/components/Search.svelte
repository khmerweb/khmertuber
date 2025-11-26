<script>
    let { data } = $props()
    let Posts = $state(data.posts)
    async function getPosts(e){
        const response = await fetch(`/search/${e.target.value}/${data.q}`)
        const posts = await response.json()
        Posts = posts
    }
</script>

<section class="Category region" data-sveltekit-reload>
    <div class="container">
        {#each Posts as item}
            <div class="wrapper">
                <a href="/post/{item._id}">
                    <img src={item.thumb} alt=''/>
                    <img class="play-icon" src="/images/play.png" alt=''/>
                </a>
                <div class="date">{(new Date(item.date)).toLocaleDateString("it-IT")}</div>
                <a class="title" href="/post/{item._id}">
                    <div >{item.title}</div>
                </a>
            </div>
        {/each}
    </div>
    <div class="pagination">
        <span>ទំព័រ </span>
        <select onchange={ getPosts }>
            {#each [...Array(data.lastPage).keys()] as pageNumber}
                {#if pageNumber+1 == data.page}
                <option selected>{pageNumber+1}</option>
                {:else}
                <option>{pageNumber+1}</option>
                {/if}
            {/each}
        </select>
        <span> នៃ {data.lastPage}</span>
    </div>
</section>

<style>
.Category .container{
    display: grid;
    grid-template-columns: repeat(4, calc(100% / 4 - 11.25px));
    grid-gap: 30px 15px;
    padding: 15px 0 30px;
}
.Category .container .wrapper a{
    position: relative;
    padding-top: 56.25%;
    overflow: hidden;
    width: 100%;
    display: block;
}
.Category .container .wrapper a img{
    position: absolute;
    width: 100%;
    min-height: 100%;
    top: 0;
    left: 0;
}
.Category .container .wrapper a .play-icon{
    width: auto;
    min-height: auto;
    width: 15%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%)
}
.Category .container .wrapper .date{
    padding-top: 5px;
}
.Category .container .wrapper .title{
    padding-top: 5px;
}
.Category .pagination{
    text-align: center;
    padding-bottom: 30px;
}

@media only screen and (max-width:600px){
    .Category .container{
        grid-template-columns: 100%;
        padding: 30px 10px;
    }
}
</style>
