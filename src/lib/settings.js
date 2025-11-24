//settings.js

async function setup(req){
    //const module = await import('$lib/db/setting.js')
    //let set = await module.default.getSettings(req, 1)
    let setting = false //set[0]
    let settings = {}

    if(setting){
        settings = {
            siteTitle: setting.title,
            description: setting.description,
            dashboard: setting.dashboard,
            frontend: setting.frontend,
            categories: setting.categories,
            playlist: setting.playlist,
            thumb: '',
            date: ''
        }
    }else{
        settings = {
            siteTitle: 'ដំណឹង​ល្អ',
            description: 'description',
            dashboard: 10,
            frontend: 20,
            categories: 20,
            playlist: 20,
            thumb: '',
            date: ''
        }
    }
    
    return settings
}
 
export default setup