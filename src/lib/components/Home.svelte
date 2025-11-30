<script>
    import Ad from "$lib/components/partials/Ad.svelte"
    import jq from "jquery"
    let visible = $state(false);
    let { data } = $props()
    let posts = $state(data.posts[0])
    const dark = 'brightness(20%)'
    const normal = 'brightness(100%)'
    const laodingVideo = 'NcQQVbioeZk'
    let pageAmount = $state(Math.ceil(data.counts.news/data.settings.frontend))
    let category = $state('news')
    
    function parseVideos(posts){
        let videos = []
        let thumbs = []
        for(let post of posts){
            videos.push(JSON.parse(post.videos))
            thumbs.push(post.thumb)
        }
        videos.thumbs = thumbs
        return videos
    }
    
    let latestNews = parseVideos(data.posts[0])
    latestNews.category = 'news'
    let latestMovies = parseVideos(data.posts[1])
    latestMovies.category = 'movie'
    let latestTravel = parseVideos(data.posts[2])
    latestTravel.category = 'travel'
    let latestGame = parseVideos(data.posts[3])
    latestGame.category = 'game'
    let latestSport = parseVideos(data.posts[4])
    latestSport.category = 'sport'
    let latestDoc = parseVideos(data.posts[5])
    latestDoc.category = 'doc'
    let latestDistraction = parseVideos(data.posts[6])
    latestDistraction.category = 'distraction'
    let latestMusic = parseVideos(data.posts[7])
    latestMusic.category = 'music'
    let latestFood = parseVideos(data.posts[8])
    latestFood.category = 'food'
    let latestWeb = parseVideos(data.posts[9])
    latestWeb.category = 'web'
    let latestHome = parseVideos(data.posts[10])
    latestHome.category = 'home'
    let latestAI = parseVideos(data.posts[11])
    latestAI.category = 'AI'

    let rawPlaylist = $state({
        news: data.posts[0],
        movie: data.posts[1],
        travel: data.posts[2],
        game: data.posts[3],
        sport: data.posts[4],
        doc: data.posts[5],
        distraction: data.posts[6],
        music: data.posts[7],
        food: data.posts[8],
        web: data.posts[9],
        home: data.posts[10],
        AI: data.posts[11]
    })

    let videoPlaylists = $state({
        news: latestNews,
        movie: latestMovies,
        travel: latestTravel,
        game: latestGame,
        sport: latestSport,
        doc: latestDoc,
        distraction: latestDistraction,
        music: latestMusic,
        food: latestFood,
        web: latestWeb,
        home: latestHome,
        AI: latestAI
    })

    let playlistThumbs = $state({
        news: rawPlaylist['news'][0].thumb,
        movie: rawPlaylist['movie'][0].thumb,
        travel: rawPlaylist['travel'][0].thumb,
        game: rawPlaylist['game'][0].thumb,
        sport: rawPlaylist['sport'][0].thumb,
        doc: rawPlaylist['doc'][0].thumb,
        distraction: rawPlaylist['distraction'][0].thumb,
        music: rawPlaylist['music'][0].thumb,
        food: rawPlaylist['food'][0].thumb,
        web: rawPlaylist['web'][0].thumb,
        home: rawPlaylist['home'][0].thumb,
        AI: rawPlaylist['AI'][0].thumb,
    })

    async function getRandomPlaylist(category, thumbs){
		const response = await fetch(`/post/playlist/${category}`, {
			method: 'POST',
			body: JSON.stringify({ thumbs }),
			headers: {
				'Content-Type': 'application/json'
			}
		})
		const newPlaylist_ = await response.json()
        posts = newPlaylist_
        rawPlaylist[category] = newPlaylist_
        playlistThumbs[category] = newPlaylist_[0].thumb
        let newPlaylist = parseVideos(newPlaylist_)
        newPlaylist.category = category
        videoPlaylists[category] = newPlaylist
        return newPlaylist
	}

    async function newPlaylist(event){
        player.unMute()
        if(player.playlist.category !== 'news'){
            player.loadVideoById(laodingVideo)
            player.playlist = await getRandomPlaylist(player.playlist.category, player.playlist.thumbs) 
        }
        jq(`.Home .container .wrapper:nth-child(${player.part+1}) img`).css({'filter':normal})
        jq(`.Home .container .wrapper:nth-child(${player.part+1}) p`).css({'display':'none'})
        player.part = 0
        if(player.playlist[player.part][0].type === "YouTubePlaylist"){
            player.loadVideoById(initialVideoId)
            player.loadPlaylist({list:player.playlist[player.part][0].id,listType:'playlist',index:0})
        }else{
            player.index = 0
            if(!(player.playlist[player.part].reversal)){
                player.playlist[player.part].reverse()
                player.playlist[player.part].reversal = true
            }
            player.loadVideoById(player.playlist[player.part][0].id)
        }
        
        jq(`.Home .container .wrapper:nth-child(${player.part+1}) img`).css({'filter':dark})
        jq(`.Home .container .wrapper:nth-child(${player.part+1}) p`).css({'display':'block'})
    }

    function loadVideo(playlist){
        if(playlist[0][0].type === "YouTubePlaylist"){
            player.loadPlaylist({list:playlist[0][0].id,listType:'playlist',index:0})
        }else{
            playlist[0].reverse()
            playlist[0].reversal = true
            player.loadVideoById(playlist[0][0].id)
        }
        jq(`.random-video button:nth-child(2) img`).css({'filter':dark})
        jq(`.random-video button:nth-child(2) .playing`).css({'display':'block'})
        jq('.Home .container .wrapper:nth-child(1) img').css({'filter':dark})
        jq('.Home .container .wrapper:nth-child(1) p').css({'display':'block'})
    }

    function onPlayerReady(event) {
        player.part = 0
        player.index = 0
        player.thumb = 1
        player.label = 'ព័ត៌មាន'
        player.playlist = latestNews 
        loadVideo(latestNews)
    }
