import express, { Request, Response } from 'express'
import firebaseAdmin from 'firebase-admin'
const router = express.Router()

router.route("/user")
    .post((req, res) => {
        // create user
    })

router.route("/user/:id")
    .get((req, res) => {
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
        // represent each time slot as an object with count of user available at that time
        var date_today = new Date();
        var schedule = new Array();
        for (let day = 0; day < 7; day++) {
            for (let time =  10; time < 21; time++)
            var dateCur = new Date(date_today.getFullYear(), date_today.getMonth(), date_today.getDate() + day, time)
            schedule.push({
                "date": dateCur,
                "available": 0
            })
        }

        // get user available date arrays
        
        // for each user date array
            // for each date increment counter

        // return updated schedule
    })
    .post((req, res) => {

    })



export default router