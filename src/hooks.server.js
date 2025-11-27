import sessionDB from '$lib/db/session.js'
import { redirect } from '@sveltejs/kit'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

const SECRET_KEY = process.env.SECRET_KEY

export async function handle({ event, resolve  }) {
    
    if(event.url.pathname.includes('/admin')||event.url.pathname.includes('/post/')){
        const token = event.cookies.get('khmervideo_access_token')
        if(token){
            const session = await sessionDB.getSession(token)
            if(session){
                try{
                    const user = jwt.verify(session.jwt, SECRET_KEY)
                    event.locals.user = user
                }catch(err){
                    console.log(err)
                    if(event.url.pathname.includes('/admin')){
                        redirect(303, '/login')
                    }
                }
            }else{
                console.log('No user found!')
                if(event.url.pathname.includes('/admin')){
                    redirect(303, '/login')
                }
            }
        }else{
            if(event.url.pathname.includes('/admin')){
                redirect(303, '/login')
            }
        }
    }

    return await resolve(event)
}