//
    function changeCategory(playlist, label, obj=0, thumb=0, part=0) {
        if(obj){posts = obj}
        if(label){player.label = label}
        if(playlist){player.playlist = playlist}
        pageAmount = Math.ceil(data.counts[playlist.category]/data.settings.frontend)
        category = player.playlist.category
        
        if(thumb){
            jq(`.random-video button:nth-child(${player.thumb}) img`).css({'filter':normal})
            jq(`.random-video button:nth-child(${player.thumb}) .playing`).css({'display':'none'})
            player.thumb = thumb
            jq(`.random-video button:nth-child(${player.thumb}) img`).css({'filter':dark})
            jq(`.random-video button:nth-child(${player.thumb}) .playing`).css({'display':'block'})
        }
        jq(`.Home .container .wrapper:nth-child(${player.part+1}) img`).css({'filter':normal})
        jq(`.Home .container .wrapper:nth-child(${player.part+1}) p`).css({'display':'none'})
        player.part = part
        player.unMute()
        if(player.playlist[player.part][0].type === "YouTubePlaylist"){
            player.loadVideoById(initialVideoId)
            player.loadPlaylist({list:player.playlist[player.part][0].id,listType:'playlist',index:0})
            jq('.latest-video').html(player.label)
        }else{
            if(!(player.playlist[player.part].reversal)){
                player.playlist[player.part].reverse()
                player.playlist[player.part].reversal = true
            }
            player.loadVideoById(player.playlist[player.part][0].id)
            jq('.latest-video').html(player.label)
            
        }
        jq(`.Home .container .wrapper:nth-child(${player.part+1}) img`).css({'filter':dark})
        jq(`.Home .container .wrapper:nth-child(${player.part+1}) p`).css({'display':'block'})
    }

    function onPlayerError(event){
        if(player.index + 1 < player.playlist[player.part].length){
            player.index += 1
            player.loadVideoById(player.playlist[player.part][player.index].id)
        }else{
            jq(`.Home .container .wrapper:nth-child(${player.part+1}) img`).css({'filter':normal})
            jq(`.Home .container .wrapper:nth-child(${player.part+1}) p`).css({'display':'none'})
            player.part += 1
            if(player.part === player.playlist.length){
                player.part = 0
            }

            if(player.playlist[player.part][0].type === "YouTubePlaylist"){
                player.loadVideoById(initialVideoId)
                player.loadPlaylist({list:player.playlist[player.part][0].id,listType:'playlist',index:0})
            }else{
                player.index = 0
                if(!(player.playlist[player.part].reversal)){
                    player.playlist[player.part].reverse()
                    player.playlist[player.part].reversal = true
                }
                player.loadVideoById(player.playlist[player.part][0].id)
            }
            jq(`.Home .container .wrapper:nth-child(${player.part+1}) img`).css({'filter':dark})
            jq(`.Home .container .wrapper:nth-child(${player.part+1}) p`).css({'display':'block'})
        }
    }

    async function onPlayerStateChange(event) {   
        if(event.data === YT.PlayerState.ENDED){
            if(player.index + 1 < player.playlist[player.part].length){
                player.index += 1
                player.loadVideoById(player.playlist[player.part][player.index].id)
                
            }else{
                jq(`.Home .container .wrapper:nth-child(${player.part+1}) img`).css({'filter':normal})
                jq(`.Home .container .wrapper:nth-child(${player.part+1}) p`).css({'display':'none'})
                player.part += 1
                if(player.part === player.playlist.length){
                    if(player.playlist.category !== 'news'){
                        player.loadVideoById(laodingVideo)
                        player.playlist = await getRandomPlaylist(player.playlist.category, player.playlist.thumbs)
                    }
                    player.part = 0
                }

                if(player.playlist[player.part][0].type === "YouTubePlaylist"){
                    player.loadVideoById(initialVideoId)
                    player.loadPlaylist({list:player.playlist[player.part][0].id,listType:'playlist',index:0})
                }else{
                    player.index = 0
                    if(!(player.playlist[player.part].reversal)){
                        player.playlist[player.part].reverse()
                        player.playlist[player.part].reversal = true
                    }
                    player.loadVideoById(player.playlist[player.part][0].id)
                }
                jq(`.Home .container .wrapper:nth-child(${player.part+1}) img`).css({'filter':dark})
                jq(`.Home .container .wrapper:nth-child(${player.part+1}) p`).css({'display':'block'})
            }
        }
    }

    function nextPrevious(move){
        player.unMute()
        if(move === "next"){
            if(player.index + 1 < player.playlist[player.part].length){
                player.index += 1
                player.loadVideoById(player.playlist[player.part][player.index].id)
            }else{
                jq(`.Home .container .wrapper:nth-child(${player.part+1}) img`).css({'filter':normal})
                jq(`.Home .container .wrapper:nth-child(${player.part+1}) p`).css({'display':'none'})
                player.part += 1
                if(player.part === player.playlist.length){
                    player.part = 0
                }

                if(player.playlist[player.part][0].type === "YouTubePlaylist"){
                    player.loadVideoById(initialVideoId)
                    player.loadPlaylist({list:player.playlist[player.part][0].id,listType:'playlist',index:0})
                }else{
                    player.index = 0
                    if(!(player.playlist[player.part].reversal)){
                        player.playlist[player.part].reverse()
                        player.playlist[player.part].reversal = true
                    }
                    player.loadVideoById(player.playlist[player.part][0].id)
                }
                jq(`.Home .container .wrapper:nth-child(${player.part+1}) img`).css({'filter':dark})
                jq(`.Home .container .wrapper:nth-child(${player.part+1}) p`).css({'display':'block'})
            }
        }else if(move === "previous"){
            if(player.index > 0){
                player.index -= 1
                player.loadVideoById(player.playlist[player.part][player.index].id)
            }else{
                jq(`.Home .container .wrapper:nth-child(${player.part+1}) img`).css({'filter':normal})
                jq(`.Home .container .wrapper:nth-child(${player.part+1}) p`).css({'display':'none'})
                player.part -= 1
                if(player.part < 0){
                    player.part = player.playlist.length - 1
                }

                if(player.playlist[player.part][0].type === "YouTubePlaylist"){
                    player.loadVideoById(initialVideoId)
                    player.loadPlaylist({list:player.playlist[player.part][0].id,listType:'playlist',index:0})
                }else{
                    player.index = 0
                    if(!(player.playlist[player.part].reversal)){
                        player.playlist[player.part].reverse()
                        player.playlist[player.part].reversal = true
                    }
                    player.loadVideoById(player.playlist[player.part][0].id)
                }
                jq(`.Home .container .wrapper:nth-child(${player.part+1}) img`).css({'filter':dark})
                jq(`.Home .container .wrapper:nth-child(${player.part+1}) p`).css({'display':'block'})
            }
        }
    }

    const ytPlayerId = 'youtube-player'
    let initialVideoId = 'cdwal5Kw3Fc'
    let player

    
    function load() {
        player = new YT.Player(ytPlayerId, {
            height: '390',
            width: '640',
            videoId: initialVideoId,
            playerVars: {
                'cc_load_policy': 1,
                'cc_lang_pref': 'en',
                'playsinline': 1,
                "enablejsapi": 1,
                "mute": 1,
                "autoplay": 1,
                "rel": 0,
            },
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange,
                'onError': onPlayerError
            }
        })
    }
        
    $effect(() => {
        window.YT.ready(function() {
            if (window.YT) {
                load()
            } else {
                window.onYouTubeIframeAPIReady = load
            }
        })
    })
