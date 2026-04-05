import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'

const app = express()
const server = createServer(app)

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})

app.use(cors({
    credentials: true,
    origin: '*'
}))

// 🔥 store latest location per room
const latestLocations = {}

// 🔥 track users per room (for cleanup)
const socketRoomMap = {}

io.on('connection', (socket) => {
    console.log("New user connected:", socket.id)

    // join room
    socket.on('join-room', (roomId) => {
        socket.join(roomId)

        // store mapping
        socketRoomMap[socket.id] = roomId

        console.log(`User ${socket.id} joined room ${roomId}`)

        // ✅ send last known location instantly
        if (latestLocations[roomId]) {
            socket.emit('receive-location', latestLocations[roomId])
        }
    })

    // receive location from sender
    socket.on('send-location', (data) => {
        const { lat, lng, roomId } = data

        console.log("Sender sent location:", { lat, lng, roomId })

        // ✅ store latest location
        latestLocations[roomId] = { lat, lng }

        // ✅ broadcast to others in room
        io.to(roomId).emit('receive-location', { lat, lng })
    })

    socket.on('disconnect', () => {
        const roomId = socketRoomMap[socket.id]

        console.log("User disconnected:", socket.id)

        // ❗ OPTIONAL CLEANUP
        // remove mapping
        delete socketRoomMap[socket.id]

        // ⚠️ DO NOT delete latestLocations immediately
        // because viewer may still need last location

        // If you want cleanup after all users leave → advanced logic needed
    })
})

const PORT = process.env.PORT || 4000

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})