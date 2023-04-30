import * as firebaseAdmin from 'firebase-admin'
import { applicationDefault } from 'firebase-admin/app';
import { UserRecord } from 'firebase-admin/lib/auth/user-record';
import key from '../key.json'

class _Auth {

    static async createUser({ phone: phoneNumber, id: uid }: {phone: string, id: string}): Promise<UserRecord | null> {
        try {
            return await firebaseAdmin.auth().createUser({
                uid,
                phoneNumber
            })
        } catch (err) {
            return null;
        }

    }

    static async getUserByPhone(phone: string): Promise<UserRecord | null> {
        try {
            return await firebaseAdmin.auth().getUserByPhoneNumber(phone);
        } catch (e) {
            return null;
        }
    }

}

class _Database {

    static async get(collection: string, id: string) : Promise<any> {
        const doc = await Cloud.app.firestore().collection(collection).doc(id).get()
        if (doc.exists) {
            return doc.data()
        } else {
            return null
        }
    }

    static getCollection(collection: string) : Promise<any[]> {
        return new Promise((resolve, reject) => {
            Cloud.app.firestore().collection(collection).get().then((snapshot) => {
                const data: any[] = []
                snapshot.forEach((doc) => {
                    data.push(doc.data())
                })
                resolve(data)
            }).catch(reject)
        })
    }

    static async edit (collection: string, id: string, data: any) : Promise<void> {
        const ref = await Cloud.app.firestore().collection(collection).doc(id).get()
        if (ref.exists) {
            await ref.ref.update(data)
        }
    }

    static async create (collection: string, id: string, data: any) : Promise<any> {
        const ref = await Cloud.app.firestore().collection(collection).doc(id).get()
        if (!ref.exists) {
            await ref.ref.set(data)
        }
    }

}

export class Cloud {
    static app: firebaseAdmin.app.App
    static Auth = _Auth
    static Database = _Database

    static init() {
        if (!this.app) {
            // path is key
            this.app = firebaseAdmin.initializeApp({
                credential: firebaseAdmin.credential.cert(key as any),
            })
        }   
    }

}