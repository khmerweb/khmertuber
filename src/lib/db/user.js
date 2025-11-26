//models/user.js
//npm install bcryptjs
import db from "./database.js"
import { ObjectId } from 'mongodb'
import bcrypt from "bcryptjs"

class User{
    async count(c){
        const db = c.get('db')
        return await db.collection('User').countDocuments()
    }

    async createRootUser(c){
        const hashPassword = bcrypt.hashSync("Tin2024", 8)
        const user = {
            email: "sokhavuth@khmerweb.app",
            title: "សុខាវុធ",
            password: hashPassword,
            role: "Admin",
            thumb: "",
            content: "",
            datetime: "",
        }

        const db = c.get('db')
        await db.collection('User').insertOne(user)
    }

    async createUser(c, user){
        const db = c.get('db')
        await db.collection('User').insertOne(user)
    }

    async checkUser(c, email){
        const db = c.get('db')
        return await db.collection('User').findOne({email})
    }

    async getUser(id){
        const _id = new ObjectId(id)
        let user = await db.collection('User').findOne({ _id })
    }

    async getUsers(c, amount){
        const db = c.get('db')
        return await db.collection('User').find().sort({ date: -1 }).limit(amount).toArray()
    }

    async updateUser(c, user){
        const db = c.get('db')
        const _id = new ObjectId(c.req.param('id'))
        await db.collection('User').updateOne({ _id }, {$set: user})
    }

    async deleteUser(c){
        const db = c.get('db')
        const _id = new ObjectId(c.req.param('id'))
        await db.collection('User').deleteOne({ _id })
    }

    async paginateUsers(c, amount){
        const db = c.get('db')
        let page

        if(c.req.param('page')){
            page = parseInt(c.req.param('page'))
        }else if(c.req.query('page')){
            page = parseInt(c.req.query('page'))
        }else{
            page = parseInt(c.get('navPage'))
        }
        
        return await db.collection('User').find().sort({ date: -1 }).skip((page-1)*amount).limit(amount).toArray()
    }
}

export default new User()