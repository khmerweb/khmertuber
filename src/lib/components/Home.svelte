<script>
    import jq from "jquery"
    let { data } = $props()
    const laodingVideo = 'NcQQVbioeZk'
    
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
        web: data.posts[9]
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
        rawPlaylist[category] = newPlaylist_
        let newPlaylist = parseVideos(newPlaylist_)
        newPlaylist.category = category
        return newPlaylist
	}

    async function newPlaylist(playerID, event){
        let player = players[playerID]
        
        if(player.playlist.category !== 'news'){
            player.loadVideoById(laodingVideo)
            player.playlist = await getRandomPlaylist(player.playlist.category, player.playlist.thumbs) 
        }
        jq(`.${playerID} .playlist .item${player.part}`).css({'background':'none'})
        jq(`.${playerID} .playlist .item${player.part} img`).css({'border':'none'})
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
        jq(`.${playerID} .playlist .item${player.part}`).css({'background':'rgb(53, 53, 53)'})
        jq(`.${playerID} .playlist .item${player.part} img`).css({'border':'1px solid red'})
    }

    function loadVideo(player, playlist){
        if(player.label === 'news'){
            if(playlist[0][0].type === "YouTubePlaylist"){
                player.loadPlaylist({list:playlist[0][0].id,listType:'playlist',index:0})
            }else{
                playlist[0].reverse()
                playlist[0].reversal = true
                player.loadVideoById(playlist[0][0].id)
            }
        }else{
            if(playlist[0][0].type === "YouTubePlaylist"){
                player.cuePlaylist({list:playlist[0][0].id,listType:'playlist',index:0})
            }else{
                playlist[0].reverse()
                playlist[0].reversal = true
                player.cueVideoById(playlist[0][0].id)
            }
        }
    }

    function onPlayerReady(player) {
        players[player].part = 0
        players[player].index = 0
        players[player].thumb = 1

        if(player === "news"){
            players[player].label = 'news'
            players[player].playlist = latestNews
            loadVideo(players[player], latestNews)
        }else if(player === "movie"){
            players[player].label = 'movie'
            players[player].playlist = latestMovies
            loadVideo(players[player], latestMovies)
        }else if(player === "travel"){
            players[player].label = 'travel'
            players[player].playlist = latestTravel
            loadVideo(players[player], latestTravel)
        }else if(player === "doc"){
            players[player].label = 'doc'
            players[player].playlist = latestDoc
            loadVideo(players[player], latestDoc)
        }else if(player === "web"){
            players[player].label = 'web'
            players[player].playlist = latestWeb
            loadVideo(players[player], latestWeb)
        }else if(player === "sport"){
            players[player].label = 'sport'
            players[player].playlist = latestSport
            loadVideo(players[player], latestSport)
        }else if(player === "food"){
            players[player].label = 'food'
            players[player].playlist = latestFood
            loadVideo(players[player], latestFood)
        }else if(player === "music"){
            players[player].label = 'music'
            players[player].playlist = latestMusic
            loadVideo(players[player], latestMusic)
        }else if(player === "game"){
            players[player].label = 'game'
            players[player].playlist = latestGame
            loadVideo(players[player], latestGame)
        }else if(player === "distraction"){
            players[player].label = 'distraction'
            players[player].playlist = latestDistraction
            loadVideo(players[player], latestDistraction)
        }
    }

    function onPlayerError(playerID, event){
        const player = players[playerID]
        if(player.index + 1 < player.playlist[player.part].length){
            player.index += 1
            player.loadVideoById(player.playlist[player.part][player.index].id)
        }else{
            jq(`.${playerID} .playlist .item${player.part}`).css({'background':'none'})
            jq(`.${playerID} .playlist .item${player.part} img`).css({'border':'none'})
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
            jq(`.${playerID} .playlist .item${player.part}`).css({'background':'rgb(53, 53, 53)'})
            jq(`.${playerID} .playlist .item${player.part} img`).css({'border':'1px solid red'})
        }
    }

    async function onPlayerStateChange(playerID, event) { 
        let player = players[playerID]
        if(event.data === YT.PlayerState.PLAYING){
            jq(`.${playerID} .playlist .item${player.part}`).css({'background':'rgb(53, 53, 53)'})
            jq(`.${playerID} .playlist .item${player.part} img`).css({'border':'1px solid red'})
            for(let pl in players){
                if(pl !== playerID){
                    players[pl].stopVideo()
                }
            } 
        }else if(event.data === YT.PlayerState.ENDED){
            if(player.index + 1 < player.playlist[player.part].length){
                player.index += 1
                player.loadVideoById(player.playlist[player.part][player.index].id)
                
            }else{
                jq(`.${playerID} .playlist .item${player.part}`).css({'background':'none'})
                jq(`.${playerID} .playlist .item${player.part} img`).css({'border':'none'})
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
            }
            jq(`.${playerID} .playlist .item${player.part}`).css({'background':'rgb(53, 53, 53)'})
            jq(`.${playerID} .playlist .item${player.part} img`).css({'border':'1px solid red'})
        }
    }

    function nextPrevious(playerID, move){
        const player = players[playerID]
        if(move === "next"){
            if(player.index + 1 < player.playlist[player.part].length){
                player.index += 1
                player.loadVideoById(player.playlist[player.part][player.index].id)
            }else{
                jq(`.${playerID} .playlist .item${player.part}`).css({'background':'none'})
                jq(`.${playerID} .playlist .item${player.part} img`).css({'border':'none'})
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
                jq(`.${playerID} .playlist .item${player.part}`).css({'background':'rgb(53, 53, 53)'})
                jq(`.${playerID} .playlist .item${player.part} img`).css({'border':'1px solid red'})
            }
        }else if(move === "previous"){
            if(player.index > 0){
                player.index -= 1
                player.loadVideoById(player.playlist[player.part][player.index].id)
            }else{
                jq(`.${playerID} .playlist .item${player.part}`).css({'background':'none'})
                jq(`.${playerID} .playlist .item${player.part} img`).css({'border':'none'})
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
            }
            jq(`.${playerID} .playlist .item${player.part}`).css({'background':'rgb(53, 53, 53)'})
            jq(`.${playerID} .playlist .item${player.part} img`).css({'border':'1px solid red'})
        }
    }

    let initialVideoId = 'cdwal5Kw3Fc'
    let players = {}

    
    function load() {
        players.news = new YT.Player('news', {
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
                'onReady': onPlayerReady.bind(null, "news"),
                'onStateChange': onPlayerStateChange.bind(null, "news"),
                'onError': onPlayerError.bind(null, "news")
            }
        })

        players.movie = new YT.Player('movie', {
            height: '390',
            width: '640',
            videoId: initialVideoId,
            playerVars: {
                'cc_load_policy': 1,
                'cc_lang_pref': 'en',
                'playsinline': 1,
                "enablejsapi": 1,
                "mute": 0,
                "autoplay": 1,
                "rel": 0,
            },
            events: {
                'onReady': onPlayerReady.bind(null, "movie"),
                'onStateChange': onPlayerStateChange.bind(null, "movie"),
                'onError': onPlayerError.bind(null, "movie")
            }
        })

        players.travel = new YT.Player('travel', {
            height: '390',
            width: '640',
            videoId: initialVideoId,
            playerVars: {
                'cc_load_policy': 1,
                'cc_lang_pref': 'en',
                'playsinline': 1,
                "enablejsapi": 1,
                "mute": 0,
                "autoplay": 1,
                "rel": 0,
            },
            events: {
                'onReady': onPlayerReady.bind(null, "travel"),
                'onStateChange': onPlayerStateChange.bind(null, "travel"),
                'onError': onPlayerError.bind(null, "travel")
            }
        })

        players.doc = new YT.Player('doc', {
            height: '390',
            width: '640',
            videoId: initialVideoId,
            playerVars: {
                'cc_load_policy': 1,
                'cc_lang_pref': 'en',
                'playsinline': 1,
                "enablejsapi": 1,
                "mute": 0,
                "autoplay": 1,
                "rel": 0,
            },
            events: {
                'onReady': onPlayerReady.bind(null, "doc"),
                'onStateChange': onPlayerStateChange.bind(null, "doc"),
                'onError': onPlayerError.bind(null, "doc")
            }
        })

        players.web = new YT.Player('web', {
            height: '390',
            width: '640',
            videoId: initialVideoId,
            playerVars: {
                'cc_load_policy': 1,
                'cc_lang_pref': 'en',
                'playsinline': 1,
                "enablejsapi": 1,
                "mute": 0,
                "autoplay": 1,
                "rel": 0,
            },
            events: {
                'onReady': onPlayerReady.bind(null, "web"),
                'onStateChange': onPlayerStateChange.bind(null, "web"),
                'onError': onPlayerError.bind(null, "web")
            }
        })

        players.sport = new YT.Player('sport', {
            height: '390',
            width: '640',
            videoId: initialVideoId,
            playerVars: {
                'cc_load_policy': 1,
                'cc_lang_pref': 'en',
                'playsinline': 1,
                "enablejsapi": 1,
                "mute": 0,
                "autoplay": 1,
                "rel": 0,
            },
            events: {
                'onReady': onPlayerReady.bind(null, "sport"),
                'onStateChange': onPlayerStateChange.bind(null, "sport"),
                'onError': onPlayerError.bind(null, "sport")
            }
        })

        players.food = new YT.Player('food', {
            height: '390',
            width: '640',
            videoId: initialVideoId,
            playerVars: {
                'cc_load_policy': 1,
                'cc_lang_pref': 'en',
                'playsinline': 1,
                "enablejsapi": 1,
                "mute": 0,
                "autoplay": 1,
                "rel": 0,
            },
            events: {
                'onReady': onPlayerReady.bind(null, "food"),
                'onStateChange': onPlayerStateChange.bind(null, "food"),
                'onError': onPlayerError.bind(null, "food")
            }
        })

        players.music = new YT.Player('music', {
            height: '390',
            width: '640',
            videoId: initialVideoId,
            playerVars: {
                'cc_load_policy': 1,
                'cc_lang_pref': 'en',
                'playsinline': 1,
                "enablejsapi": 1,
                "mute": 0,
                "autoplay": 1,
                "rel": 0,
            },
            events: {
                'onReady': onPlayerReady.bind(null, "music"),
                'onStateChange': onPlayerStateChange.bind(null, "music"),
                'onError': onPlayerError.bind(null, "music")
            }
        })

        players.game = new YT.Player('game', {
            height: '390',
            width: '640',
            videoId: initialVideoId,
            playerVars: {
                'cc_load_policy': 1,
                'cc_lang_pref': 'en',
                'playsinline': 1,
                "enablejsapi": 1,
                "mute": 0,
                "autoplay": 1,
                "rel": 0,
            },
            events: {
                'onReady': onPlayerReady.bind(null, "game"),
                'onStateChange': onPlayerStateChange.bind(null, "game"),
                'onError': onPlayerError.bind(null, "game")
            }
        })

        players.distraction = new YT.Player('distraction', {
            height: '390',
            width: '640',
            videoId: initialVideoId,
            playerVars: {
                'cc_load_policy': 1,
                'cc_lang_pref': 'en',
                'playsinline': 1,
                "enablejsapi": 1,
                "mute": 0,
                "autoplay": 1,
                "rel": 0,
            },
            events: {
                'onReady': onPlayerReady.bind(null, "distraction"),
                'onStateChange': onPlayerStateChange.bind(null, "distraction"),
                'onError': onPlayerError.bind(null, "distraction")
            }
        })

    }

    function noHoverPlaylist(){
        alert()
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

    function openPlaylist(playerID){
        let result = jq(`.${playerID} .playlist`).css('visibility')
        if(result === "hidden"){
            jq(`.${playerID} .playlist`).css('visibility', 'visible')
        }else if(result === "visible"){
            jq(`.${playerID} .playlist`).css('visibility', 'hidden')
        }
    }

    function changeVideo(playerID, part){
        const player = players[playerID]
        player.unMute()
        jq(`.${playerID} .playlist .item${player.part}`).css({'background':'none'})
        jq(`.${playerID} .playlist .item${player.part} img`).css({'border':'none'})
        player.part = part
        if(player.playlist[player.part][0].type === "YouTubePlaylist"){
            player.loadVideoById(initialVideoId)
            player.loadPlaylist({list:player.playlist[player.part][0].id,listType:'playlist',index:0})
        }else{
            if(!(player.playlist[player.part].reversal)){
                player.playlist[player.part].reverse()
                player.playlist[player.part].reversal = true
            }
            player.loadVideoById(player.playlist[player.part][0].id)
        }
        openPlaylist(playerID)
        jq(`.${playerID} .playlist .item${player.part}`).css({'background':'rgb(53, 53, 53)'})
        jq(`.${playerID} .playlist .item${player.part} img`).css({'border':'1px solid red'})
    }

</script>

<svelte:head>
    <script src="https://www.youtube.com/iframe_api"></script>
</svelte:head>

<section class="main region">
    <div class="player-wrapper">
        <div class="news">
            <div id="news"></div>
            <div class="latest-video">{data.counts.news} ព័ត៌មាន</div>
            <div class="channel-logo">
                <img src="/images/siteLogo.png" alt=''/>
            </div>
            <div class="playlist">
                {#each rawPlaylist.news as post, index}
                <button class="item{index}" onclick={()=>changeVideo('news', index)} title="">
                    <img src={post.thumb} alt='' />
                    <span>{post.title}</span>
                </button>
                {/each}
            </div>
            <div class="play-news">
                <button onclick={()=>nextPrevious('news','previous')}>វីដេអូមុន</button>
                <button onclick={()=>newPlaylist('news')} class='new-playlist'>ដូរ​កំរង​វីដេអូ​</button>
                <button onclick={()=>openPlaylist('news')}>​កំរង​វីដេអូ</button>
                <button onclick={()=>nextPrevious('news','next')}>វីដេអូបន្ទាប់</button>
            </div>
        </div>
        <div class="movie">
            <div id="movie"></div>
            <div class="latest-video">{data.counts.movie} ភាពយន្ត</div>
            <div class="channel-logo">
                <img src="/images/siteLogo.png" alt=''/>
            </div>
            <div class="playlist">
                {#each rawPlaylist.movie as post, index}
                <button class="item{index}" onclick={()=>changeVideo('movie', index)} title="">
                    <img src={post.thumb} alt='' />
                    <span>{post.title}</span>
                </button>
                {/each}
            </div>
            <div class="play-movie">
                <button onclick={()=>nextPrevious('movie','previous')}>វីដេអូមុន</button>
                <button onclick={()=>newPlaylist('movie')} class='new-playlist'>ដូរ​កំរង​វីដេអូ​</button>
                <button onclick={()=>openPlaylist('movie')}>​កំរង​វីដេអូ</button>
                <button onclick={()=>nextPrevious('movie','next')}>វីដេអូបន្ទាប់</button>
            </div>
        </div>
        <div class="travel">
            <div id="travel"></div>
            <div class="latest-video">{data.counts.travel} ដើរ​លេង</div>
            <div class="channel-logo">
                <img src="/images/siteLogo.png" alt=''/>
            </div>
            <div class="playlist">
                {#each rawPlaylist.travel as post, index}
                <button class="item{index}" onclick={()=>changeVideo('travel', index)} title="">
                    <img src={post.thumb} alt='' />
                    <span>{post.title}</span>
                </button>
                {/each}
            </div>
            <div class="play-travel">
                <button onclick={()=>nextPrevious('travel','previous')}>វីដេអូមុន</button>
                <button onclick={()=>newPlaylist('travel')} class='new-playlist'>ដូរ​កំរង​វីដេអូ​</button>
                <button onclick={()=>openPlaylist('travel')}>​កំរង​វីដេអូ</button>
                <button onclick={()=>nextPrevious('travel','next')}>វីដេអូបន្ទាប់</button>
            </div>
        </div>
        <div class="doc">
            <div id="doc"></div>
            <div class="latest-video">{data.counts.doc} ឯកសារ</div>
            <div class="channel-logo">
                <img src="/images/siteLogo.png" alt=''/>
            </div>
            <div class="playlist">
                {#each rawPlaylist.doc as post, index}
                <button class="item{index}" onclick={()=>changeVideo('doc', index)} title="">
                    <img src={post.thumb} alt='' />
                    <span>{post.title}</span>
                </button>
                {/each}
            </div>
            <div class="play-doc">
                <button onclick={()=>nextPrevious('doc','previous')}>វីដេអូមុន</button>
                <button onclick={()=>newPlaylist('doc')} class='new-playlist'>ដូរ​កំរង​វីដេអូ​</button>
                <button onclick={()=>openPlaylist('doc')}>​កំរង​វីដេអូ</button>
                <button onclick={()=>nextPrevious('doc','next')}>វីដេអូបន្ទាប់</button>
            </div>
        </div>
        <div class="web">
            <div id="web"></div>
            <div class="latest-video">{data.counts.web} គេហទំព័រ</div>
            <div class="channel-logo">
                <img src="/images/siteLogo.png" alt=''/>
            </div>
            <div class="playlist">
                {#each rawPlaylist.web as post, index}
                <button class="item{index}" onclick={()=>changeVideo('web', index)} title="">
                    <img src={post.thumb} alt='' />
                    <span>{post.title}</span>
                </button>
                {/each}
            </div>
            <div class="play-web">
                <button onclick={()=>nextPrevious('web','previous')}>វីដេអូមុន</button>
                <button onclick={()=>newPlaylist('web')} class='new-playlist'>ដូរ​កំរង​វីដេអូ​</button>
                <button onclick={()=>openPlaylist('web')}>​កំរង​វីដេអូ</button>
                <button onclick={()=>nextPrevious('web','next')}>វីដេអូបន្ទាប់</button>
            </div>
        </div>
        <div class="sport">
            <div id="sport"></div>
            <div class="latest-video">{data.counts.sport} កីឡា</div>
            <div class="channel-logo">
                <img src="/images/siteLogo.png" alt=''/>
            </div>
            <div class="playlist">
                {#each rawPlaylist.sport as post, index}
                <button class="item{index}" onclick={()=>changeVideo('sport', index)} title="">
                    <img src={post.thumb} alt='' />
                    <span>{post.title}</span>
                </button>
                {/each}
            </div>
            <div class="play-sport">
                <button onclick={()=>nextPrevious('sport','previous')}>វីដេអូមុន</button>
                <button onclick={()=>newPlaylist('sport')} class='new-playlist'>ដូរ​កំរង​វីដេអូ​</button>
                <button onclick={()=>openPlaylist('sport')}>​កំរង​វីដេអូ</button>
                <button onclick={()=>nextPrevious('sport','next')}>វីដេអូបន្ទាប់</button>
            </div>
        </div>
        <div class="food">
            <div id="food"></div>
            <div class="latest-video">{data.counts.food} មុខ​ម្ហូប</div>
            <div class="channel-logo">
                <img src="/images/siteLogo.png" alt=''/>
            </div>
            <div class="playlist">
                {#each rawPlaylist.food as post, index}
                <button class="item{index}" onclick={()=>changeVideo('food', index)} title="">
                    <img src={post.thumb} alt='' />
                    <span>{post.title}</span>
                </button>
                {/each}
            </div>
            <div class="play-food">
                <button onclick={()=>nextPrevious('food','previous')}>វីដេអូមុន</button>
                <button onclick={()=>newPlaylist('food')} class='new-playlist'>ដូរ​កំរង​វីដេអូ​</button>
                <button onclick={()=>openPlaylist('food')}>​កំរង​វីដេអូ</button>
                <button onclick={()=>nextPrevious('food','next')}>វីដេអូបន្ទាប់</button>
            </div>
        </div>
        <div class="music">
            <div id="music"></div>
            <div class="latest-video">{data.counts.music} របាំ​តន្ត្រី</div>
            <div class="channel-logo">
                <img src="/images/siteLogo.png" alt=''/>
            </div>
            <div class="playlist">
                {#each rawPlaylist.music as post, index}
                <button class="item{index}" onclick={()=>changeVideo('music', index)} title="">
                    <img src={post.thumb} alt='' />
                    <span>{post.title}</span>
                </button>
                {/each}
            </div>
            <div class="play-music">
                <button onclick={()=>nextPrevious('music','previous')}>វីដេអូមុន</button>
                <button onclick={()=>newPlaylist('music')} class='new-playlist'>ដូរ​កំរង​វីដេអូ​</button>
                <button onclick={()=>openPlaylist('music')}>​កំរង​វីដេអូ</button>
                <button onclick={()=>nextPrevious('music','next')}>វីដេអូបន្ទាប់</button>
            </div>
        </div>
        <div class="game">
            <div id="game"></div>
            <div class="latest-video">{data.counts.game} ពិភព​និម្មិត</div>
            <div class="channel-logo">
                <img src="/images/siteLogo.png" alt=''/>
            </div>
            <div class="playlist">
                {#each rawPlaylist.game as post, index}
                <button class="item{index}" onclick={()=>changeVideo('game', index)} title="">
                    <img src={post.thumb} alt='' />
                    <span>{post.title}</span>
                </button>
                {/each}
            </div>
            <div class="play-game">
                <button onclick={()=>nextPrevious('game','previous')}>វីដេអូមុន</button>
                <button onclick={()=>newPlaylist('game')} class='new-playlist'>ដូរ​កំរង​វីដេអូ​</button>
                <button onclick={()=>openPlaylist('game')}>​កំរង​វីដេអូ</button>
                <button onclick={()=>nextPrevious('game','next')}>វីដេអូបន្ទាប់</button>
            </div>
        </div>
        <div class="distraction">
            <div id="distraction"></div>
            <div class="latest-video">{data.counts.distraction} ល្បែង​កំសាន្ត</div>
            <div class="channel-logo"><img src="/images/siteLogo.png" alt=''/></div>
            <div class="playlist">
                {#each rawPlaylist.distraction as post, index}
                <button class="item{index}" onclick={()=>changeVideo('distraction', index)} title="">
                    <img src={post.thumb} alt='' />
                    <span>{post.title}</span>
                </button>
                {/each}
            </div>
            <div class="play-distraction">
                <button onclick={()=>nextPrevious('distraction','previous')}>វីដេអូមុន</button>
                <button onclick={()=>newPlaylist('distraction')} class='new-playlist'>ដូរ​កំរង​វីដេអូ​</button>
                <button onclick={()=>openPlaylist('distraction')}>​កំរង​វីដេអូ</button>
                <button onclick={()=>nextPrevious('distraction','next')}>វីដេអូបន្ទាប់</button>
            </div>
        </div>

    </div>
</section>

<style>
    .player-wrapper{
        display: grid;
        grid-template-columns: repeat(2, calc(50% - 7.5px));
        grid-gap: 15px;
        padding: 15px 0;
    }
    .player-wrapper .news,
    .player-wrapper .movie,
    .player-wrapper .travel,
    .player-wrapper .doc,
    .player-wrapper .web,
    .player-wrapper .sport,
    .player-wrapper .food,
    .player-wrapper .music,
    .player-wrapper .game,
    .player-wrapper .distraction{
        position: relative;
        padding-top: 52.5%;
        overflow: hidden;
    }
    .player-wrapper .news .playlist,
    .player-wrapper .movie .playlist,
    .player-wrapper .travel .playlist,
    .player-wrapper .doc .playlist,
    .player-wrapper .web .playlist,
    .player-wrapper .sport .playlist,
    .player-wrapper .food .playlist,
    .player-wrapper .music .playlist,
    .player-wrapper .game .playlist,
    .player-wrapper .distraction .playlist{
        position: absolute;
        top: 0;
        right: 0;
        max-width: 400px;
        max-height: 100%;
        background: rgb(24, 24, 24);
        padding: 5px;
        visibility: hidden;
        overflow-x: hidden;
        overflow-y: scroll;
    }
    .player-wrapper .news .playlist button,
    .player-wrapper .movie .playlist button,
    .player-wrapper .travel .playlist button,
    .player-wrapper .doc .playlist button,
    .player-wrapper .web .playlist button,
    .player-wrapper .sport .playlist button,
    .player-wrapper .food .playlist button,
    .player-wrapper .music .playlist button,
    .player-wrapper .game .playlist button,
    .player-wrapper .distraction .playlist button{
        all: unset;
        display: grid;
        grid-template-columns: 25% auto;
        grid-gap: 10px;
        padding: 5px 0;
        color: silver;
    }
    .player-wrapper .news .playlist button:hover,
    .player-wrapper .movie .playlist button:hover,
    .player-wrapper .travel .playlist button:hover,
    .player-wrapper .doc .playlist button:hover,
    .player-wrapper .web .playlist button:hover,
    .player-wrapper .sport .playlist button:hover,
    .player-wrapper .food .playlist button:hover,
    .player-wrapper .music .playlist button:hover,
    .player-wrapper .game .playlist button:hover,
    .player-wrapper .distraction .playlist button:hover{
        background: rgb(39, 39, 39);
        cursor: pointer;
    }
    
    .player-wrapper .news .playlist button img,
    .player-wrapper .movie .playlist button img,
    .player-wrapper .travel .playlist button img,
    .player-wrapper .doc .playlist button img,
    .player-wrapper .web .playlist button img,
    .player-wrapper .sport .playlist button img,
    .player-wrapper .food .playlist button img,
    .player-wrapper .music .playlist button img,
    .player-wrapper .game .playlist button img,
    .player-wrapper .distraction .playlist button img{
        width: 100%;
    }
    .player-wrapper .news .latest-video,
    .player-wrapper .movie .latest-video,
    .player-wrapper .travel .latest-video,
    .player-wrapper .doc .latest-video,
    .player-wrapper .web .latest-video,
    .player-wrapper .sport .latest-video,
    .player-wrapper .food .latest-video,
    .player-wrapper .music .latest-video,
    .player-wrapper .game .latest-video,
    .player-wrapper .distraction .latest-video{
        position: absolute;
        top: 0;
        left: 0;
        color: orange;
        background: rgb(44, 44, 44);
        padding: 5px;
    }
     
    .player-wrapper .news .channel-logo img, 
    .player-wrapper .movie .channel-logo img,
    .player-wrapper .travel .channel-logo img, 
    .player-wrapper .doc .channel-logo img,
    .player-wrapper .web .channel-logo img,
    .player-wrapper .sport .channel-logo img,
    .player-wrapper .food .channel-logo img,
    .player-wrapper .music .channel-logo img,
    .player-wrapper .game .channel-logo img,
    .player-wrapper .distraction .channel-logo img{
        position: absolute;
        top: 5px;
        right: 5px;
        width: 6%;
    }
    .player-wrapper .news .play-news,
    .player-wrapper .movie .play-movie,
    .player-wrapper .travel .play-travel,
    .player-wrapper .doc .play-doc,
    .player-wrapper .web .play-web,
    .player-wrapper .sport .play-sport,
    .player-wrapper .food .play-food,
    .player-wrapper .music .play-music,
    .player-wrapper .game .play-game,
    .player-wrapper .distraction .play-distraction{
        position: relative;
        bottom: 7px;
        text-align: center;
        visibility: hidden;
        display: flex;
        justify-content: center;
        align-content: center;
        gap: 15px;
    }
    
    .player-wrapper .play-news button, 
    .player-wrapper .play-movie button,
    .player-wrapper .play-travel button,
    .player-wrapper .play-doc button,
    .player-wrapper .play-web button,
    .player-wrapper .play-sport button,
    .player-wrapper .play-food button,
    .player-wrapper .play-music button,
    .player-wrapper .play-game button,
    .player-wrapper .play-distraction button{
        color: orange;
        padding-top: 0;
        width: auto;
        background-color: transparent;
        font-family: Vidaloka, OdorMeanChey;
        border: none;
        background: rgb(44, 44, 44);
        padding: 1px 7px;
        border-radius: 2px;
    }
    .player-wrapper .play-news button:hover, 
    .player-wrapper .play-movie button:hover,
    .player-wrapper .play-travel button:hover,
    .player-wrapper .play-doc button:hover,
    .player-wrapper .play-web button:hover,
    .player-wrapper .play-sport button:hover,
    .player-wrapper .play-food button:hover,
    .player-wrapper .play-music button:hover,
    .player-wrapper .play-game button:hover,
    .player-wrapper .play-distraction button:hover{
        cursor: pointer;
    }
    .player-wrapper .news:hover .play-news, 
    .player-wrapper .movie:hover .play-movie,
    .player-wrapper .travel:hover .play-travel,
    .player-wrapper .doc:hover .play-doc,
    .player-wrapper .web:hover .play-web,
    .player-wrapper .sport:hover .play-sport,
    .player-wrapper .food:hover .play-food,
    .player-wrapper .music:hover .play-music,
    .player-wrapper .game:hover .play-game,
    .player-wrapper .distraction:hover .play-distraction{
        visibility: visible;
    }
    .player-wrapper #news, 
    .player-wrapper #movie,
    .player-wrapper #travel,
    .player-wrapper #doc,
    .player-wrapper #web,
    .player-wrapper #sport,
    .player-wrapper #food,
    .player-wrapper #music,
    .player-wrapper #game,
    .player-wrapper #distraction{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--menu);
    }

    
    @media only screen and (max-width: 600px){
        .main{
            padding: 0 10px;
        }
        .player-wrapper{
            grid-template-columns: 100%;
        }
        .player-wrapper .news,
        .player-wrapper .movie,
        .player-wrapper .travel,
        .player-wrapper .doc,
        .player-wrapper .web,
        .player-wrapper .sport,
        .player-wrapper .food,
        .player-wrapper .music,
        .player-wrapper .game,
        .player-wrapper .distraction{
            padding-top: 51%;
        }
    }   
</style>