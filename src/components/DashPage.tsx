import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"

import {
  BiPackage,
  BiCalendarAlt,
  BiMenuAltLeft,
  BiGridAlt,
  BiX,
} from "react-icons/bi"
import { signIn } from "next-auth/react"

import Loading from "./Loading"
import { trpc } from "../utils/trpc"
import Image from "next/dist/client/image"
import IconLink from "./IconLink"
import { BsFillClockFill } from "react-icons/bs"

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
  const [open, setOpen] = useState(false)

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
        <BiMenuAltLeft className="text-xl" onClick={() => setOpen(!open)} />
        <div className="flex items-center justify-center">
          <Link href="/user/dashboard">
            <Image src="/logo.png" width={100} height={30} alt="logo" />
          </Link>
        </div>

        <div className="flex items-center justify-end ml-auto">
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
              className="px-5 py-2 bg-black text-zinc-200 rounded-md text-xs"
            >
              Admin
            </button>
          )}
        </div>
      </header>

      <aside
        className={`w-full mx-auto h-screen fixed top-0 left-0  z-50 isolate transition-all ${
          open
            ? "bg-black/10 pointer-events-auto"
            : "bg-transparent pointer-events-none"
        }`}
      >
        <div
          className={`w-full max-w-[250px] bg-black h-screen flex flex-col z-10 absolute top-0  transition-all ${
            open ? "left-0" : "-left-[100%]"
          }`}
        >
          <IconLink text="হোমপেজ" href="/user/dashboard" icon={BiGridAlt} />
          <IconLink text="প্যাকেজ সমুহ" href="/user/package" icon={BiPackage} />
          <IconLink
            text="ক্যাশ আউট ইতিহাস"
            href="/user/withdraw/history"
            icon={BsFillClockFill}
          />
          <IconLink
            text="ডিপোজিট ইতিহাস"
            href="/user/deposit/history"
            icon={BiCalendarAlt}
          />

          <IconLink
            text="রেফারেল ইতিহাস"
            href="/user/referral/history"
            icon={BiCalendarAlt}
          />
        </div>

        {open && (
          <BiX
            className="bg-red-500 text-white absolute top-2 right-2 text-3xl transition-all"
            onClick={() => setOpen(!open)}
          />
        )}
      </aside>

      <div className="pt-14">
        <div>{children}</div>
      </div>
    </div>
  )
}

export default DashPage
