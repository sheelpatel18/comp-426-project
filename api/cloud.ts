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

    static async getCollection(collection: string): Promise<any[]> {
        try {
          const snapshot = await Cloud.app.firestore().collection(collection).get();
          const data: any[] = [];
          snapshot.forEach((doc) => {
            data.push(doc.data());
          });
          return data;
        } catch (error) {
            console.error(error)
            return []
        }
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

export enum InteractionType {
    LOGIN = "LOGIN",
    LOGOUT = "LOGOUT",
    DELETE_ACCOUNT = "DELETE_ACCOUNT",
    SUBMIT_SCHEDULE = "SUBMIT_SCHEDULE",
    REQUEST_MEETING_TIME = "REQUEST_MEETING_TIME",
}

type InteractionData =  {
    "interactions": Interaction[]
}

type Interaction = {
    userID?: string | null,
    interaction: string,
    timestamp: number
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

    static async logInteraction(interaction: InteractionType, userID?: string) {
        let docRef = Cloud.app.firestore().collection('users').doc('interactions')
        let interactionData: InteractionData = (await docRef.get()).data() as InteractionData
        let existingInteractionData: Interaction[] = interactionData?.interactions || []
        let newData = { userID : userID || null, interaction: interaction.toString(), timestamp: Date.now() }
        existingInteractionData = [...existingInteractionData, newData]
        await docRef.set({ interactions: existingInteractionData })
        return;
    }

}