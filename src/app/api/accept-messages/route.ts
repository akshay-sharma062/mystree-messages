import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import dbConnect from "@/lib/dbConnet";
import UserModel from "@/model/user.model";
import { User } from "next-auth";


export async function POST(request:Request) {

        await dbConnect()
        const session = await getServerSession(authOptions)
        const user : User  = session?.user as User
        if(!session || !session.user){
            return Response.json(
                {
                    success : false,
                    message : "not Authenticated"
                },
                {
                   status : 401
                }
            )
        }
        const userId = user._id
        const {acceptMessages} = await request.json()
        try {
           const updatedUser = await UserModel.findByIdAndUpdate(
                userId,
                {isAceptingMessage:acceptMessages},
                {new:true}
            )
            if (!updatedUser) {
                return Response.json(
                    {
                        success : false,
                        message : "failed to update user status to acepting messages"
                    },
                    {
                       status : 401
                    }
                )
            }
            return Response.json(
                {
                    success : true,
                    message : "sucessfully updated user status to acepting messages",
                    updatedUser
                },
                {
                   status : 200
                }
            )
        } catch (error) {
            console.log("failed to update user status to acepting messages ", error)
        return Response.json(
            {
                success : false,
                message : "failed to update user status to acepting messages"
            },
            {
               status : 500
            }
        )
        }
}

export async function GET(request:Request){
   
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user : User  = session?.user as User
    if(!session || !session.user){
        return Response.json(
            {
                success : false,
                message : "not Authenticated"
            },
            {
               status : 401
            }
        )
    }
    const userId = user._id     
   try {
     const foundUser = await UserModel.findById(userId)
     if (!foundUser) {
         return Response.json(
             {
                 success : false,
                 message : "User not found"
             },
             {
                status : 404
             }
         )
     }
     return Response.json(
         {
             success : true,
             isAceptingMessage: foundUser.isAceptingMessage
         },
         {
            status : 200
         }
     )
   } catch (error) {
    console.log("error in getting status to acepting messages ", error)
        return Response.json(
            {
                success : false,
                message : "error in getting status to acepting messages"
            },
            {
               status : 500
            }
        )
   }
}