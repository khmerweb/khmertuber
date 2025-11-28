import { redirect } from '@sveltejs/kit'

export function GET({ cookies }){
    cookies.delete("khmervideo_access_token", { path: "/" })
    redirect(307, '/login')
}