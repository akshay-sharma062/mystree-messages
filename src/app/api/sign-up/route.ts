import { SendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnet";
import UserModel from "@/model/user.model";
import { signUpSchema } from "@/schemas/signUp.schema";
import bcrypt from "bcryptjs";
export async function POST(request:Request) {


    await dbConnect()
    try {

        const {username , email , password} = await request.json()
        const validiateUser = await signUpSchema.safeParseAsync({username , email , password})
        if (!validiateUser.success) {
            const errors = validiateUser.error.issues.map((err) => ({
              path: err.path.join('.'),  
              message: err.message,      
            }));
          
            return Response.json(
              { success: false, errors },
              { status: 422 }
            );
          }
        console.log("crud",username , email , password)
        // const existingUserVerifiedByUsername = await UserModel.findOne({
        //     username,
        //     isverified:true
        // })
        // if (existingUserVerifiedByUsername) {
        //    return Response.json({
        //     success : false,
        //     message : "User already Resisterd ",
             
        //    },{
        //     status : 400
        //    })
        // }
        const existingUserVerifiedByEmail = await UserModel.findOne({email})
        console.log(existingUserVerifiedByEmail,"emai verifyx")
        const verifyCode = Math.floor(100000 + Math.random()* 9000000).toString()

        if (existingUserVerifiedByEmail) {
            console.log("i am in ")
            if (existingUserVerifiedByEmail.isverified) {
                return Response.json(
                    {
                        success : false,
                    message :"user alredy registerd with email", 
                    },
                    {
                        status : 400
                    }
                )
            }else{
                const hasedPassword = await bcrypt.hash(password , 10)
                existingUserVerifiedByEmail.password = hasedPassword
                existingUserVerifiedByEmail.verifyCode = verifyCode
                existingUserVerifiedByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                await existingUserVerifiedByEmail.save()
            }
        }else{
            console.log("im in")
            const hasedPassword = await bcrypt.hash(password,10)

            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours()+1)

                    
           const newUser = new UserModel({
                username ,
                email , 
                password : hasedPassword ,
                verifyCode ,
                verifyCodeExpiry : expiryDate ,
                isverified : false ,
                isAceptingMessage :true ,
                messages : []
            })
            console.log(newUser,"new usew")
            await newUser.save()
        }

        // send verification email
    const emailResponse = await SendVerificationEmail(
        email,
        username,
        verifyCode
    )
    console.log(emailResponse,"email rs")
    if (!emailResponse.success) {
        return Response.json(
            {
                success : false,
            message : emailResponse.message, 
            },
            {
                status : 500
            }
        )
    }
    return Response.json(
        {
            success : true,
        message : "user registerd sucess verify your email", 
        },
        {
            status : 201
        }
    )

    } catch (error) {
        console.log("error registring user ", error)
        return Response.json(
            {
                success : false,
                message : "Error registering user  "
            },
            {
               status : 500
            }
        )
    }
    
}
