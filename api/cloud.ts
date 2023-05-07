import * as firebaseAdmin from 'firebase-admin'
import { UserRecord } from 'firebase-admin/lib/auth/user-record';
import key from '../key.json' // key.json is the key file for the firebase admin app, required to be in root of project

class _Auth {

    /**
     * This function utilizes firebases' auth API to create a user with a phone number and id in the 'auth system'
     * @param param0 object containing phone number and id { phone: "", id: "" }
     * @returns A User Record (firebase type) if successful, null if not
     */
    static async createUser({ phone: phoneNumber, id: uid }: {phone: string, id: string}): Promise<UserRecord | null> {
        try {
            return await firebaseAdmin.auth().createUser({
                uid,
                phoneNumber
            })
        } catch (err) {
            console.error(err)
            return null;
        }

    }

    /**
     * This function utilizes firebases' auth API to get a retrieve a user by their phone number from the 'auth system'
     * @param phone 10-digit phone number of user with country code (e.g. +1xxxxxxxxxx)
     * @returns A User Record (firebase type) if successful, null if not
     */
    static async getUserByPhone(phone: string): Promise<UserRecord | null> {
        try {
            return await firebaseAdmin.auth().getUserByPhoneNumber(phone);
        } catch (err) {
            console.error(err)
            return null;
        }
    }

}

class _Database {

    /**
     * This function utilizes firebases' firestore API to get a document from a collection
     * @param collection name of collection as a string
     * @param id id of document as a string
     * @returns data of document as a JSON object if it exists, null if not
     */
    static async get(collection: string, id: string) : Promise<any | null> {
        const doc = await Cloud.app.firestore().collection(collection).doc(id).get()
        if (doc.exists) {
            return doc.data()
        } else {
            return null
        }
    }

    /**
     * This function utilizes firebases' firestore API to get all documents from a collection. It will return an empty array if an error occurs
     * @param collection name of collection as a string
     * @returns array of all documents in collection as JSON objects, empty array if an error occurs
     */
    static async getCollection(collection: string): Promise<any[]> {
        try {
          const snapshot: firebaseAdmin.firestore.QuerySnapshot<firebaseAdmin.firestore.DocumentData> = await Cloud.app.firestore().collection(collection).get(); // snapshot object (firebase object)
          const data: any[] = []; // init empty array containing data
          snapshot.forEach((doc) => {
            // loop through snapshot and push document data into array
            data.push(doc.data());
          });
          return data; // return array with document data from entire collection
        } catch (error) {
            console.error(error)
            return []
        }
      }

      /**
       * This function utilizes firebases' firestore API to edit a document in a collection, it will not edit a document if it does not exist
       * @param collection name of collection as a string
       * @param id id of document as a string
       * @param data data to update document with as a JSON object
       */
    static async edit (collection: string, id: string, data: any) : Promise<void> {
        const ref = await Cloud.app.firestore().collection(collection).doc(id).get() // create document ref and get document
        if (ref.exists) {
            // if document exists, update it
            await ref.ref.update(data)
        } // do nothing if document doesn't exist
    }

    /**
     * This function utilizes firebases' firestore API to create a document in a collection, it will not create a document if it already exists
     * @param collection name of collection as a string
     * @param id id of document as a string
     * @param data data to create document with as a JSON objects
     */
    static async create (collection: string, id: string, data: any) : Promise<any> {
        const ref = await Cloud.app.firestore().collection(collection).doc(id).get() // create document ref and get document
        if (!ref.exists) {
            // if document doesn't exist, create it
            await ref.ref.set(data)
        } // do nothing if document exists
    }

}

// all the supported interaction types for logging purposes
export enum InteractionType {
    LOGIN = "LOGIN",
    LOGOUT = "LOGOUT",
    DELETE_ACCOUNT = "DELETE_ACCOUNT",
    SUBMIT_SCHEDULE = "SUBMIT_SCHEDULE",
    REQUEST_MEETING_TIME = "REQUEST_MEETING_TIME",
}

// type definitions for logging interactions
type InteractionData =  {
    "interactions": Interaction[]
}

// interaction object to be injected into database for logging purposes
type Interaction = {
    userID?: string | null,
    interaction: string,
    timestamp: number
}

export class Cloud {
    static app: firebaseAdmin.app.App
    static Auth = _Auth
    static Database = _Database

    /**
     * Initializes firebase admin app, key must be in root of project for this to work
     */
    static init() {
        if (!this.app) { // only runs if app is not already created. 
            // path is key
            this.app = firebaseAdmin.initializeApp({
                credential: firebaseAdmin.credential.cert(key as any),
            })
        }  // do nothing if app is already created
    }

    /**
     * Logs interaction data in firestore database.
     * @param interaction interaction type to log
     * @param userID optional user id to log with interaction
     */
    static async logInteraction(interaction: InteractionType, userID?: string): Promise<void> {
        let docRef = Cloud.app.firestore().collection('users').doc('interactions') // create document ref
        let interactionData: InteractionData = (await docRef.get()).data() as InteractionData // get data from document ref
        let existingInteractionData: Interaction[] = interactionData?.interactions || [] // get existing interaction data, init to empty array if it does not exist
        let newData = { userID : userID || null, interaction: interaction.toString(), timestamp: Date.now() } // create new interaction data from params
        existingInteractionData = [...existingInteractionData, newData] // add new interaction data to existing interaction data
        await docRef.set({ interactions: existingInteractionData }) // set document data to new interaction data. Technically overrides all existing data, but this is fine for our purposes
        return;
    }

}