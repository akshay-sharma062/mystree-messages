"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useForm } from "react-hook-form"
import * as z from "zod"
import axios from 'axios'
import { useState } from "react"
import { useFormState } from "react-dom"
import { useDebounceValue } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from "next/navigation"
function page() {
    const [Username, setUsername] = useState("")
    const [usernameMessage, setUsernameMessage] = useState("")
    const [isCheckingUsername, setIsCheckingUsername] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const debounceUsername = useDebounceValue(Username,300)
    const router = useRouter()

    // zod implimentation 

  return (
    <div>
      
    </div>
  )
}

export default page
