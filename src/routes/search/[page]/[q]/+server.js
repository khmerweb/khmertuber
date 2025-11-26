import { json } from '@sveltejs/kit'
import setup from "$lib/settings.js"
import postDB from "$lib/db/post.js"

export async function GET({ locals, params }){
    const settings = await setup()
    const amount = settings.categories
    const page = params.page
    const q = params.q
    const { posts } = await postDB.searchPosts(q, settings.categories, parseInt(page))
    
    return json(posts)
}