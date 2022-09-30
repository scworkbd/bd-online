import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"

import { BiPackage, BiCalendarAlt, BiLogIn } from "react-icons/bi"
import { AiFillHome } from "react-icons/ai"
import { signOut, signIn } from "next-auth/react"

import Loading from "./Loading"
import { trpc } from "../utils/trpc"
import Image from "next/dist/client/image"

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
      router.push("/login?error=Account+banned+please+contact+support")
    }, 1000)
  }

  if (session?.user?.is_admin) {
    router.push("/admin")
  }

  return (
    <div className="max-w-lg mx-auto">
      <header className="h-14 px-5 fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-lg grid grid-cols-3 bg-zinc-800 z-20">
        <div></div>
        <div className="flex items-center justify-center">
          <Link href="/user/dashboard">
            <Image src="/logo.png" width={100} height={30} alt="logo" />
          </Link>
        </div>
        <div className="flex items-center justify-end">
          {adminData && (
            <button
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
              className="px-5 py-2 bg-black text-zinc-400 rounded-md text-xs"
            >
              Admin
            </button>
          )}
        </div>
      </header>
      <div className="pt-14 pb-36">
        <div>{children}</div>
      </div>

      <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg z-10">
        <div className="py-5 px-10 bg-zinc-800 flex items-center justify-between">
          <div className="flex items-center flex-col gap-1">
            <Link href="/user/dashboard">
              <div className="text-white text-xl">
                <AiFillHome />
              </div>
            </Link>
            <span className="text-sm">Home</span>
          </div>

          <div className="flex items-center flex-col gap-1">
            <Link href="/user/package">
              <div className="text-white text-xl">
                <BiPackage />
              </div>
            </Link>
            <span className="text-sm">Package</span>
          </div>

          <div className="flex items-center flex-col gap-1">
            <Link href="/user/ptc">
              <div className="text-white text-xl">
                <BiCalendarAlt />
              </div>
            </Link>
            <span className="text-sm">Work</span>
          </div>

          <div
            className="flex items-center flex-col gap-1"
            onClick={() => signOut()}
          >
            <div className="text-white text-xl">
              <BiLogIn />
            </div>
            <span className="text-sm">Logout</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default DashPage
