import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"

import { signIn, signOut } from "next-auth/react"

import Loading from "./Loading"
import { trpc } from "../utils/trpc"
import { TbPackage } from "react-icons/tb"
import { BiChevronLeft, BiHomeSmile } from "react-icons/bi"
import { AiOutlineApi } from "react-icons/ai"

type Props = {
  children?: React.ReactNode | React.ReactNode[]
  hideFooter?: boolean
}

const DashPage = ({ children }: Props) => {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [adminData, setAdminData] = useState<{
    adminUsername: string
    adminPassword: string
  } | null>(null)

  const { data: profile, isLoading } = trpc.useQuery([
    "user.details",
    { username: session?.user?.username as string },
  ])

  useEffect(() => {
    const adata = localStorage.getItem("admin")
    const adminUsername = localStorage.getItem("adminUsername")
    const adminPassword = localStorage.getItem("adminPassword")

    if (adata && adminUsername && adminPassword) {
      setAdminData({ adminUsername, adminPassword })
    }
  }, [])

  if (status === "unauthenticated") {
    router.push("/login")
  }

  if (status === "loading" || isLoading) {
    return <Loading />
  }

  if (profile && profile.is_banned) {
    setTimeout(() => {
      router.push("/login?error=একাউন্ট ব্যান করা হয়েছে")
    }, 1000)
  }

  if (session?.user?.is_admin) {
    router.push("/admin")
  }

  return (
    <div className="max-w-lg mx-auto">
      {adminData && (
        <div
          onClick={() => {
            localStorage.removeItem("admin")
            localStorage.removeItem("adminUsername")
            localStorage.removeItem("adminPassword")

            signIn("credentials", {
              username: adminData.adminUsername,
              password: adminData.adminPassword,
              callbackUrl: "/admin/users",
            })
          }}
          className="px-5 py-3 bg-rose-900 flex items-center justify-center text-white"
        >
          <BiChevronLeft className="text-2xl" /> Admin
        </div>
      )}

      <div className="pt-103pb-32">
        <div>{children}</div>
      </div>

      <div className="px-10 pb-3 flex fixed bottom-3 left-0 w-full">
        <div className="rounded-full bg-rose-600 text-white flex items-center justify-evenly gap-2 w-full py-2">
          <Link href="/user/package">
            <a className="flex flex-col gap-1 items-center">
              <TbPackage className="text-xl" />
              <span className="text-[8px]">প্যাকেজ</span>
            </a>
          </Link>
          <Link href="/user/dashboard">
            <a className="flex flex-col gap-1 items-center">
              <BiHomeSmile className="text-xl" />
              <span className="text-[8px]">হোম</span>
            </a>
          </Link>
          <p
            onClick={() => signOut()}
            className="flex flex-col gap-1 items-center"
          >
            <AiOutlineApi className="text-xl" />
            <span className="text-[8px]">লগআউট</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default DashPage
