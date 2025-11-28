// models/category.js
import { ObjectId } from 'mongodb'
import db from "./database.js"

class Category{
    async count(c){
        const db = c.get('db')
        return await db.collection('Category').countDocuments()
    }

    async createCategory(c, category){
        const db = c.get('db')
        await db.collection('Category').insertOne(category)
    }

    async getCategory(c){
        const db = c.get('db')
        const _id = new ObjectId(c.req.param('id'))
        return await db.collection('Category').findOne({_id})
    }

    async getCategories(c, amount){
        const db = c.get('db')
        return await db.collection('Category').find().sort({ date: -1 }).limit(amount).toArray()
    }

    async updateCategory(c, category){
        const db = c.get('db')
        const _id = new ObjectId(c.req.param('id'))
        await db.collection('Category').updateOne({ _id }, {$set: category})
    }

    async deleteCategory(c){
        const db = c.get('db')
        const _id = new ObjectId(c.req.param('id'))
        await db.collection('Category').deleteOne({ _id })
    }

    async paginateCategories(c, amount){
        const db = c.get('db')
        let page

        if(c.req.param('page')){
            page = parseInt(c.req.param('page'))
        }else if(c.req.query('page')){
            page = parseInt(c.req.query('page'))
        }else{
            page =  parseInt(c.get('navPage'))
        }
        
        return await db.collection('Category').find().sort({ date: -1 }).skip((page-1)*amount).limit(amount).toArray()
    }

    async getAllItems(){
        let categories = await db.collection('Category').find().sort({ date: -1 }).toArray()
        categories = categories.map(category => ({...category, _id: category._id.toString()}))
        return categories
    }

    
}


export default new Category()