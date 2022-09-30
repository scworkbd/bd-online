import React from "react"
import type { NextPage } from "next"
import DashPage from "../../../components/DashPage"
import Image from "next/image"
import { useRouter } from "next/router"
const Deposit: NextPage = () => {
  const router = useRouter()

  return (
    <DashPage hideFooter>
      <div className="grid grid-cols-6 gap-5 mt-10 p-10">
        <div></div>
        <div
          onClick={() => router.push("/user/deposit/bkash")}
          className="text-center col-span-2"
        >
          <div className="rounded-md p-3 bg-zinc-800">
            <Image
              src="/icons/bkash.png"
              width={100}
              height={100}
              alt="bkash"
            />
          </div>

          <span className="mt-2 block">bKash</span>
        </div>

        <div
          onClick={() => router.push("/user/deposit/nagad")}
          className="text-center col-span-2"
        >
          <div className="rounded-md p-3 bg-zinc-800">
            <Image
              src="/icons/nagad.png"
              width={100}
              height={100}
              alt="bkash"
            />
          </div>

          <span className="mt-2 block">Nagad</span>
        </div>
        <div></div>
      </div>
    </DashPage>
  )
}

export default Deposit
