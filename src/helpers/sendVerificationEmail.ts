import { resend } from "@/lib/resend";
import VerificationEmail from "@/../emails/verificationEmail"

import { ApiResponse } from "@/types/ApiResponse";

export async function SendVerificationEmail(
    email : string ,
    username : string ,
    verficationCode : string
):Promise<ApiResponse> {


    try {

        const emailRes = await resend.emails.send({
            from: 'akshay.ku.sharma.062@gmail.com',
            to: email,
            subject: 'Mystreee Messages  ||  Verification Code',
            react: VerificationEmail({username, otp:verficationCode}),
          });
          console.log(emailRes," email send ")

        return { success: true , message : "verification email send  Sucess "}
    } catch (emailError) {
        console.log("error sending verification email",emailError)
        return { success: false , message : "failed to send  verification email"}
    }


}