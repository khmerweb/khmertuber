import db from "./database.js"

class Session {
    async count(query={}){
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
        let session = await db.collection('Session').findOne({ ulid })
        if(session){
            session = {...session, _id: session._id.toString()}
        }
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