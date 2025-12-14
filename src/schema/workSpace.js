import mongoose from "mongoose";

const workSpaceSchema=mongoose.Schema({
  name:{
    type:String,
    required:[true,'work']
  },
  description:{
    type:String
  },
  members:[{
    memberId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    role:{
        type:String,
        enum:['admin','member'],
        default:'member'
    }
  }],
  joinCode:{
    type:String,
    require:[true,'Join code is required']
  },
  channels:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Channel'
    }
  ]
})
const Workspace=mongoose.model('Workspace',workSpaceSchema)
export default Workspace;