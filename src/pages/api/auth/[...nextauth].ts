import NextAuth, { type NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "../../../server/db/client"

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.user = user
      }

      return token
    },
    session: ({ session, token }) => {
      session.user = token.user
      return session
    },
  },
  secret: "workbd",
  jwt: {},
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: {
            username: credentials?.username,
          },
        })

        if (user && user.password_hash === credentials?.password) {
          return user
        }

        return null
      },
    }),
    // ...add more providers here
  ],
}

export default NextAuth(authOptions)
