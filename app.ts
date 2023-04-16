import express, { Request, Response } from 'express'
import http from 'http'
import apiRouter from "./api/api"
const app = express()

const port = process.env.PORT || 3000

app.route('/app')
    .get((req: Request, res: Response) => {
        // render app from /app folder.
    })


app.use('/api', apiRouter)

app.all("/ping", (req, res) => {
    res.status(200).send("PONG")
})



http.createServer(app).listen(port, () => {
    console.log(`Server is running on port ${port}`)
})