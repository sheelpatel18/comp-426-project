import express, { Request, Response } from 'express'
import * as firebaseAdmin from 'firebase-admin'
import { Cloud } from "./cloud"
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
                return;
            } else {
                res.status(404).json({
                    message: "User not found"
                })
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
    .patch((req, res) => {
        const {
            id
        } = req.params
        const data = req.body

        const ref = firebaseAdmin.firestore().collection('users').doc(id);

        (async () => {
            const user = await ref.get()
            if (user.exists) {
                await ref.update(data)
                res.status(200).json((await ref.get()).data())
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
        const ref = firebaseAdmin.firestore().collection(id).doc();

        (async () => {
            const user = await ref.get()
            if (user.exists) {
                const [
                    dbDelete, // write result
                    authDelete // void
                ] = await Promise.all([
                    ref.delete(),
                    firebaseAdmin.auth().deleteUser(id)
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

router.route("/whenAvailable")
    .get((req, res) => {
        (async () => {
            let users = (await Cloud.Database.getCollection("users")).map(u => new User(u))

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

            res.status(200).send(idsNotAvailable.length ?
                `The best time to meet is ${availableTime.toLocaleString()} with ${idsToNamesOrNumber.join(", ")}. Unfortunately, ${namesAndNumbersAvailable.join(", ")} are not available.` :
                `The best time to meet is ${availableTime.toLocaleString()} with ${namesAndNumbersAvailable.join(", ")}.`
            )

        })().catch(err => {
            res.status(200).send(`Unfortunately, no one is available.`)
        })
    })



export default router