import {NextAuthOptions}  from 'next-auth'

import CredentialsProvider  from 'next-auth/providers/credentials'

import bcrypt from 'bcryptjs'

import dbConnect from '@/lib/dbConnet'

import UserModel from '@/model/user.model'
import { email } from 'zod'
import { pages } from 'next/dist/build/templates/app-page'


export const authOptions:NextAuthOptions ={
    providers:[
        CredentialsProvider({
            id:"credentials",
            name:"credentials",
            credentials: {
                email: { label: "Email", type: "text"},
                password: { label: "Password", type: "password" }
              },
              async authorize(credentials:any):Promise<any>{
                await dbConnect()
                try {
                    const user = await UserModel.findOne({
                        $or:[
                            {
                                email:credentials.identifier
                            },
                            {
                                username:credentials.identifier
                            }
                        ]
                    })
                    if (!user) {
                        throw new Error('no user found with this email')
                    }
                    if (!user.isveryfied) {
                        throw new Error('user is not verified with this email')
                    }
                    const isPasswordCourrect = await bcrypt.compare(credentials.password,user.password)
                    if (isPasswordCourrect) {
                        return user
                    } else {
                        throw new Error('password is incorrect')
                    }
                } catch (error:any) {
                    throw new Error(error)
                }

              }
        })
        
    ],
    callbacks: {
        
        async session({ session, user, token }) {
          return session
        },
        async jwt({ token, user, account, profile, isNewUser }) {
          return token
        }
    },
    pages:{
        signIn:'sign-in'
    },
    session:{
        strategy:'jwt'
    },
    secret:process.env.NEXTAUTH_SECRET
}