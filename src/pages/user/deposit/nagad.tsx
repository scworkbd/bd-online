import React from "react"
import type { NextPage } from "next"
import DashPage from "../../../components/DashPage"
import Image from "next/image"
import DepositForm from "../../../components/DepositForm"
import CopyNumberForm from "../../../components/CopyNumberForm"

const Deposit: NextPage = () => {
  return (
    <DashPage hideFooter>
      <div className="p-5">
        <div className="mt-5 bg-zinc-800 shadow-md rounded-md p-5">
          <div className="flex items-center justify-center mb-5">
            <Image src="/icons/bkash.png" width={50} height={50} alt="bkash" />
          </div>

          <div className="px-5">
            <ol className="list-decimal">
              <li>Dial *167#</li>

              <li>Send Money</li>
              <li>
                Send money to this number <CopyNumberForm method="bkash" />
              </li>

              <li>Enter amount to deposit</li>
              <li>Enter Transaction ID</li>
            </ol>

            <DepositForm method="nagad" />
          </div>
        </div>
      </div>
    </DashPage>
  )
}

export default Deposit
