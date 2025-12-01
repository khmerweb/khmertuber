import postDB from "$lib/db/post.js"
import setup from "$lib/settings.js"

export async function load({ params }) {
    const settings = await setup()
    const category = params.category
    const page = params.page
    
    const { posts, count } = await postDB.paginatePostsByCategory(params, settings.categories)
    const currentPage = parseInt(page)
    const lastPage = Math.ceil(count/settings.categories)

    let title = ''
    if(category === "game"){
        title = "simulation"
    }else{
        title = category
    }

    let pageURL = ''
    if(category === 'national'){
        pageURL = 'news'
    }else if(category === 'global'){
        pageURL = 'news'
    }else if(category === 'opinion'){
        pageURL = 'opinion'
    }else if(category === 'doc'){
        pageURL = 'doc'
    }else if(category === 'AI'){
        pageURL = 'AI'
    }else if(category === 'sport'){
        pageURL = 'sport'
    }else if(category === 'Khmer'){
        pageURL = 'movie'
    }else if(category === 'Thai'){
        pageURL = 'movie'
    }else if(category === 'Chinese'){
        pageURL = 'movie'
    }else if(category === 'Korean'){
        pageURL = 'movie'
    }else if(category === 'world'){
        pageURL = 'movie'
    }else if(category === 'movie'){
        pageURL = 'movie'
    }else if(category === 'travel'){
        pageURL = 'travel'
    }else if(category === 'game'){
        pageURL = 'game'
    }else if(category === 'food'){
        pageURL = 'entertainment'
    }else if(category === 'music'){
        pageURL = 'entertainment'
    }else if(category === 'distraction'){
        pageURL = 'entertainment'
    }else if(category === 'animal'){
        pageURL = 'entertainment'
    }else if(category === 'Node.js'){
        pageURL = 'web'
    }else if(category === 'Python'){
        pageURL = 'web'
    }else if(category === 'Go'){
        pageURL = 'web'
    }else if(category === 'Rust'){
        pageURL = 'web'
    }

    return {posts, count, category, settings, currentPage, lastPage, pageURL, title}
}