import postDB from "$lib/db/post.js"
import setup from "$lib/settings.js"

export async function load({ locals, params }){
    const id = params.id
    const user = locals?.user
    const settings = await setup()
    const post = await postDB.getPost(params)
    const authorId = post.author
    //const { author } = await response2.json()
    const authorName = "sokavuth" //author.title
    //const response3 = await fetch(`${locals.apiUrl}/api/post/${id}?amount=7`)
    //const { randomPosts } = await response3.json()
    let randomPosts = []
    const thumb = post.thumb
    const title = post.title
    
    return {post, user, authorName, randomPosts, settings, thumb, title}
}