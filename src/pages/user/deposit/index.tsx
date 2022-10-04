import React from "react"
import type { NextPage } from "next"
import DashPage from "../../../components/DashPage"
import Image from "next/image"
import { useRouter } from "next/router"
const Deposit: NextPage = () => {
  const router = useRouter()

  return (
    <DashPage hideFooter>
      <div className="grid grid-cols-2 gap-5 mt-10 p-5">
        <div
          onClick={() => router.push("/user/deposit/bkash")}
          className="text-center"
        >
          <div className="rounded-md p-3">
            <Image
              src="/icons/bkash.png"
              width={100}
              height={100}
              alt="bkash"
            />
          </div>
        </div>

        <div
          onClick={() => router.push("/user/deposit/nagad")}
          className="text-center"
        >
          <div className="rounded-md p-3">
            <Image
              src="/icons/nagad.png"
              width={100}
              height={100}
              alt="bkash"
            />
          </div>
        </div>
      </div>
    </DashPage>
  )
}

export default Deposit
