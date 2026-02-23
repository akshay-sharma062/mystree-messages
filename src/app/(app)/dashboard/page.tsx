'use client'

import MessageCard from "@/components/MessgaeCard";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Message } from "@/model/user.model"
import { acceptMessageSchema } from "@/schemas/acceptMessage.schema";

import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@react-email/components";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useCallback, useState,useEffect } from "react"
import { useForm } from "react-hook-form";

import { toast } from 'sonner';
function UserDashboard() {

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
    setValue('acceptMessages', response.data.isAceptingMessages as boolean )
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse>
    toast.error('Error', {
      description: axiosError.response?.data.message || "failed to ,messages setting",
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
      description: axiosError.response?.data.message || "failed to ,messages setting",
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
    setValue('acceptMessages' , !acceptMessages)
    toast.success(response.data.message, {
      className: "border border-green-500 bg-green-50 text-green-800",
    });
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse>
    toast.error('Error', {
      description: axiosError.response?.data.message || "failed to ,messages setting",
      className: "border border-red-500 bg-red-50 text-red-800",
    });
  }
 }
 if (!session || !session.user) {
  return <div>
    <h1 className="flex items-center justify-center uppercase">session Endded or user not found please login again</h1>
  </div>
 }
 const {username} = session?.user as User
 //TODO: do more research
 const baseUrl = `${window.location.protocol}// ${window.location.host}`
 const profileUrl = `${baseUrl}/u/${username}`
 const copyToClipboard = ()=>{
  navigator.clipboard.writeText(profileUrl)
  toast.success('URL Copied', {
    className: "border border-green-500 bg-green-50 text-green-800",
  });
 }
 return (
  <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
    <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

    <div className="mb-4">
      <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
      <div className="flex items-center">
        <input
          type="text"
          value={profileUrl}
          disabled
          className="input input-bordered w-full p-2 mr-2"
        />
        <Button onClick={copyToClipboard}>Copy</Button>
      </div>
    </div>

    <div className="mb-4">
      <Switch
        {...register('acceptMessages')}
        checked={acceptMessages}
        onCheckedChange={handleSwitchChange}
        disabled={switchLoading}
      />
      <span className="ml-2">
        Accept Messages: {acceptMessages ? 'On' : 'Off'}
      </span>
    </div>
    <Separator />

    <Button
      className="mt-4"
      
      onClick={(e) => {
        e.preventDefault();
        fetchMessage(true);
      }}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <RefreshCcw className="h-4 w-4" />
      )}
    </Button>
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
      {messages.length > 0 ? (
        messages.map((message, index) => (
          <MessageCard
             key={String(message._id)}
             message={message}
             username={username}
             onMessageDelete={handleDeleteMessage}
            />
        ))
      ) : (
        <p>No messages to display.</p>
      )}
    </div>
  </div>
);
}

export default UserDashboard;

