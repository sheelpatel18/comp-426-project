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

    /**
     * Gets user from database by id
     * @param id id of user to get
     * @returns User object if it exists, null if not
     */
    static async get(id: string): Promise<User | null> {
        const userData = await Cloud.Database.get('users', id)
        if (userData) {
            return new User(userData)
        } else {
            return null
        }
    }

    /**
     * edits user in database given the current user object
     */
    async edit(): Promise<void> {
        await Cloud.Database.edit('users', this.id, this.toJSON())
    }

    /**
     * 
     * @param param0 object with the following properties: id, name, phone, availability (e.g. {id: "", name: "", phone: "", availability: []})
     * @returns User Object
     */
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

    /**
     * Parses user object into JSON-friendly format
     * @returns JSON representation of user object
     */
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            phone: this.phone,
            availability: this.availability
        }
    }

}