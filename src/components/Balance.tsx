import React from "react"
import Link from "next/link"
import { BiPlus, BiUser } from "react-icons/bi"
import { trpc } from "../utils/trpc"

import { useSession } from "next-auth/react"
import { AiOutlineArrowUp } from "react-icons/ai"

const Balance = () => {
  const { data: session } = useSession()
  const { data: user } = trpc.useQuery([
    "user.details",
    {
      username: session?.user?.username as string,
    },
  ])

  return (
    <div className="px-5 bg-zinc-700 py-10">
      <div className="text-3xl font-bold flex items-center justify-between border-b-2 pb-5 border-b-zinc-500">
        <span>{user ? user.balance.toFixed(2) : "..."}</span>
        <span className="text-zinc-400">BDT</span>
      </div>

      <div className="max-w-xs mx-auto flex justify-between gap-2 pt-10">
        <div className="flex flex-col items-center gap-2">
          <Link href="/user/deposit">
            <a className="text-2xl w-10 h-10 grid place-items-center bg-green-600 rounded-full ">
              <BiPlus />
            </a>
          </Link>
          <span className="text-sm">Deposit</span>
        </div>

        <div className="flex flex-col items-center gap-2">
          <Link href="/user/withdraw">
            <a className="text-xl w-10 h-10 grid place-items-center bg-red-600 rounded-full ">
              <AiOutlineArrowUp />
            </a>
          </Link>
          <span className="text-sm">Withdraw</span>
        </div>

        <div className="flex flex-col items-center gap-2">
          <Link href="/user/profile">
            <a className="text-xl w-10 h-10 grid place-items-center bg-yellow-600 rounded-full ">
              <BiUser />
            </a>
          </Link>
          <span className="text-sm">Profile</span>
        </div>
      </div>
    </div>
  )
}

export default Balance
