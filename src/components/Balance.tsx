import React from "react"
import { trpc } from "../utils/trpc"

import { useSession } from "next-auth/react"
import Image from "next/image"

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
      <div className="p-3 bg-green-500 shadow-md flex gap-4 items-center">
        <div className="w-14 h-14">
          <Image
            src={`https://avatars.dicebear.com/api/pixel-art/${user?.username}.svg`}
            width={50}
            height={50}
            layout="responsive"
            alt="ok"
          />
        </div>
        <div className="flex flex-col">
          <p className="text-2xl font-bold">{user?.username}</p>
          <p>{user?.phone}</p>
        </div>
        <div className="ml-auto">
          <span className="px-5 py-2 bg-green-800 text-white rounded-full">
            {user ? user.balance.toFixed(2) : "..."}
          </span>
        </div>
      </div>
    </div>
  )
}

export default Balance
