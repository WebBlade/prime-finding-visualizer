import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { Worker } from 'worker_threads'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { algorithmsList } from './algorithms/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer)

app.use(express.static(join(__dirname, '../public')))

const frontendConfig = Object.keys(algorithmsList).map(key => ({
        key: key,
        label: algorithmsList[key].label,
        color: algorithmsList[key].color
}))

io.on('connection', (socket) => {
    console.log(`Client is connected ID: ${socket.id}`)

    socket.emit('init-config', frontendConfig)

    socket.on('start-race', (data) => {
        const { algorithm, range} = data

        console.log(`Search is started algorithm: ${algorithm} in range: ${range}`)

        const workerPath = join(__dirname, 'workers/searchWorker.js')

        const worker = new Worker(workerPath, {
            workerData: {algorithm, range}
        })

        worker.on('message', (result) => {
            socket.emit('race-result', result)

            worker.terminate()
        })

        worker.on('error', (err) => {
            console.error('error: ', err)
            socket.emit('error: ', err)
        })
    })
})

const PORT = 3000

httpServer.listen(PORT, () => {
    console.log(`Server is started on port: ${PORT}`)
})