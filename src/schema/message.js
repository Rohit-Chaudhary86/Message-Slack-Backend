import mongoose from 'mongoose';

const messageSchema=mongoose.Schema({
  body:{
    type:String,
    required:[true,"message body is required"]
  },
  image:{
    type:String,
  },
  channelId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Channel',
    required:[true,'Channel id is required ']
  },
  senderId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:[true,'Sender Id required']
  },
  WorkSpaceId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Workspace',
    required:[true,'workspace id is required']
  }

})

const Message=mongoose.model('Message',messageSchema)
export default Message;