import { redirect } from '@sveltejs/kit'

export async function load({ locals }){
    if(!locals.user){redirect(303, '/login')}
    redirect(303, '/admin/post')
}