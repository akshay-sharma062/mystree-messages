import mongoose , {Schema , Document} from "mongoose";



export interface Message extends Document {
    content : string ,
    createdAt:Date
}


const MessageSchema : Schema<Message> = new Schema({
    content :{
        type : String,
        required : true
    },
    createdAt:{
        type : Date,
        required: true,
        default: Date.now
    }
})
export interface User extends Document {
    username : string ,
    email:string , 
    password : string ,
    verifyCode : string ,
    verifyCodeExpiry: Date ,
    isverified : boolean,
    isAceptingMessage : boolean ,
    messages : Message[]
}
   
const UserSchema : Schema<User> = new Schema({
    username :{
        type : String,
        required : [true , "Username is Reqired"],
        trim : true,
        unique : true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        unique: true,
        match: [
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          "Please enter a valid email address",
        ],    // email Validation 
      },
    password:{
        type : String,
        required : [true , "Password is Reqired"],
        trim : true,
    },
    verifyCode:{
        type : String,
        required: true,
    },
    verifyCodeExpiry:{
        type : Date,
        required: true,
    },
    isverified:{
        type : Boolean,
        default : false
    },
    isAceptingMessage:{
        type : Boolean,
        default: true,
    },
    message:[MessageSchema]
})


const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>('User',UserSchema)

export default UserModel ;