import dbConnect from "@/lib/dbConnet";
import UserModel from "@/model/user.model";
import { Message } from "@/model/user.model";

export async function POST(request:Request) {
    await dbConnect()
   const {username,content} = await request.json()
   try {
        const user = await UserModel.findOne({username})
        if (!user){
            return Response.json(
                {
                    success : false,
                    message : "user not found"
                },
                {
                   status : 404
                }
            )
        }
        //is user accepting messages
        if (!user.isAceptingMessage) {
            return Response.json(
                {
                    success : false,
                    message : "not acceptingmessages"
                },
                {
                   status : 403
                }
            )
        }
        const newMessage = {content , createdAt:new Date()}
         user.messages.push(newMessage as Message)
         await user.save()
         return Response.json(
            {
                success : true,
                message : "Message sent sucess"
            },
            {
               status : 200
            }
        )
   } catch (error) {
    console.log("error adding messages",error)
    return Response.json(
        {
            success : true,
            message : "error adding messages"
        },
        {
           status : 500
        }
    )
   }
    
}