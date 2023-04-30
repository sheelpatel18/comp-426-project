import express, { Request, Response } from 'express'
import http from 'http'
import apiRouter from "./api/api"
import minimist from 'minimist'
import cors from 'cors'
const app = express()


const args = minimist(process.argv.slice(2))
const port = args?.port || 5001

app.use(cors())

if (!args['api-only']) {
    console.log('run app route')
    app.route('/app')
        .get((req: Request, res: Response) => {
            // render app from /app folder.
        })
}


app.use('/api', apiRouter)

app.all("/ping", (req, res) => {
    res.status(200).send("PONG")
})



http.createServer(app).listen(port, () => {
    console.log(`Server is running on port ${port}`)
})