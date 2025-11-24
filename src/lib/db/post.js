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

    async getPost(c){
        const db = c.get('db')
        const _id = new ObjectId(c.req.param('id'))
        const post = await db.collection('Post').findOne({_id })
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

    async searchPosts(c, q, amount){
        const db = c.get('db')

        let page
        if(c.req.param('page')){
            page = parseInt(c.req.param('page'))
        }else{
            page =  1
        }
        
        const maxPosts = await db.collection('Post').find({title: {$regex: q, $options: "i"}}).sort({ date: -1 }).toArray()
        const posts = maxPosts.slice((page-1)*amount, page*amount)
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

    async paginatePostsByCategory(c, amount){
        const db = c.get('db')
        const category = c.req.param("category")
        const page = parseInt(c.req.param('page'))

        const query = { categories: { $regex: category } }
        let posts
        if(category === "movies"){
            posts = await db.collection('Post').aggregate([{ $match : {categories : { $regex: "movie" }}}, { $sample:{ size: amount }}])
        }else{
            posts = await db.collection('Post').find(query).sort({ date: -1 }).skip((page-1)*amount).limit(amount)
        }
        return posts.toArray()
    }

    async getRandomPosts(c, amount, post){
        const db = c.get('db')
        
        let results
        if(post.categories.includes('news')){
            if(post.categories.includes('doc')){
                results = await db.collection('Post').aggregate(
                    [{ $match : {categories : { $regex: "doc" }, _id: {$ne: post._id}} }, { $sample:{ size: amount }}]
                )
            }else if(post.categories.includes('opinion')){
                results = await db.collection('Post').aggregate(
                    [{ $match : { categories:{ $regex: "opinion" }, _id: { $ne: post._id } }}, { $sort: { date : -1 } }, { $limit: amount }]
                )
            }else{
                results = await db.collection('Post').aggregate(
                    [{ $match : { categories:{ $regex: "news" }, _id: { $ne: post._id } }}, { $sort: { date : -1 } }, { $limit: amount }]
                )
            }
        }else{
            let category = ''
            if(post.categories.includes(',')){
                const str = post.categories.split(',')
                category = str[0]
            }else{
                category = post.categories
            }

            results = await db.collection('Post').aggregate(
                [{ $match : {categories: { $regex: category }, _id: {$ne: post._id}} }, { $sample:{ size: amount }}]
            )
        }
       
        return results.toArray()
    }

    async getRandomAll(c, amount){
        const db = c.get('db')
        const results = await db.collection('Post').aggregate(
            [{ $match : {categories : {$regex: "movie" }} }, { $sample:{ size: amount }}]
        )
        return results.toArray()
    }

    async getRandomPlaylist(c, amount, category, thumbs){
        const db = c.get('db')
        const results = await db.collection('Post').aggregate(
            [{ $match : { categories : { $regex: category, $not: { $regex: "unavailable" } } , thumb: {$nin: thumbs}, videos: { $ne: "" } } }, { $sample:{ size: amount }}]
        )

        return results.toArray()
    }
}

export default new Post()