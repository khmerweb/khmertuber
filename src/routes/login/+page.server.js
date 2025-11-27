import userDB from "$lib/db/user.js"
import { redirect } from '@sveltejs/kit'
import sessionDB from '$lib/db/session.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { ulid } from 'ulid'
import 'dotenv/config'

const SECRET_KEY = process.env.SECRET_KEY

export const actions = {
	default: async ({ cookies, request, locals, fetch }) => {
		const data = await request.formData()

        const email = data.get('email')
        const password = data.get('password')
        const user = await userDB.checkUser(email)
        
        let message = ''
        
        if(user){
            if(bcrypt.compareSync(password, user.password)){
                const data = {id: user._id.toString(), role: user.role, name: user.title}
                const token = jwt.sign(data, SECRET_KEY, {expiresIn: "12h"})
                const access_token = ulid()
                await sessionDB.createSession(user, access_token, token)
                cookies.set('khmervideo_access_token', access_token, { path: '/' })
                redirect(303, '/admin')
            }else{
                message = 'ពាក្យ​សំងាត់​ឬ Email មិន​ត្រឹមត្រូវ​ទេ'
            }
        }else{
            message = 'ពាក្យ​សំងាត់​ឬ Email មិន​ត្រឹមត្រូវ​ទេ'
        }
        
        return { message }
	}
}

export async function load({ locals }) {
    //await userDb.createRootUser(locals)
    const title = 'login'
    return { title }
}