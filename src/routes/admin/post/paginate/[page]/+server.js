import { json } from '@sveltejs/kit'
import { redirect } from '@sveltejs/kit'
import setup from "$lib/settings.js"
import postDB from "$lib/db/post.js"

export async function GET({ locals, params }){
    const user = locals.user
    if(!user){
        throw redirect(307, '/login')
    }
    const page = params.page
    const settings = await setup()
    const items = await postDB.paginatePosts(page, settings.dashboard)

    return json(items)
}