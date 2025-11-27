import db from "./database.js"

class Session {
    async count(c, query={}){
        const db = c.get('db')
        return await db.collection('Session').countDocuments(query)
    }

    async createSession(user, ulid, jwt){
        const newSession = {
            createdAt: new Date(),
            author: user.title,
            ulid: ulid,
            jwt: jwt
        }
        await db.collection('Session').insertOne(newSession)
    }

    async getSession(ulid){
        const session = await db.collection('Session').findOne({ ulid })
        return session
    }

    async createIndexes(req){
        await req.prisma.$runCommandRaw({
            createIndexes: 'Session',
            indexes: [
              {
                key: {
                  createdAt: 1,
                },
                name: 'createdAt_ttl_index',
                expireAfterSeconds: 60*60*12,
              },
            ],
        })
    }
}

export default new Session()