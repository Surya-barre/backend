import mongoose  from "mongoose";
const messageScheme=new mongoose.Schema({
    conversationId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Conversation',
        required:true
    },
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    content:{
        type:String,
        required:true
    }
},
{
    timestamps:true,
})
const Message = mongoose.model("Message", messageScheme);
export default Message;