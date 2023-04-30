import express, { Request, Response } from 'express'
import * as firebaseAdmin from 'firebase-admin'
import {Cloud} from "./cloud"
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
                    const newUser = await User.create({phone})
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

    })



export default router