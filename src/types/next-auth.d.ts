import { DefaultSession } from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user?: {
      id: string
      username: string
      first_name: string
      last_name: string
      pasword_hash: string
      email: string
      phone: string
      balance: number
      is_admin: boolean
      is_banned: boolean
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    username: string
    first_name: string
    last_name: string
    pasword_hash: string
    email: string
    phone: string
    balance: number
    is_admin: boolean
    is_banned: boolean
  }
}

declare module "next-auth/jwt" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface JWT {
    user?: {
      id: string
      username: string
      first_name: string
      last_name: string
      pasword_hash: string
      email: string
      phone: string
      balance: number
      is_admin: boolean
      is_banned: boolean
    }
  }
}
