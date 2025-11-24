import { MongoClient } from "mongodb"
import 'dotenv/config'
const uri = process.env.MONGO_URL
const client = new MongoClient(uri)
await client.connect()

let db
if(process.env.NODE_ENV !== "dev"){
    db = client.db("blog")
}else{
    if(!globalThis.db) {
        globalThis.db = client.db("blog")
    }

    db = globalThis.db
}

export default db