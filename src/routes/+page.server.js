import setup from "$lib/settings";
import postDB from "$lib/db/post.js"

export async function load({}) {
    const settings = await setup()
    const pageURL = "/"
    const categories = ['news','movie','travel','game','sport','doc','distraction','music','food','web']
    const posts = await postDB.getLatestPostByCategory(categories, settings.frontend)
    const counts = {}
    let index = 0
    for(const counter of categories){
        counts[counter] = posts[index].count
        index++
    }
    return { settings, pageURL, posts, counts }    
}