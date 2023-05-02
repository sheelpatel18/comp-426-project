import express, { Request, Response } from 'express'
import * as firebaseAdmin from 'firebase-admin'
import { Cloud, InteractionType } from "./cloud"
import { User } from './user'
import { UserRecord } from 'firebase-admin/lib/auth/user-record'
const router = express.Router()

Cloud.init()
router.use(express.json())

router.route("/user")
    .post((req: Request, res: Response) => {
        const {
            phone
        }: {
            phone: string
        } = req.body || {};

        (async () => {
            const userRecord: UserRecord | null = await firebaseAdmin.auth().getUserByPhoneNumber(phone).catch(e => null)
            if (userRecord) {
                res.status(409).send("USER_EXISTS")
                return;
            } else {
                const newUser = await User.create({ phone })
                res.status(200).json(newUser)
                return;
            }
        })().catch(err => {
            console.error(err)
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
        Cloud.logInteraction(InteractionType.LOGOUT, id).then(() => { res.status(200).send() })
    })

router.route("/user/:id")
    .get((req, res) => {
        const {
            id
        } = req.params
        const ref = firebaseAdmin.firestore().collection('users').doc(id);
        (async () => {
            const user = await ref.get()
            if (user.exists) {
                res.status(200).json(user.data())
                Cloud.logInteraction(InteractionType.LOGIN, id)
            } else {
                res.status(404).json({
                    message: "User not found"
                })
            }
        })().catch(err => {
            console.error(err)
            res.status(500).json({
                status: 500,
                message: "Internal server error",
                data: err?.message || ""
            })
        })
    })
    .patch((req, res) => {
        const {
            id
        } = req.params
        const data = req.body
        const { availability } = data || {}

        const ref = firebaseAdmin.firestore().collection('users').doc(id);

        (async () => {
            const user = await ref.get()
            if (user.exists) {
                await ref.update(data)
                res.status(200).json((await ref.get()).data())
                if (availability) await Cloud.logInteraction(InteractionType.SUBMIT_SCHEDULE, id)
            } else {
                res.status(404).json({
                    message: "User not found"
                })
            }
        })().catch(err => {
            console.error(err)
            res.status(500).json({
                status: 500,
                message: "Internal server error",
                data: err?.message || ""
            })
        })

    })
    .delete((req, res) => {
        const {
            id
        } = req.params
        const ref = firebaseAdmin.firestore().collection('users').doc(id);

        (async () => {
            const user = await ref.get()
            if (user.exists) {
                const [
                    dbDelete, // write result
                    authDelete, // void
                    deleteAcctLog
                ] = await Promise.all([
                    ref.delete(),
                    firebaseAdmin.auth().deleteUser(id),
                    Cloud.logInteraction(InteractionType.DELETE_ACCOUNT, id)
                ])
                res.status(200).json(user.data())
            } else {
                res.status(404).json({
                    message: "User not found"
                })
            }
        })().catch(err => {
            console.error(err)
            res.status(500).json({
                status: 500,
                message: "Internal server error",
                data: err?.message || ""
            })
        })
    })



const determineMessage = (dateAvailable: Date, peopleAvailable: string[], peopleNotAvailable: string[]) => {
    const dateMessage = `The best time to meet is ${dateAvailable.toLocaleDateString()}`
    const peopleAvailableMessage = (() => {
        switch (peopleAvailable.length) {
            case 0:
                return ""
            case 1:
                return `with ${peopleAvailable[0]}.`
            case 2:
                return `with ${peopleAvailable[0]} & ${peopleAvailable[1]}.`
            default:
                return `with ${peopleAvailable.slice(0, -1).join(", ")} & ${peopleAvailable.slice(-1)}.`
        }
    })()
    const peopleNotAvailableMessage = (() => {
        switch (peopleNotAvailable.length) {
            case 0:
                return ""
            case 1:
                return `Unfortunately, ${peopleNotAvailable[0]} is unavailable.`
            case 2:
                return `Unfortunately, ${peopleNotAvailable[0]} & ${peopleNotAvailable[1]} are unavailable.`
            default:
                return `Unfortunately, ${peopleNotAvailable.slice(0, -1).join(", ")} & ${peopleNotAvailable.slice(-1)} are unavailable.`
        }
    })()
    return `${dateMessage} ${peopleAvailableMessage} ${peopleNotAvailableMessage}`
}

router.route("/whenAvailable/:id")
    .get((req, res) => {
        const {
            id
        } = req.params;
        (async () => {
            let users = (await Cloud.Database.getCollection("users")).map(u => new User(u))

            Cloud.logInteraction(InteractionType.REQUEST_MEETING_TIME)

            const findHighestAvailability = (people: User[]): [Date, string[]] => {
                const availabilityMap: Map<number, Set<string>> = new Map();

                people.forEach((person) => {
                    person.availability.forEach((dateTime) => {
                        const timestamp = dateTime.getTime();
                        if (!availabilityMap.has(timestamp)) {
                            availabilityMap.set(timestamp, new Set());
                        }
                        availabilityMap.get(timestamp)?.add(person.id);
                    });
                });

                let maxAvailability = 0;
                let maxAvailabilityTime: Date | null = null;

                availabilityMap.forEach((names, timestamp) => {
                    if (names.size > maxAvailability) {
                        maxAvailability = names.size;
                        maxAvailabilityTime = new Date(timestamp)
                    }
                });

                if (maxAvailabilityTime === null) {
                    throw new Error("No availability found");
                }

                const unavailablePeople: string[] = [];
                const maxAvailablePeople = availabilityMap.get((maxAvailabilityTime as Date).getTime())!;

                people.forEach((person) => {
                    if (!maxAvailablePeople.has(person.id)) {
                        unavailablePeople.push(person.id);
                    }
                });

                return [maxAvailabilityTime, unavailablePeople];
            }

            const [availableTime, idsNotAvailable] = findHighestAvailability(users)

            const idsToNamesOrNumber = idsNotAvailable.map(id => {
                const user = users.find(u => u.id === id)
                return user?.name || user?.phone || ""
            })

            const namesAndNumbersAvailable = users.filter(u => !idsNotAvailable.includes(u.id)).map(user => user?.name || user?.phone)

            res.status(200).send(determineMessage(availableTime, namesAndNumbersAvailable, idsToNamesOrNumber))
            await Cloud.logInteraction(InteractionType.REQUEST_MEETING_TIME, id)
            return;

        })().catch(err => {
            console.error(err)
            res.status(200).send(`Unfortunately, no one is available.`)
        })
    })



export default router