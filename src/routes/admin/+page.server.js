import setup from "$lib/settings.js"

export async function load({ locals }){
    const title = "ទំព័រ​គ្រប់គ្រង"
    const settings = await setup()
    const user = locals.user
    

    return { title, settings, user }
}