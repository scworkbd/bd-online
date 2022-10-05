import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"

import { BiDownload } from "react-icons/bi"
import { signIn, signOut } from "next-auth/react"

import Loading from "./Loading"
import { trpc } from "../utils/trpc"
import Image from "next/dist/client/image"
import { GoHome, GoPackage, GoSignOut } from "react-icons/go"

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
      <header className="h-14 px-5 fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-lg flex items-center gap-5 z-20 bg-white shadow-md">
        <div className="flex items-center justify-center">
          <Link href="/user/dashboard">
            <Image src="/logo.png" width={100} height={30} alt="logo" />
          </Link>
        </div>

        <div className="flex items-center justify-end ml-auto">
          {adminData ? (
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
              className="px-5 py-2 bg-black text-zinc-200 rounded-md text-xs"
            >
              Admin
            </button>
          ) : (
            <a
              className="bg-green-500 px-4 py-2 rounded-full text-white flex items-center gap-2"
              href="/app.apk"
            >
              <BiDownload className="text-lg" />
              Download App
            </a>
          )}
        </div>
      </header>

      <div className="pt-14 pb-32">
        <div>{children}</div>
      </div>

      <div className="px-10 py-5 flex items-center justify-evenly fixed bottom-0 left-0 w-full bg-white shadow-md border-t-2 border-emerald-600">
        <Link href="/user/package">
          <a className="flex flex-col gap-2 items-center">
            <GoPackage className="text-2xl" />
            <span className="text-xs">প্যাকেজ</span>
          </a>
        </Link>

        <Link href="/user/dashboard">
          <a className="flex flex-col gap-2 items-center">
            <GoHome className="text-2xl" />
            <span className="text-xs">হোম</span>
          </a>
        </Link>

        <p
          onClick={() => signOut()}
          className="flex flex-col gap-2 items-center"
        >
          <GoSignOut className="text-2xl" />
          <span className="text-xs">লগ আউট</span>
        </p>
      </div>
    </div>
  )
}

export default DashPage
