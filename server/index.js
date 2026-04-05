import express from 'express'
import {createServer} from 'http'
import {Server} from 'socket.io'
import cors from 'cors'

const app = express()

const server = createServer(app)
const io = new Server(server,{
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})

app.use(cors({
    credentials : true,
    origin : '*'
}))

// listen on io
io.on('connection',(socket)=>{
    console.log("new user is connected",socket.id)

    // join in the same room 
    socket.on('join-room',(roomId)=>{
        socket.join(roomId);
        console.log(`User ${socket.id} joined in the room ${roomId}`)
    })

    //listen on send location event 
    socket.on('send-location',(data)=>{

        console.log("sender send location:",{lat,lng})
        const {lat,lng,roomId} = data

        // emit the location
        socket.to(roomId).emit('receive-location',{lat,lng})
    })


    socket.on('disconnect',()=>{
        console.log("User Disconnected",socket.id)
    })
})


const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});