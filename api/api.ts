import express, { Request, Response } from 'express'
import * as firebaseAdmin from 'firebase-admin'
import { Cloud, InteractionType } from "./cloud"
import { User } from './user'
import { UserRecord } from 'firebase-admin/lib/auth/user-record'
const router = express.Router()

Cloud.init() // initialize firebase in Cloud class
router.use(express.json()) // use json bodies for requests

router.route("/user")
    .post((req: Request, res: Response) => {
        const {
            phone
        }: {
            phone: string
        } = req.body || {};

        (async () => {
            // check if user exists
            const userRecord: UserRecord | null = await firebaseAdmin.auth().getUserByPhoneNumber(phone).catch(e => null)
            if (userRecord) {
                // if user exists, respond appropriately
                res.status(409).send("USER_EXISTS")
                return;
            } else {
                // if new user, create in database/auth system
                const newUser = await User.create({ phone })
                // return user details to client
                res.status(200).json(newUser)
                return; // stop function execution - this is a safety measure.
            }
        })().catch(err => {
            console.error(err)
            // if any error occurs, respond with 500 and error messages if it exists
            res.status(500).json({
                status: 500,
                message: "Internal server error",
                data: err?.message || ""
            })
        })
    })
    
router.route("/user/logout/:id")
    .post((req: Request, res: Response) => {
        const {
            id
        } = req.params
        // this is a 'dummy' route that doesn't do anything other than log the interaction. If for some reason there is an error in the interaction, send back 500
        Cloud.logInteraction(InteractionType.LOGOUT, id).then(() => { res.status(200).send() }).catch(err => { console.error(err); res.status(500).send(err?.message || "") })
    })

router.route("/user/:id")
    .get((req: Request, res: Response) => {
        const {
            id
        } = req.params
        // create doc ref
        const ref = firebaseAdmin.firestore().collection('users').doc(id);
        (async () => {
            const user = await ref.get() // get document from database
            if (user.exists) {
                // if user exists, send user data to client
                res.status(200).json(user.data())
                Cloud.logInteraction(InteractionType.LOGIN, id) // log interaction
            } else {
                // if user does not exist, respond with 404
                res.status(404).json({
                    message: "User not found"
                })
            }
        })().catch(err => {
            console.error(err)
            // if any error occurs, respond with 500 and error messages if it exists
            res.status(500).json({
                status: 500,
                message: "Internal server error",
                data: err?.message || ""
            })
        })
    })
    .patch((req: Request, res: Response) => {
        const {
            id
        } = req.params
        const data = req.body
        const { availability } = data || {}

        // crate document ref
        const ref = firebaseAdmin.firestore().collection('users').doc(id);

        (async () => {
            const user = await ref.get() // get document from database
            if (user.exists) {
                // if user exists, update data in database
                await ref.update(data)
                // send updated data to client
                res.status(200).json((await ref.get()).data())
                if (availability) await Cloud.logInteraction(InteractionType.SUBMIT_SCHEDULE, id) // if the user updated their availability, log interaction
            } else {
                // if user does not exist, respond with 404
                res.status(404).json({
                    message: "User not found"
                })
            }
        })().catch(err => {
            console.error(err)
            // if any error occurs, respond with 500 and error messages if it exists
            res.status(500).json({
                status: 500,
                message: "Internal server error",
                data: err?.message || ""
            })
        })

    })
    .delete((req: Request, res: Response) => {
        const {
            id
        } = req.params
        // create document ref
        const ref = firebaseAdmin.firestore().collection('users').doc(id);

        (async () => {
            const user = await ref.get() // get document from database
            if (user.exists) {
                const [
                    dbDelete, // write result
                    authDelete, // void
                    deleteAcctLog // void
                ] = await Promise.all([
                    ref.delete(), // delete document from database
                    firebaseAdmin.auth().deleteUser(id), // delete auth profile from auth system
                    Cloud.logInteraction(InteractionType.DELETE_ACCOUNT, id) // log interaction
                ]) // wait for all promises to resolve before moving forward
                // send user data back to client to confirm deletion (last chance to get data, essentially)
                res.status(200).json(user.data())
            } else {
                // if user does not exist, respond with 404
                res.status(404).json({
                    message: "User not found"
                })
            }
        })().catch(err => {
            console.error(err)
            // if any error occurs, respond with 500 and error messages if it exists
            res.status(500).json({
                status: 500,
                message: "Internal server error",
                data: err?.message || ""
            })
        })
    })



