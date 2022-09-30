import { useRouter } from "next/router"
import type { NextPage } from "next"

import { useSession } from "next-auth/react"
import Loading from "../components/Loading"

const Home: NextPage = () => {
  const router = useRouter()
  const { status } = useSession()

  if (status === "authenticated") {
    router.push("/user/dashboard")
  }

  if (status === "unauthenticated") {
    router.push("/login")
  }

  return <Loading />
}

export default Home
