import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { authConfig } from "./auth.config"
import { z } from "zod"
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma"

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().min(1), password: z.string().min(6) })
          .safeParse(credentials)

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data
          // Allow login by email or by checking if the username matches the name or email field
          const user = await prisma.user.findFirst({ 
            where: { 
              OR: [
                { email: email },
                { name: email }
              ]
            } 
          })
          if (!user) return null

          const passwordsMatch = await bcrypt.compare(password, user.passwordHash)

          if (passwordsMatch) {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
            }
          }
        }
        return null
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
})
