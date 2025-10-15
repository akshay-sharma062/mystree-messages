
import { Message } from "@/model/user.model"


export interface ApiResponse{
    success : boolean ,
    message : string ,
    isAceptingMessages ?: boolean ,
    messages ?: Array<Message>  //// diffrent spel 
}