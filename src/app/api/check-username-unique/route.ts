import dbConnect from "@/lib/dbConnet";
import UserModel from "@/model/user.model";
import { z} from "zod";
import {userNameValidation} from "@/schemas/signUp.schema"


const UsernameQuerySchema = z.object({
    username : userNameValidation
})


export async function GET(request : Request) {
    await dbConnect()
    try {
        const {searchParams} = new URL(request.url)
        const queryPram = {
            username : searchParams.get("username")
        }
        const result = UsernameQuerySchema.safeParse(queryPram)
        console.log(result,"username Query Schema ")
        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json({
                success:false,
                message : "invalid query permeter "
            },
            {status:500}
            )
        }
        console.log("resukts of check usre-name-unique.js",result)
        const {username}=result.data
        const existingVerifiedUser = await UserModel.findOne({username,isverified:true})
        if (existingVerifiedUser) {
            
            return Response.json({
                success:false,
                message : "User alredy taken"
            },
            {status:500}
            )
        }
        return Response.json({
            success:true,
            message : "User name is unique"
        },
        {status:200}
        )

    } catch (error) {
        console.log("error checking user name ",error)
        return Response.json({
            success:false,
            message : "errror checking usrename"
        },
        {status:500}
        )
        
    }
    
}