const determineMessage = (dateAvailable: Date, peopleAvailable: string[], peopleNotAvailable: string[]) => {
    const dateMessage = `The best time to meet is ${dateAvailable.toLocaleDateString()}` // format date into message
    const peopleAvailableMessage = (() => {
        switch (peopleAvailable.length) {
            case 0:
                return "" // if no one is available, return empty string
            case 1:
                return `with ${peopleAvailable[0]}.` // if one, return name
            case 2:
                return `with ${peopleAvailable[0]} & ${peopleAvailable[1]}.` // if two, format with ampersand
            default:
                return `with ${peopleAvailable.slice(0, -1).join(", ")} & ${peopleAvailable.slice(-1)}.` // multiple, format with comma separated list (space incl) and ampersand at end
        }
    })()
    const peopleNotAvailableMessage = (() => {
        switch (peopleNotAvailable.length) {
            case 0:
                return "" // if no one is available, return empty string
            case 1:
                return `Unfortunately, ${peopleNotAvailable[0]} is unavailable.` // if one, return name
            case 2:
                return `Unfortunately, ${peopleNotAvailable[0]} & ${peopleNotAvailable[1]} are unavailable.` // if two, format with ampersand
            default:
                return `Unfortunately, ${peopleNotAvailable.slice(0, -1).join(", ")} & ${peopleNotAvailable.slice(-1)} are unavailable.` // multiple, format with comma separated list (space incl) and ampersand at end
        }
    })()
    return `${dateMessage} ${peopleAvailableMessage} ${peopleNotAvailableMessage}` // return concatenated message (spaces incl)
}

router.route("/whenAvailable/:id")
    .get((req, res) => {
        const {
            id
        } = req.params;
        (async () => {
            let users = (await Cloud.Database.getCollection("users")).map(u => new User(u)) // get all users from database as user objects

            const findHighestAvailability = (people: User[]): [Date, string[]] => {
                const availabilityMap: Map<number, Set<string>> = new Map(); // init empty map

                people.forEach((person) => {
                    person.availability.forEach((dateTime) => {
                        const timestamp = dateTime.getTime();
                        if (!availabilityMap.has(timestamp)) {
                            // if not in map, add
                            availabilityMap.set(timestamp, new Set());
                        }
                        availabilityMap.get(timestamp)?.add(person.id); // if in map, add to set
                    });
                });

                let maxAvailability = 0;
                let maxAvailabilityTime: Date | null = null;

                availabilityMap.forEach((names, timestamp) => {
                    if (names.size > maxAvailability) {
                        maxAvailability = names.size;
                        maxAvailabilityTime = new Date(timestamp)
                        // find greatest overlap by looping through availability map
                    }
                });

                if (maxAvailabilityTime === null) {
                    throw new Error("No availability found");
                }

                const unavailablePeople: string[] = [];
                const maxAvailablePeople = availabilityMap.get((maxAvailabilityTime as Date).getTime())!;

                people.forEach((person) => {
                    if (!maxAvailablePeople.has(person.id)) {
                        unavailablePeople.push(person.id); // create list of unavailable people
                    }
                });

                return [maxAvailabilityTime, unavailablePeople];
            }

            const [availableTime, idsNotAvailable] = findHighestAvailability(users)

            const idsToNamesOrNumber = idsNotAvailable.map(id => {
                const user = users.find(u => u.id === id) // find user by id
                return user?.name || user?.phone || "" // if no name, return phone, empty string as fallback
            })

            const namesAndNumbersAvailable = users.filter(u => !idsNotAvailable.includes(u.id)).map(user => user?.name || user?.phone) // filter out unavailable users, map to names or numbers

            res.status(200).send(determineMessage(availableTime, namesAndNumbersAvailable, idsToNamesOrNumber)) // send text response to client of best time to meet in a plain english readable format
            await Cloud.logInteraction(InteractionType.REQUEST_MEETING_TIME, id) // log interaction
            return; // stop function execution - this is a safety measure.

        })().catch(err => {
            console.error(err)
            // if any error occurs, respond with a fallback message stating no one is available. 
            res.status(200).send(`Unfortunately, no one is available.`)
        })
    })



export default router