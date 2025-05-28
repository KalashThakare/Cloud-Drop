import {Server} from "socket.io";
import express from "express";
import http from "http";

const app = express();
const server = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin:["http://localhost:3000"],
        methods: ["GET", "POST"],
        credentials:true
    },
    transports: ['websocket', 'polling']
});

export function getReciverSocketId(userId){
    return userSocketMap[userId];
}

const userSocketMap = {};

io.on("Connection",(socket)=>{

    console.log("A user connected",socket.id);

    const userId = socket.handshake.query.userId;

    if(userId){
        userSocketMap[userId] = socket.id;
    }

    io.emit("getOnlineUsers",Object.keys(userSocketMap));

    socket.on("roleUpdated", (data) => {
        socket.to(data.groupId).emit("roleUpdated", data);
        console.log("Broadcasting role update:", data);
    });

    socket.on("disconnect",()=>{
        console.log("A user disconnected",socket.id);

        delete userSocketMap[userId];

        io.emit("getOnlineUsers",Object.keys(userSocketMap));
    });

});



export {io,app,server};