import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import dbConnect from "@/lib/dbConnet";
import UserModel from "@/model/user.model";
import { User } from "next-auth";


export async function Post(request:Request) {
    try {
        await dbConnect()
        const session = await getServerSession(authOptions)


    } catch (error) {
        console.log("error acepting messages ", error)
        return Response.json(
            {
                success : false,
                message : "user can not accept messages"
            },
            {
               status : 500
            }
        )
    }  
}

