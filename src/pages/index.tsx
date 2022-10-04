import { useRouter } from "next/router"
import type { NextPage } from "next"

import { useSession } from "next-auth/react"
import Loading from "../components/Loading"
import { signOut } from "next-auth/react"

const Home: NextPage = () => {
  const router = useRouter()
  const { data, status } = useSession()

  if (status === "authenticated") {
    if (data.user?.is_banned) {
      signOut()
    } else {
      router.push("/user/dashboard")
    }
  }

  if (status === "unauthenticated") {
    router.push("/login")
  }

  return <Loading />
}

export default Home