</script>

<svelte:head>
    <script src="https://www.youtube.com/iframe_api"></script>
</svelte:head>


<section class="main region">
    <div class="feature-post">
        <div class="random-video">
            <button  onclick={()=>changeCategory(videoPlaylists.home, 'ទំព័រ​ដើម​​​', rawPlaylist.home, 1)}>
                <img alt='' src={playlistThumbs.home} />
                <p class="news-label">{data.counts.home} ទំព័រ​ដើម​​​</p>
                <span class='playing'>កំពុង​លេង...</span>
            </button>
            <button  onclick={()=>changeCategory(videoPlaylists.news, 'ព័ត៌មាន​​​', rawPlaylist.news, 2)}>
                <img alt='' src={playlistThumbs.news} />
                <p class="news-label">{data.counts.news} ព័ត៌មាន​</p>
                <span class='playing'>កំពុង​លេង...</span>
            </button>
            <button  onclick={()=>changeCategory(videoPlaylists.movie, 'ភាពយន្ត​​​', rawPlaylist.movie, 3)}>
                <img alt='' src={playlistThumbs.movie} />
                <p class="news-label">{data.counts.movie} ភាពយន្ត​</p>
                <span class='playing'>កំពុង​លេង...</span>
            </button>
            <button onclick={()=>changeCategory(videoPlaylists.travel, 'ដើរ​លេង​​​​​', rawPlaylist.travel, 4)}>
                <img alt='' src={playlistThumbs.travel} />
                <p class="movies-label">{data.counts.travel} ដើរ​លេង</p>
                <span class='playing'>កំពុង​លេង...</span>
            </button>
            
            <button onclick={()=>changeCategory(videoPlaylists.sport, '​កីឡា​​​', rawPlaylist.sport, 5)}>
                <img alt='' src={playlistThumbs.sport} />
                <p class="movies-label">{data.counts.sport} កីឡា</p>
                <span class='playing'>កំពុង​លេង...</span>
            </button>
            <button onclick={()=>changeCategory(videoPlaylists.doc, '​ឯកសារ​​​​​', rawPlaylist.doc, 6)}>
                <img alt='' src={playlistThumbs.doc} />
                <p class="movies-label">{data.counts.doc} ឯកសារ</p>
                <span class='playing'>កំពុង​លេង...</span>
            </button>
            <button onclick={()=>changeCategory(videoPlaylists.web, '​គេហទំព័រ​', rawPlaylist.web, 7)}>
                <img alt='' src={playlistThumbs.web} />
                <p class="movies-label">{data.counts.web} គេហទំព័រ</p>
                <span class='playing'>កំពុង​លេង...</span>
            </button>
            <button onclick={()=>changeCategory(videoPlaylists.AI, 'បញ្ញា​សិប្បនិម្មិត​​​​​', rawPlaylist.AI, 8)}>
                <img alt='' src={playlistThumbs.AI} />
                <p class="movies-label">{data.counts.AI} បញ្ញា​សិប្បនិម្មិត</p>
                <span class='playing'>កំពុង​លេង...</span>
            </button>
            <button onclick={()=>changeCategory(videoPlaylists.food, 'មុខ​ម្ហូប​​​​', rawPlaylist.food, 9)}>
                <img alt='' src={playlistThumbs.food} />
                <p class="news-label">{data.counts.food} ​មុខ​ម្ហូប</p>
                <span class='playing'>កំពុង​លេង...</span>
            </button>
            <button onclick={()=>changeCategory(videoPlaylists.music, 'របាំ​តន្ត្រី​​​​​', rawPlaylist.music, 10)}>
                <img alt='' src={playlistThumbs.music} />
                <p class="news-label">{data.counts.music} របាំ​តន្ត្រី</p>
                <span class='playing'>កំពុង​លេង...</span>
            </button>
            <button onclick={()=>changeCategory(videoPlaylists.game, '​ពិភព​និម្មិត​', rawPlaylist.game, 11)}>
                <img alt='' src={playlistThumbs.game} />
                <p class="movies-label">{data.counts.game} ពិភព​និម្មិត</p>
                <span class='playing'>កំពុង​លេង...</span>
            </button>
            <button onclick={()=>changeCategory(videoPlaylists.distraction, 'ល្បែងកំសាន្ត​​​​', rawPlaylist.distraction, 12)}>
                <img alt='' src={playlistThumbs.distraction} />
                <p class="news-label">{data.counts.distraction} ល្បែងកំសាន្ត​</p>
                <span class='playing'>កំពុង​លេង...</span>
            </button>
            <div class="wrapper">
                <div id={ytPlayerId}></div>
                <div class="latest-video">ទំព័រ​ដើម​​​</div>
                <div class="channel-logo">
                    <img src="/images/siteLogo.png" alt=''/>
                </div>
                <div class="play-all">
                    <button onclick={()=>nextPrevious('previous')} title="previous video"><i class="fa fa-step-backward"></i></button>
                    <button onclick={newPlaylist} class='new-playlist' title="random playlist"><i class="fa fa-random"></i></button>
                    <button onclick={()=>nextPrevious('next')} title="next video"><i class="fa fa-step-forward"></i></button>
                </div>
            </div>
            
        </div>
    </div>
    <Ad />
