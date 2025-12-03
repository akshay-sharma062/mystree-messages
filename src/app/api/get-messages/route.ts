import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import dbConnect from "@/lib/dbConnet";
import UserModel from "@/model/user.model";
import { User } from "next-auth";
import mongoose from "mongoose";


export async function GET(request:Request) {
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
    const userId = new mongoose.Types.ObjectId(user._id)
    try {
        const user = await UserModel.aggregate([
            {$match:{id:userId}},
            {$unwind:"$messages"},
            {$sort:{'messages.createdAt':-1}},
            {$group:{_id : '$_id',messages:{$push:'$messages'}}}
        ])
        if (!user || user.length === 0) {
            return Response.json(
                {
                    success : false,
                    message : "user not found"
                },
                {
                   status : 401
                }
            )
        }
        return Response.json(
            {
                success : true,
                message : user[0].messages
            },
            {
               status : 200
            }
        )
    } catch (error) {
        console.log("unexpected error occured:",error)
        return Response.json(
            {
                success : false,
                message : "unexpected error occured"
            },
            {
               status : 500
            }
        )
    }
    
}