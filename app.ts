import express, { Request, Response } from 'express'
import http from 'http'
import apiRouter from "./api/api"
import minimist from 'minimist'
import cors from 'cors'
import path from 'path'
const app = express()

const args = minimist(process.argv.slice(2))
const port = args?.port || 5001

app.use(cors())

console.log(path.join(__dirname, 'build'))

if (!args['api-only']) {
    console.log('run app route')

    const dirPath = path.join(__dirname) 
    const newPath = dirPath.split('/').slice(0,-1).join('/').concat('/app/meeting-app/build')
    console.log("PATH => ", newPath)
    const appRouter = express.Router()
    app.use(express.static(newPath));
    appRouter.get('*', (req, res) => {
        res.sendFile(newPath.concat('/index.html'));
      });

    app.use('/app', appRouter)

    // const getFilePathToBuild = (() => {
    //     let path = __dirname.split('/').slice(0, -1).join('/')
    //     return path + '/app/meeting-app/build'
    // })()

    // const reactAppRouter = express.Router()
    // reactAppRouter.use(express.static(getFilePathToBuild))
    //     .route('/')
    //         .get((_req: Request, res: Response) => {
    //             console.log(`${getFilePathToBuild}/index.html`)
    //             res.sendFile(`${getFilePathToBuild}/index.html`)
    //         })
        
    // app.use('/app', reactAppRouter)
}

app.use('/api', apiRouter)

app.all("/ping", (req, res) => {
    res.status(200).send("PONG")
})

app.get('/docs', (req, res) => {
    // html file is ./docs.html
    res.sendFile(__dirname + '/docs.html')
})

app.listen(5001, () => {
    console.log(`Server is listening on port ${5001}`);
  });
  

// http.createServer(app).listen(port, () => {
//     console.log(`Server is running on port ${port}`)
// })