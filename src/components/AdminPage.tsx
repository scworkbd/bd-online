import React from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"

import Loading from "./Loading"
import Header from "./Amin/Header"

type Props = {
  children?: React.ReactNode | React.ReactNode[]
}

const AdminPage = ({ children }: Props) => {
  const router = useRouter()
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <Loading />
  }

  if (status === "unauthenticated") {
    router.push("/login")
  }

  if (!session?.user?.is_admin) {
    router.push("/user/dashboard")
  }

  return (
    <div>
      <Header />
      <div className="container mx-auto">
        <div className="p-5 w-full overflow-x-auto">{children}</div>
      </div>
    </div>
  )
}

export default AdminPage
