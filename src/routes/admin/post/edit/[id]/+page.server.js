import { redirect } from '@sveltejs/kit'
import setup from "$lib/settings.js"
import postDB from "$lib/db/post.js"
import categoryDB from '$lib/db/category'

export async function load({ params, locals, url, cookies }){
    const user = locals.user
    if(!user){throw redirect(307, '/login')}
    const id  = params.id
    const navPage = url.searchParams.get('p') || 1
    const settings = await setup()
    const count = await postDB.count()
    const post = await postDB.getPost(params)
    const items = await postDB.paginatePosts(navPage, settings.dashboard)
    const categories = await categoryDB.getAllItems()

    const pageNumber = Math.ceil(count/settings.dashboard)
    const title = 'កែប្រែ​ការផ្សាយ'
    

    return {user, count, settings, title, post, items, categories, info:"ការផ្សាយ", type:"post", pageNumber, navPage}
}

export const actions = {
    update: async ({ request, locals, cookies, url }) => {
        const data = await request.formData()

        const id = data.get('id')

        if(locals.user.role !== 'Admin'){
            if(data.get('author') !== locals.user.id){
                return { success: false, message: 'អ្នក​មិន​អាច​កែប្រែ​ការផ្សាយ​របស់អ្នក​ដទៃ​បាន​ឡើយ!' }
            }
        }

        const title = data.get('title')
        const content = data.get('content')
        const categories = data.get('categories')
        const thumb = data.get("thumb")
        const date = data.get("date")
        const dateObj = new Date(date)
        const videos = data.get("videos")

        const validate = (
            typeof title === 'string' && title !== '' &&
            typeof content === 'string' &&
            typeof categories === 'string' && categories !== '' &&
            typeof thumb === 'string' && thumb !== '' &&
            !isNaN(dateObj) &&
            typeof videos === 'string'
        )
        
	    if(validate){
            const post = {title, content, categories, thumb, date, videos}
            await postDB.updatePost(id, post)
            return { success: true, message: 'ការ​កែប្រែ​​សំរេច​បាន​ដោយ​ជោគជ័យ' }
        }else{
            return { success: false, message: "ទិន្នន័យ​បញ្ជូន​មក​មិន​ត្រឹមត្រូវ​ទេ!" }
        }
    }
}