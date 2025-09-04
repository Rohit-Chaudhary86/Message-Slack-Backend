import mongoose from 'mongoose'

const userSchema=new mongoose.Schema({
 email:{
    type:String,
    required:[true,"Email Is Required"],
    unique:[true,"Email already exists"],
    match:[/^[^\s@]+@[^\s@]+\.[^\s@]+$/,"Please enter a valid email"]
 },
 password:{
    type:String,
    required:[true,"Password Is Required"],
    
 },
 username:{
    type:String,
    required:[true,"Please enter userName"],
    unique:[true,"UserName already exists"],
    match:[/^[a-zA-Z0-9]+$/,"Please enter a valid userName"]
 },
avatar:{
    type:String,

 }
},{timestamps:true})

userSchema.pre('save',function saveUser(next){
    const user=this;
    user.avatar=`http://robohash.org/${user.username}`
    next();
})

const User=mongoose.model('User',userSchema)

export default User;