import express, { Request, Response } from 'express'
import http from 'http'
import apiRouter from "./api/api"
import minimist from 'minimist'
import cors from 'cors'
import path from 'path'
import request from 'supertest'

const app = express()

const args = minimist(process.argv.slice(2))
const port = args?.port || 5001

app.use(cors())

if (!args['api-only']) {
    const dirPath = path.join(__dirname) 
    const newPath = dirPath.split('/').slice(0,-1).join('/').concat('/app/meeting-app/build')
    const appRouter = express.Router()
    app.use(express.static(newPath));
    appRouter.get('*', (req: Request, res: Response) => {
        res.sendFile(newPath.concat('/index.html'));
      });

    app.use('/app', appRouter)

}

app.use('/api', apiRouter)

app.all("/ping", (req: Request, res: Response) => {
    res.status(200).send("PONG")
})

app.get('/docs', (req: Request, res: Response) => {
    // html file is ./docs.html
    res.sendFile(__dirname + '/docs.html')
})

// app.listen(5001, () => {
//     console.log(`Server is listening on port ${5001}`);
//   });


if (require.main === module) {
  http.createServer(app).listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

export default app