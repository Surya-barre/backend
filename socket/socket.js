import {Server} from "socket.io";
import http from 'http';
import express from 'express';
const app=express();
const onlineUsers={}
const server = http.createServer(app);
const io=new Server(server,{
    cors:{
        origin:"*",
        methods:["GET","POST"]
    }
})
export const GetReceiverSocketId=(receiverId)=>{
  return onlineUsers[receiverId]
}
io.on('connection',(socket)=>{
    // console.log("user joined",socket.id);
    socket.on('join',(receiverId)=>{
        onlineUsers[receiverId]=socket.id;
        // console.log("Receiver:",receiverId,"socket id",socket.id)

    })
})
export{app,server,io}
// import { Server } from "socket.io";
// import http from "http";
// import express from "express";

// const app = express();
// const server = http.createServer(app);

// const onlineUsers = {}; // Maps userId -> socket.id

// const io = new Server(server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"],
//   },
// });

// io.on("connection", (socket) => {
//   console.log("User connected:", socket.id);

//   socket.on("join", (userId) => {
//     onlineUsers[userId] = socket.id;
//     console.log(`User ${userId} joined with socket ID ${socket.id}`);
//   });

//   // Listen for a new message from sender
//   socket.on("sendMessage", ({ receiverId, message }) => {
//     const receiverSocket = onlineUsers[receiverId];
//     if (receiverSocket) {
//       io.to(receiverSocket).emit("receiveMessage", message); // Send to receiver
//     }

//     const senderSocket = socket.id;
//     io.to(senderSocket).emit("messageSent", message); // Echo back to sender
//   });

//   socket.on("disconnect", () => {
//     // Clean up disconnected users
//     for (const [userId, socketId] of Object.entries(onlineUsers)) {
//       if (socketId === socket.id) {
//         delete onlineUsers[userId];
//         break;
//       }
//     }
//     console.log("User disconnected:", socket.id);
//   });
// });

// export { app, server };