</section>

<section class="Home region">
    <div class="container">
        {#each posts as post, index}
            <div class="wrapper">
                <button onclick={()=>changeCategory(false, false, false, false, index)}>
                    <img src={post.thumb} alt=''/>
                    {#if post.videos.length}
                    <img class="play-icon" src="/images/play.png" alt=''/>
                    {/if}
                    <p>កំពុង​លេង...</p>
                </button>
                <div class="date">{(new Date(post.date)).toLocaleDateString('it-IT')}</div>
                <button class="title" onclick={()=>changeCategory(false, false, false, false, index)}>
                    {post.title}
                </button>
            </div>
        {/each}
    </div>
    <div class="navigation">
        <span>ទំព័រ </span>
        <select onchange={(event)=>{document.location = `/${category}/${event.target.value}`}}>
            {#each [...Array(pageAmount).keys()] as pageNumber}
                <option>{pageNumber+1}</option>
            {/each}
        </select>
        <span> នៃ {pageAmount}</span>
    </div>
</section>

<style>
    .random-video{
        display: grid;
        grid-template-columns: repeat(4, calc(25% - 11.25px));
        grid-gap: 15px;
        padding: 15px 0;
    }
    .random-video .wrapper{
        grid-column: 2 / span 2;
        grid-row: 2 / span 2;
        position: relative;
        padding-top: 56.25%;
    }
    .random-video button{
        position: relative;
        width: 100%;
        height: 100%;
        padding-top: 56.25%;
        border: none;
    }
    .random-video button:hover{
        cursor: pointer;
        opacity: .7;
    }
    .random-video button img{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
    .random-video button p{
        position: absolute;
        top: 0;
        left: 0;
        background: rgb(44, 44, 44);
        color: white;
        text-align: center;
        font-family: Vidaloka, OdorMeanChey;
        padding: 5px;
        min-width: 90px;
    }
    .random-video button .playing{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-family: Vidaloka, OdorMeanChey;
        color: orange;
        display: none;
    }
    .random-video .latest-video{
        position: absolute;
        top: 10px;
        left: 10px;
        color: orange;
    }
    .random-video .channel-logo img{
        position: absolute;
        top: 5px;
        right: 5px;
        width: 6%;
    }
    .random-video .wrapper .play-all{
        position: absolute;
        left: 50%;
        transform: translate(-50%, -50%);
        bottom: -5px;
        text-align: center;
        visibility: hidden;
        display: flex;
        justify-content: center;
        align-content: center;
        gap: 30px;
    }
    .random-video .wrapper .play-all button{
        color: orange;
        padding-top: 0;
        text-align: center;
        background-color: transparent;
        font-size: 20px;
        border: none;
    }
    .random-video .wrapper .play-all:hover{
        cursor: pointer;
    }
    .random-video .wrapper:hover .play-all{
        visibility: visible;
    }
    .random-video .wrapper #youtube-player{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        padding: 0 !important;
    }

    .Home .container{
        display: grid;
        grid-template-columns: repeat(4, calc(100% / 4 - 11.25px));
        grid-gap: 30px 15px;
        padding: 15px 0 30px;
    }
    .Home .container .wrapper button{
        position: relative;
        padding-top: 56.25%;
        overflow: hidden;
        width: 100%;
        top: 0;
        left: 0;
        border: none;
        text-align: left;
        background: transparent;
    }
    .Home .container .wrapper .title{
        color: var(--link);
    }
    .Home button:hover,
    .Home .container .wrapper .title:hover{
        cursor: pointer;
        opacity: .7;
    }
    .Home .container .wrapper button img{
        position: absolute;
        width: 100%;
        min-height: 100%;
        top: 0;
        left: 0;
    }
    .Home .container .wrapper button .play-icon{
        position: absolute;
        width: auto;
        min-height: auto;
        width: 15%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%)
    }
    @keyframes blink {
        0% { opacity: 1; }
        50% { opacity: 0; }
        100% { opacity: 1; }
    }
    .Home .container .wrapper button p{
        position: absolute;
        top: 0;
        left: 0;
        padding: 2px 5px;
        color: orange;
        font-family: Vidaloka, OdorMeanChey;
        display: none;
        animation: blink 1s steps(2) infinite;
    }
    .Home .container .wrapper .title{
        padding-top: 5px;
        font-family: Vidaloka, OdorMeanChey;
    }
    .Home .navigation{
        text-align: center;
        padding-bottom: 30px;
    }
    
    @media only screen and (max-width: 768px){
        .main{
            padding: 0;
        }
        .random-video{
            grid-template-columns: 100%;
            padding: 10px;
        }
        .random-video .wrapper{
            grid-column: 1 / span 1;
            grid-row: 1 / span 1;
        }
        .Home .container{
            grid-template-columns: 100%;
            padding: 30px 0 10px;
        }
    }   
</style>