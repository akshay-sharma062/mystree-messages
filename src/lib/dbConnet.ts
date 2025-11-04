import mongoose from "mongoose";

type ConnectionObject = {
    isConnected ?: number
}

const connetion : ConnectionObject ={}



async function dbConnect():Promise<void> {
    if(connetion.isConnected){
        console.log("already connected")
        return
    }
    try {
       const db= await mongoose.connect(`mongodb://localhost:27017/` )//(process.env.MONGODB_URI || "" )
       connetion.isConnected = db.connections[0].readyState
       console.log( "db connected success")
    } catch (err) {
        
        console.log("db connection fail",err)
        process.exit(1)
    }
}

export default dbConnect;