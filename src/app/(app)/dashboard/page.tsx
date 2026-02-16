'use client'

import { Message } from "@/model/user.model"
import { acceptMessageSchema } from "@/schemas/acceptMessage.schema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useCallback, useState,useEffect } from "react"
import { useForm } from "react-hook-form";

import { toast } from 'sonner';
function page() {

const [messages, setMessages] = useState<Message[]>([])
const [isLoading, setIsLoading] = useState(false)
const [switchLoading, setSwitchLoading] = useState(false) 

const handleDeleteMessage = (messageId : string) =>{
      setMessages(messages.filter((message)=> message._id !== messageId))
}
const {data : session} = useSession()
const form = useForm({
  resolver: zodResolver(acceptMessageSchema)
})
const {register,watch , setValue } = form
const acceptMessages = watch('acceptMessages')
const fetchAcceptMessage = useCallback(async () => {
  setIsLoading(true)
  try {
    const response = await axios.get<ApiResponse>('/api/accept-messages')
    setValue('acceptMessages', response.data.isAceptingMessage )
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse>
    toast.error('Error', {
      description: axiosError.response.data.message || "failed to ,messages setting",
      className: "border border-red-500 bg-red-50 text-red-800",
    });
  }finally{
    setSwitchLoading(false)
  }
},[setValue])


 const  fetchMessage = useCallback(async (refresh : boolean = false)=>{
  setIsLoading(true)
  setSwitchLoading(false)
  try {
    const response = await axios.get<ApiResponse>('/api/get-messages')
    setMessages(response.data.messages || [] )
   if(refresh){
    toast.success('refreshed messages', {
      description:'showing latest messages ',
      className: "border border-green-500 bg-green-50 text-green-800",
    });
   }
  }catch (error) {
    const axiosError = error as AxiosError<ApiResponse>
    toast.error('Error', {
      description: axiosError.response.data.message || "failed to ,messages setting",
      className: "border border-red-500 bg-red-50 text-red-800",
    });
  }finally{
    setIsLoading(false)
    setSwitchLoading(false)
  }
 },[setIsLoading,setMessages])
 useEffect(() => {
   
 if (!session || !session.user )return
 fetchAcceptMessage()
 fetchMessage()
 }, [session , setValue , fetchAcceptMessage , fetchMessage])
 // handle switch change
 const handleSwitchChange = async () => {
  try {
    const response = await axios.post<ApiResponse>('/api/accept-messages',{
      acceptMessages: !acceptMessages
    })
    set
  } catch (error) {
    
  }
 }
  return (
    <div>
      dashboard
    </div>
  )
}

export default page
