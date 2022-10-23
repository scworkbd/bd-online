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
import {
  BiBroadcast,
  BiBox,
  BiKey,
  BiTransfer,
  BiPlus,
  BiUserPlus,
  BiUser,
} from "react-icons/bi"
import { AiOutlineWhatsApp } from "react-icons/ai"
import { FaTelegramPlane } from "react-icons/fa"

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

  // const pendingDeposit =
  //   deposits
  //     ?.filter((item) => item.pending === true)
  //     .reduce((prev, item) => prev + item.amount, 0) || 0

  const totalDeposit =
    deposits
      ?.filter((item) => !item.pending && item.approved)
      .reduce((prev, item) => prev + item.amount, 0) || 0

  // const pendingWithdraw =
  //   withdraws
  //     ?.filter((item) => item.pending === true)
  //     .reduce((prev, item) => prev + item.amount, 0) || 0

  const totalWithdraw =
    withdraws
      ?.filter((item) => !item.pending && item.approved)
      .reduce((prev, item) => prev + item.amount, 0) || 0

  return (
    <DashPage>
      <Balance />
      <div className="grid grid-cols-4 gap-3 p-5">
        <div className="flex flex-col gap-2 items-center justify-center">
          <Link href="/user/deposit">
            <a className="bg-rose-500 p-2 rounded-full">
              <BiPlus className="text-3xl text-white" />
            </a>
          </Link>
          <span className="text-[10px]">ডিপোজিট</span>
        </div>

        <div className="flex flex-col gap-2 items-center justify-center">
          <Link href="/user/deposit">
            <a className="bg-rose-500 p-2 rounded-full">
              <BiTransfer className="text-3xl text-white" />
            </a>
          </Link>
          <span className="text-[10px]">ক্যাশআউট</span>
        </div>

        <div className="flex flex-col gap-2 items-center justify-center">
          <Link href="/user/deposit">
            <a className="bg-rose-500 p-2 rounded-full">
              <BiUserPlus className="text-3xl text-white" />
            </a>
          </Link>
          <span className="text-[10px]">রেফার</span>
        </div>

        <div className="flex flex-col gap-2 items-center justify-center">
          <Link href="/user/deposit">
            <a className="bg-rose-500 p-2 rounded-full">
              <BiUser className="text-3xl text-white" />
            </a>
          </Link>
          <span className="text-[10px]">প্রোফাইল</span>
        </div>
      </div>

      <div className="mt-5 p-5">
        <div className="grid grid-cols-2 gap-5">
          <div className="shadow-md p-5 isolate relative overflow-hidden border-2 border-green-600/20">
            <BiBox className="text-7xl text-green-500/20 absolute -bottom-3 -right-3 -rotate-45" />
            <h2 className="font-bold text-green-700 mb-3">প্যাকেজ</h2>
            <p className="font-bold text-green-500 text-sm">
              {pack ? (
                pack.name
              ) : (
                <span onClick={() => router.push("/user/package")}>
                  প্যাকেজ কিনতে এখানে ক্লিক করুণ
                </span>
              )}
            </p>
          </div>

          <div
            className="shadow-md p-5 isolate relative overflow-hidden border-2 border-green-600/20"
            onClick={() => router.push("/user/ptc")}
          >
            <BiBroadcast className="text-7xl text-green-500/20 absolute -bottom-3 -right-3 -rotate-45" />
            <h2 className="font-bold text-green-700 mb-3">কাজ বাকি</h2>
            <p className="font-bold text-green-500">
              {pack
                ? `${works || 0}/${pack.daily_limit}`
                : "একাউন্ট এক্টিভ নেই"}
            </p>
          </div>

          <div
            onClick={() => router.push("/user/withdraw/history")}
            className="shadow-md p-5 isolate relative overflow-hidden border-2 border-green-600/20"
          >
            <HiCash className="text-7xl text-green-500/20 absolute -bottom-3 -right-3 -rotate-45" />
            <h2 className="font-bold text-green-700 mb-3">ক্যাশ আউট ইতিহাস</h2>
            <p className="font-bold text-xl text-green-500">{totalWithdraw}</p>
          </div>

          <div
            onClick={() => router.push("/user/deposit/history")}
            className="shadow-md p-5 isolate relative overflow-hidden border-2 border-green-600/20"
          >
            <HiOutlineCash className="text-7xl text-green-500/20 absolute -bottom-3 -right-3 -rotate-45" />
            <h2 className="font-bold text-green-700 mb-3">ডিপোজিট ইতিহাস</h2>
            <p className="font-bold text-xl text-green-500">{totalDeposit}</p>
          </div>

          <div
            className="shadow-md p-5 isolate relative overflow-hidden border-2 border-green-600/20"
            onClick={() => router.push("/user/referral/history")}
          >
            <HiUserGroup className="text-7xl text-green-500/20 absolute -bottom-3 -right-3 -rotate-45" />
            <h2 className="font-bold text-green-700 mb-3">রেরাফেল ইতিহাস</h2>
            <p className="font-bold text-sm text-green-500">এখানে ক্লিক করুণ</p>
          </div>

          <div
            className="shadow-md p-5 isolate relative overflow-hidden border-2 border-green-600/20"
            onClick={() => router.push("/user/chpwd")}
          >
            <BiKey className="text-7xl text-green-500/20 absolute -bottom-3 -right-3 -rotate-45" />
            <h2 className="font-bold text-green-700 mb-3">
              পাসওয়ার্ড পরিবর্তন
            </h2>
            <p className="font-bold text-sm text-green-500">এখানে ক্লিক করুণ</p>
          </div>
        </div>
      </div>
    </DashPage>
  )
}

export default Dashboard
