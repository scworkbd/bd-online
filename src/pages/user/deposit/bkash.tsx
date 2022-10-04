import React from "react"
import type { NextPage } from "next"
import DashPage from "../../../components/DashPage"
import DepositForm from "../../../components/DepositForm"
import CopyNumberForm from "../../../components/CopyNumberForm"

const Deposit: NextPage = () => {
  return (
    <DashPage hideFooter>
      <div className="p-5">
        <div className="mt-5shadow-md rounded-md p-5">
          <p className="text-center text-lg font-bold">
            নিচের নাম্বারটিতে সেন্ড মানি করে ডিপোজিট এর এমাউন্ট ও ট্রানজেকশন
            আইডি টি লিখুন
          </p>

          <CopyNumberForm method="bkash" />
          <DepositForm method="bkash" />
        </div>
      </div>
    </DashPage>
  )
}

export default Deposit
