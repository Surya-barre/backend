import express from "express";
import verifyToken from "../middleware/verifyUser.js";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import { GetReceiverSocketId } from "../socket/socket.js";
import { io } from "../socket/socket.js";
import User from "../models/User.js";

const router = express.Router();
// router.get('/read/:receiverId',verifyToken,async(req,res)=>{
//     try{
//         const {receiverId}=req.params;
//         const senderId=req.user._id;
//         console.log(senderId)
//         console.log(req.params)
//         let conversation = await Conversation.findOne({
//             participants: { $all: [senderId, receiverId] },
//           });
//           if(!conversation){
//             return res.status(404).json({message:"Not Found"})
//           }
//           const messages=await Message.find({
//             conversationId:conversation._id
//           }).sort({createdAt:1})
//           return res.status(200).json(messages)
        
//     }catch(err){
//         console.log(err);
//         return res.statusCode(500).json({msg:err})
//     }
// })
 

// GET /chat/users/:id -> Fetch receiver's name by ID

router.get("/read/:receiverId", verifyToken, async (req, res) => {
  try {
    const { receiverId } = req.params;

    // Extract _id from the user object in headers
    const userHeader = req.headers["x-user"];
    if (!userHeader) {
      return res.status(400).json({ message: "User data not provided" });
    }

    const user = JSON.parse(userHeader);
    const senderId = user._id; // only take _id from the object

    // console.log("Sender ID:", senderId);
    // console.log("Receiver ID:", receiverId);

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const messages = await Message.find({
      conversationId: conversation._id,
    }).sort({ createdAt: 1 });

    return res.status(200).json(messages);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: err.message });
  }
});
  
// POST /chat/message/send/:receiverId
router.post("/send/:receiverId", verifyToken, async (req, res) => {
  const { content, senderId } = req.body;
  const { receiverId } = req.params;

  try {
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [senderId, receiverId],
      });
      await conversation.save();
    }

    const newMessage = new Message({
      conversationId: conversation._id,
      sender: senderId,
      content: content,
      createdAt: new Date(),
    });

    await newMessage.save();

     const reciverSocketId=GetReceiverSocketId(receiverId)
     if (reciverSocketId) {
        io.to(reciverSocketId).emit('newMessage',newMessage);
     }
        return res.json(newMessage); // send back the new message
  } catch (err) {
    console.error("Error sending message:", err);
    res.status(500).json({ message: "Failed to send message" });
  }
});

export default router;
