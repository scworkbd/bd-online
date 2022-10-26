import React from "react"
import Link from "next/link"
import { trpc } from "../utils/trpc"

import { useSession } from "next-auth/react"
import { TbCurrencyTaka } from "react-icons/tb"
import { BiChevronRight } from "react-icons/bi"

const Balance = () => {
  const { data: session } = useSession()
  const { data: user } = trpc.useQuery([
    "user.details",
    {
      username: session?.user?.username as string,
    },
  ])

  return (
    <div>
      <div className="py-10">
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-2xl font-bold text-center flex items-center justify-center gap-1">
            <TbCurrencyTaka className="text-2xl" />
            {user?.balance.toFixed(2)}
          </h1>

          <Link href="/user/history">
            <a className="rounded-full px-1 py-1 border-2 text-xs flex items-center gap-2 pl-3 mt-3">
              ইতিহাস{" "}
              <BiChevronRight className="text-xl bg-black/5 rounded-full" />
            </a>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Balance
