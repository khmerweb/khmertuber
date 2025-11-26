//src/lib/db/post.js
import { ObjectId } from 'mongodb'
import db from "./database.js"

class Post{
    async count(query={}){
        return await db.collection('Post').countDocuments(query)
    }

    async createPost(c, post){
        const db = c.get('db')
        return await db.collection('Post').insertOne(post)
    }

    async getPost(params){
        const _id = new ObjectId(params.id)
        let post = await db.collection('Post').findOne({_id })
        post = {...post, _id: post._id.toString()}
        return post
    }

    async getPosts(c, amount){
        const db = c.get('db')
        return await db.collection('Post').find().sort({ date: -1 }).limit(amount).toArray()
    }

    async updatePost(c, post){
        const db = c.get('db')
        const _id = new ObjectId(c.req.param("id"))
        await db.collection('Post').updateOne({ _id }, {$set: post})
    }

    async deletePost(c){
        const db = c.get('db')
        const _id = new ObjectId(c.req.param('id'))
        await db.collection('Post').deleteOne({ _id })
    }

    async paginatePosts(c, amount){
        const db = c.get('db')
        let page

        if(c.req.param('page')){
            page = parseInt(c.req.param('page'))
        }else if(c.req.query('page')){
            page = parseInt(c.req.query('page'))
        }else{
            page =  parseInt(c.get('navPage'))
        }
        
        return await db.collection('Post').find().sort({ date: -1 }).skip((page-1)*amount).limit(amount).toArray()
    }

    async searchPosts(q, amount, page){
        const maxPosts = await db.collection('Post').find({title: {$regex: q, $options: "i"}}).sort({ date: -1 }).toArray()
        let posts = maxPosts.slice((page-1)*amount, page*amount)
        posts = posts.map(post => ({...post, _id: post._id.toString()}))
        const length = maxPosts.length
        return { posts, length } 
    }

    async getLatestPosts(c, amount){   
        const db = c.get('db') 
        let posts = await db.collection('Post').aggregate([{ $match : { $and: [{categories: { $regex: 'news' }}, { categories: {$not: { $regex: "unavailable" }} } ] }}, {$sort: {date: -1}}, { $limit: amount }])
        posts = await posts.toArray()
        const query = { categories: { $regex: 'news' }}
        const count = await this.count(c, query)
        posts.count = count
        return await posts
    }

    async getLatestPostByCategory(categories_, amount){
        const posts = []
        
        for(const category of categories_){
            let items
            if(category === "news"){
                items = await db.collection('Post').aggregate([{ $match : { $and: [{categories: { $regex: 'news' }}, { categories: {$not: { $regex: "unavailable" }} } ] }}, {$sort: {date: -1}}, { $limit: amount }])
            } else {
                items = await db.collection('Post').aggregate([{ $match : { $and: [{categories: { $regex: category }}, {videos: { $ne: "" }}, { categories: {$not: { $regex: "unavailable" }} } ] }}, { $sample:{ size: amount }}])
            }
            const query = { categories: { $regex: category }}
            items = await items.toArray()
            items = items.map(post => ({...post, _id: post._id.toString()}))
            const count = await this.count(query)
            items.count = count
            posts.push(await items)
        }
    
        return posts
    }

    async paginatePostsByCategory(params, amount){
        const category = params.category
        const page = parseInt(params.page)
        let query
        if(category === 'movies'){
            query = { categories: { $regex: 'movie' }}
        }else{
            query = { categories: { $regex: category }}
        }
        const count = await this.count(query)
        let items
        if(category === "movies"){
            items = await db.collection('Post').aggregate([{ $match : {categories : { $regex: "movie" }}}, { $sample:{ size: amount }}])
        }else{
            items = await db.collection('Post').find(query).sort({ date: -1 }).skip((page-1)*amount).limit(amount)
        }
        items = await items.toArray()
        let posts = items.map(post => ({...post, _id: post._id.toString()}))
        return { posts, count }
    }

    async getRandomPosts(amount, post){
        const postExclude = new ObjectId(post._id)
        let results
        if(post.categories.includes('news')){
            if(post.categories.includes('doc')){
                results = await db.collection('Post').aggregate(
                    [{ $match : {categories : { $regex: "doc" }, _id: {$ne:  postExclude} } }, { $sample:{ size: amount }}]
                )
            }else if(post.categories.includes('opinion')){
                results = await db.collection('Post').aggregate(
                    [{ $match : { categories:{ $regex: "opinion" }, _id: { $ne: postExclude } }}, { $sort: { date : -1 } }, { $limit: amount }]
                )
            }else{
                results = await db.collection('Post').aggregate(
                    [{ $match : { categories:{ $regex: "news" }, _id: { $ne: postExclude } }}, { $sort: { date : -1 } }, { $limit: amount }]
                )
            }
        }else{
            const str = post.categories.split(',')
            let category = str[0]
            
            results = await db.collection('Post').aggregate(
                [{ $match : {categories: { $regex: category }, _id: {$ne: postExclude }} }, { $sample:{ size: amount }}]
            )
        }

        let posts = await results.toArray()
        posts = posts.map(post => ({...post, _id: post._id.toString()}))
       
        return posts
    }

    async getRandomAll(c, amount){
        const db = c.get('db')
        const results = await db.collection('Post').aggregate(
            [{ $match : {categories : {$regex: "movie" }} }, { $sample:{ size: amount }}]
        )
        return results.toArray()
    }

    async getRandomPlaylist(amount, category, thumbs){
        const results = await db.collection('Post').aggregate(
            [{ $match : { categories : { $regex: category, $not: { $regex: "unavailable" } } , thumb: {$nin: thumbs}, videos: { $ne: "" } } }, { $sample:{ size: amount }}]
        )

        return results.toArray()
    }
}

export default new Post()