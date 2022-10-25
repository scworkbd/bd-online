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
          <Link href="/user/withdraw">
            <a className="bg-rose-500 p-2 rounded-full">
              <BiTransfer className="text-3xl text-white" />
            </a>
          </Link>
          <span className="text-[10px]">ক্যাশআউট</span>
        </div>

        <div className="flex flex-col gap-2 items-center justify-center">
          <Link href="/user/referral">
            <a className="bg-rose-500 p-2 rounded-full">
              <BiUserPlus className="text-3xl text-white" />
            </a>
          </Link>
          <span className="text-[10px]">রেফার</span>
        </div>

        <div className="flex flex-col gap-2 items-center justify-center">
          <Link href="/user/profile">
            <a className="bg-rose-500 p-2 rounded-full">
              <BiUser className="text-3xl text-white" />
            </a>
          </Link>
          <span className="text-[10px]">প্রোফাইল</span>
        </div>
      </div>

      <div className="mt-5 p-5">
        <div className="grid grid-cols-1 gap-5">
          <div className="p-5 bg-gradient-to-r from-rose-700 to-rose-400 rounded-md text-white">
            <h2 className="font-bold mb-3 text-xl">বর্তমান প্যাকেজ</h2>
            <p className="text-sm">
              {pack ? (
                pack.name
              ) : (
                <>
                  <span className="text-xs mt-3 mb-2 block font-bold">
                    কোন প্যাকেজ একটিভ নেই
                  </span>
                  <Link href="/user/package">
                    <a className="text-xs px-5 py-3 bg-white text-black rounded-full block w-max">
                      প্যাকেজ কিনুন
                    </a>
                  </Link>
                </>
              )}
            </p>
          </div>

          <div
            className="p-5 bg-gradient-to-r from-rose-700 to-rose-400 rounded-md text-white"
            onClick={() => router.push("/user/ptc")}
          >
            <h2 className="font-bold text-xl mb-3">কাজ বাকি</h2>
            <p className="font-bold text-xs">
              {pack
                ? `${works || 0}/${pack.daily_limit}`
                : "প্যাকেজ কিনে কাজ শুরু করুণ"}
            </p>
          </div>

          <div
            onClick={() => router.push("/user/withdraw/history")}
            className="p-5 bg-gradient-to-r from-rose-700 to-rose-400 rounded-md text-white"
          >
            <h2 className="font-bold text-xl">ক্যাশ আউট ইতিহাস</h2>
            <p className="font-bold text-lg mt-3">{totalWithdraw}</p>
          </div>

          <div
            onClick={() => router.push("/user/deposit/history")}
            className="p-5 bg-gradient-to-r from-rose-700 to-rose-400 rounded-md text-white"
          >
            <h2 className="font-bold text-xl">ডিপোজিট ইতিহাস</h2>
            <p className="font-bold text-lg mt-3">{totalDeposit}</p>
          </div>

          <div className="p-5 bg-gradient-to-r from-rose-700 to-rose-400 rounded-md text-white">
            <h2 className="font-bold text-xl mb-3">রেরাফেল ইনকাম</h2>
            <Link href="/user/referral/history">
              <a className="text-xs px-5 py-3 bg-white text-black rounded-full block w-max">
                এখানে ক্লিক করুন
              </a>
            </Link>
          </div>

          <div className="p-5 bg-gradient-to-r from-rose-700 to-rose-400 rounded-md text-white">
            <h2 className="font-bold text-xl mb-3">পাসওয়ার্ড পরিবর্তন</h2>
            <Link href="/user/chpwd">
              <a className="text-xs px-5 py-3 bg-white text-black rounded-full block w-max">
                এখানে ক্লিক করুন
              </a>
            </Link>
          </div>
        </div>
      </div>
    </DashPage>
  )
}

export default Dashboard
