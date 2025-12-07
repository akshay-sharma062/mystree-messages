"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useForm } from "react-hook-form"
import * as z from "zod"
import axios, { AxiosError } from 'axios'
import { useState,useEffect } from "react"
import { useFormState } from "react-dom"
import { useDebounceValue } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUp.schema"
import { ApiResponse } from "@/types/ApiResponse"
function page() {
    const [username, setUsername] = useState("")
    const [usernameMessage, setUsernameMessage] = useState("")
    const [isCheckingUsername, setIsCheckingUsername] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const debounceUsername = useDebounceValue(username,300)
    const router = useRouter()

    // zod implimentation 
    const form = useForm<z.Infer < typeof signUpSchema >>({
      resolver: zodResolver(signUpSchema),
      defaultValues:{
        username : "",
        email : "",
        password : ""
      }
    })
    useEffect(() => {
         const checkUsernameUnique = async () =>{
            if (debounceUsername) {
              setIsCheckingUsername(true)
              setUsernameMessage('')
              try {
                const response = await axios.get(`/api/check-username-unique?username=${debounceUsername}`)
                setUsernameMessage(response.data.message)
              } catch (error) {
                const axiosError = error as AxiosError<ApiResponse>
                setUsernameMessage(
                  axiosError.response?.data.message ?? "error checking username"
                )
              }finally
              setIsCheckingUsername(false)
            }
         }
      checkUsernameUnique()
    }, [debounceUsername])
    const onSubmit = async (data:z.infer <typeof signUpSchema>) => {
        try {
         const response = await axios.post<ApiResponse>("/api/sign-up", data)
         toast({
          title : 'Success',
          description : response.data.messages
         })
         router.replace(`/verify/${username}`)
        } catch (error) {
          
        }
    }

  return (
    <div>
      
    </div>
  )
}

export default page
