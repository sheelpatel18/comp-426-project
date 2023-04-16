import express, { Request, Response } from 'express'
import * as firebaseAdmin from 'firebase-admin'
import { applicationDefault } from 'firebase-admin/app'
const router = express.Router()

const app = firebaseAdmin.initializeApp({
    credential: applicationDefault()
})
console.log(app.name)

router.route("/user")
    .post((req, res) => {
        const {
            phone
        }: {
            phone: string
        } = req.body

        const ref = firebaseAdmin.firestore().collection('users').doc(phone);
        (async () => {
            const user = await ref.get()
            if (user.exists) {
                res.status(403).send("USER_EXISTS")
            } else {
                const newUser = await ref.set({
                    phone
                })
                res.status(200).json(newUser)
            }
        })()

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

        const ref = firebaseAdmin.firestore().collection(id).doc();

        (async () => {
            const user = await ref.get()
            if (user.exists) {
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
    .delete((req, res) => {
        const {
            id
        } = req.params
        const ref = firebaseAdmin.firestore().collection(id).doc();

        (async () => {
            const user = await ref.get()
            if (user.exists) {
                await ref.delete()
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