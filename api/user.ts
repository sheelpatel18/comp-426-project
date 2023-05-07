import * as firebaseAdmin from 'firebase-admin'
import ObjectID from 'bson-objectid'
import { Cloud } from './cloud'

const generateID = () : string => ObjectID().toHexString() // generate a random BSON object ID

/**
 * This class represents a user in the database
 */
export class User {
    id: string
    name: string
    phone: string
    availability: Date[]

    constructor({ id, name, phone, availability}: {id?: string, name?: string, phone?: string, availability?: string[] | Date[]}) {
        this.id = id || ""
        this.name = name || ""
        this.phone = phone || ""
        this.availability = availability ? availability.map(date => new Date(date)) : []
    }

    static async get(id: string): Promise<User | null> {
        const userData = await Cloud.Database.get('users', id)
        if (userData) {
            return new User(userData)
        } else {
            return null
        }
    }

    async edit(): Promise<void> {
        await Cloud.Database.edit('users', this.id, this.toJSON())
    }

    static async create({ id, name, phone, availability}: {id?: string, name?: string, phone: string, availability?: Date[]}): Promise<User> {
        if (await Cloud.Auth.getUserByPhone(phone)) {
            throw new Error("USER_EXISTS")
        } else {
            const newUser = new User({
                id: id || generateID(),
                name: name || "",
                phone,
                availability: availability || []
            })
            await Cloud.Auth.createUser({phone, id: newUser.id})
            await Cloud.Database.create('users', newUser.id, newUser.toJSON())
            return newUser
        }
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            phone: this.phone,
            availability: this.availability
        }
    }

}