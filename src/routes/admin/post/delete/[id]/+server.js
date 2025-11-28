import { redirect } from '@sveltejs/kit'
import postDB from "$lib/db/post.js"

export async function GET({ locals, params }){
    const user = locals.user
    if(!user){redirect(307, '/login')}

    const post = await postDB.getPost(params)
    if(user.role !== "Admin"){
        if(post.author !== user.id){
            redirect(307, `/admin/post?success=no&type=post`)
        }
    }
    
    await postDB.deletePost(params.id)
    redirect(307, '/admin/post?success=yes&type=post')
}