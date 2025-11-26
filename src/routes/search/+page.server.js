import setup from "$lib/settings.js"
import postDB from "$lib/db/post.js"

export async function load({ locals }){
    const settings = await setup()
    const title = 'ទំព័រ​ស្វែង​រក'
    const { posts, lastPage, page, q } = locals.data
    
    return { posts, lastPage, page, q, settings, title }
}

export const actions = {
    search: async ({ locals, request, url }) => {
        const settings = await setup()
        const data = await request.formData()
        const q = data.get('q')
        const page = 1
        
        const { posts, length } = await postDB.searchPosts(q, settings.categories, page)
        const lastPage = Math.ceil(length/settings.categories)
        locals.data = { posts, lastPage, page, q }
    }
}