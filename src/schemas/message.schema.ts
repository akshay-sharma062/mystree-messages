
import { z } from "zod";

export const messageSchema  = z.object({
    content : z 
    .string()
    .min(10,"content must be atlest of 10 char")
    .max(300,"content must be3 no longer then 300 char")
})