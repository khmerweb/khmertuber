import { redirect } from '@sveltejs/kit'
import setup from "$lib/settings.js"
import postDB from "$lib/db/post.js"
import categoryDB from '$lib/db/category'

export async function load({ locals, url, fetch, cookies }) {
    const user = locals.user
    if(!user){throw redirect(307, '/login')}
    const settings = await setup()
    const count = await postDB.count()
    const items = await postDB.getPosts(settings.dashboard)
    const categories = await categoryDB.getAllItems()
    
    const pageNumber = Math.ceil(count/settings.dashboard)
    const delObj = { success: url.searchParams.get('success'), type: url.searchParams.get('type') }
    const title = 'ទំព័រ​ការផ្សាយ'
    
    return { user, count, settings, items, categories, title, info:"ការផ្សាយ", type:"post", pageNumber, delObj }
}

export const actions = {
	create: async ({ request, locals, cookies }) => {
        
		const data = await request.formData()
        
        const title = data.get('title')
        const content = data.get('content')
        const categories = data.get('categories')
        const thumb = data.get("thumb")
        const date = data.get("date")
        const dateObj = new Date(date)
        const videos = data.get("videos")
        const author = locals.user.id

        const validate = (
            typeof title === 'string' && title !== '' &&
            typeof content === 'string' &&
            typeof categories === 'string' && categories !== '' &&
            typeof thumb === 'string' && thumb !== '' &&
            !isNaN(dateObj) &&
            typeof videos === 'string' &&
            typeof author === 'string' && author !== ''
        )
        
		if(validate){
            const post = {title, content, categories, thumb, date, videos, author}
            await postDB.createPost(post)
            return {success: true, message: 'ការផ្សាយ​មួយ​ត្រូវ​បាន​បង្កើត​ឡើង'}
        }else{
            return {success: false, message: "ទិន្នន័យ​បញ្ជូន​មក​មិន​ត្រឹមត្រូវ​ទេ!"}
        }
	}
}