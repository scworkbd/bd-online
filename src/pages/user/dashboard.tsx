import React from "react"
import Link from "next/link"

import type { NextPage } from "next"

import { useDeposit } from "../../hooks/useDeposits"
import { useWithdraw } from "../../hooks/useWithdraw"
import { useAccount } from "../../hooks/useAccount"
import { useRouter } from "next/router"
import { useSettings } from "../../hooks/useSettings"

import Balance from "../../components/Balance"
import DashPage from "../../components/DashPage"

import { HiOutlineCash, HiCash, HiUserGroup, HiUser } from "react-icons/hi"
import { BiNetworkChart, BiBroadcast, BiBox, BiCommand } from "react-icons/bi"

import { trpc } from "../../utils/trpc"

const Dashboard: NextPage = () => {
  const { data: account } = useAccount()
  const { data: settings } = useSettings()
  const { data: deposits } = useDeposit()
  const { data: withdraws } = useWithdraw()
  const { data: works } = trpc.useQuery(["user.works"])
  const { data: pack } = trpc.useQuery([
    "admin.packageById",
    { packId: account?.current_pack as string },
  ])
  const router = useRouter()

  const pendingDeposit =
    deposits
      ?.filter((item) => item.pending === true)
      .reduce((prev, item) => prev + item.amount, 0) || 0

  const totalDeposit =
    deposits
      ?.filter((item) => !item.pending && item.approved)
      .reduce((prev, item) => prev + item.amount, 0) || 0

  const pendingWithdraw =
    withdraws
      ?.filter((item) => item.pending === true)
      .reduce((prev, item) => prev + item.amount, 0) || 0

  const totalWithdraw =
    withdraws
      ?.filter((item) => !item.pending && item.approved)
      .reduce((prev, item) => prev + item.amount, 0) || 0

  return (
    <DashPage>
      <Balance />
      <div className="p-5 mt-5">
        <div className="grid grid-cols-4 gap-4">
          <Link href="/user/deposit">
            <div className="aspect-square rounded-full bg-green-500/20 grid place-items-center">
              <div className=" flex flex-col items-center">
                <HiOutlineCash className="tp:text-3xl text-green-500" />
                <p className="text-xs hidden tp:block">Deposit</p>
              </div>
            </div>
          </Link>

          <Link href="/user/withdraw">
            <div className="aspect-square rounded-full bg-green-500/20 grid place-items-center">
              <div className=" flex flex-col items-center">
                <HiCash className="text-xl tp:text-3xl text-green-500" />
                <p className="text-xs hidden tp:block">Withdraw</p>
              </div>
            </div>
          </Link>

          <Link href="/user/referral">
            <div className="aspect-square rounded-full bg-green-500/20 grid place-items-center">
              <div className=" flex flex-col items-center">
                <HiUserGroup className="tp:text-3xl text-green-500" />
                <p className="text-xs hidden tp:block">Refer</p>
              </div>
            </div>
          </Link>

          <Link href="/user/profile">
            <div className="aspect-square rounded-full bg-green-500/20 grid place-items-center">
              <div className=" flex flex-col items-center">
                <HiUser className="tp:text-3xl text-green-500" />
                <p className="text-xs hidden tp:block">Profile</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      <div className="mt-5 p-5">
        <div className="grid grid-cols-2 gap-5">
          <div className="shadow-md p-5 isolate relative overflow-hidden border-2 border-green-600/20">
            <BiBox className="text-7xl text-green-500/30 absolute -bottom-3 -right-3 -rotate-45" />
            <h2 className="text-xl font-bold text-green-700 mb-3">প্যাকেজ</h2>
            <p className="font-bold text-green-500 text-sm">
              {pack ? pack.name : "প্যাকেজ কিনতে এখানে ক্লিক করুণ"}
            </p>
          </div>

          <div className="shadow-md p-5 isolate relative overflow-hidden border-2 border-green-600/20">
            <BiBroadcast className="text-7xl text-green-500/30 absolute -bottom-3 -right-3 -rotate-45" />
            <h2 className="text-xl font-bold text-green-700 mb-3">কাজ বাকি</h2>
            <p className="font-bold text-xl text-green-500">{works || 0}</p>
          </div>

          <div className="shadow-md p-5 isolate relative overflow-hidden border-2 border-green-600/20">
            <HiCash className="text-7xl text-green-500/30 absolute -bottom-3 -right-3 -rotate-45" />
            <h2 className="text-xl font-bold text-green-700 mb-3">ক্যাশ আউট</h2>
            <p className="font-bold text-xl text-green-500">{totalWithdraw}</p>
          </div>

          <div className="shadow-md p-5 isolate relative overflow-hidden border-2 border-green-600/20">
            <HiOutlineCash className="text-7xl text-green-500/30 absolute -bottom-3 -right-3 -rotate-45" />
            <h2 className="text-xl font-bold text-green-700 mb-3">ডিপোজিট</h2>
            <p className="font-bold text-xl text-green-500">{totalWithdraw}</p>
          </div>
        </div>
      </div>
    </DashPage>
  )
}

export default Dashboard
