import React from "react"
import type { NextPage } from "next"
import DashPage from "../../../components/DashPage"
import Image from "next/image"
import { useRouter } from "next/router"
const Deposit: NextPage = () => {
  const router = useRouter()

  return (
    <DashPage hideFooter>
      <h1 className="text-2xl font-bold text-center mt-10 mb-5 font-anek">
        ডিপোজিট
      </h1>
      <div className="grid grid-cols-1 gap-5 mt-10 p-5">
        <div
          onClick={() => router.push("/user/deposit/bkash")}
          className="flex items-center justify-center bg-zinc-300 p-5 gap-5 rounded-lg"
        >
          <div className="rounded-md">
            <Image
              src="/icons/bkash.png"
              width={100}
              height={100}
              alt="bkash"
            />
          </div>

          <p className="text-2xl font-bold uppercase">বিকাশ</p>
        </div>

        <div
          onClick={() => router.push("/user/deposit/nagad")}
          className="flex items-center justify-center bg-zinc-300 p-5 gap-5 rounded-lg"
        >
          <div className="rounded-md">
            <Image
              src="/icons/nagad.png"
              width={100}
              height={100}
              alt="bkash"
            />
          </div>

          <p className="text-2xl font-bold uppercase">নগদ</p>
        </div>
      </div>
    </DashPage>
  )
}

export default Deposit
