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
import { BiBroadcast, BiBox } from "react-icons/bi"
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
      <div className="p-5 mt-5">
        <div className="grid grid-cols-3 gap-4">
          <Link href="/user/deposit">
            <div className="flex flex-col items-center gap-2">
              <div className="bg-green-500/20 grid place-items-center aspect-square rounded-full p-4 tp:p-5">
                <HiOutlineCash className="tp:text-3xl text-green-500" />
              </div>
              <p className="text-xs">ডিপোজিট</p>
            </div>
          </Link>

          <Link href="/user/withdraw">
            <div className="flex flex-col items-center gap-2">
              <div className="bg-green-500/20 grid place-items-center aspect-square rounded-full p-4 tp:p-5">
                <HiCash className="text-xl tp:text-3xl text-green-500" />
              </div>
              <p className="text-xs text-center">ক্যাশ আউট</p>
            </div>
          </Link>

          <Link href="/user/referral">
            <div className="flex flex-col items-center gap-2">
              <div className="bg-green-500/20 grid place-items-center aspect-square rounded-full p-4 tp:p-5">
                <HiUserGroup className="tp:text-3xl text-green-500" />
              </div>
              <p className="text-xs">রেফার</p>
            </div>
          </Link>

          <Link href="/user/profile">
            <div className="flex flex-col items-center gap-2">
              <div className="bg-green-500/20 grid place-items-center aspect-square rounded-full p-4 tp:p-5">
                <HiUser className="tp:text-3xl text-green-500" />
              </div>
              <p className="text-xs">প্রোফাইল</p>
            </div>
          </Link>

          <Link href={`https://wa.me/${settings?.whatsapp_number}`}>
            <div className="flex flex-col items-center gap-2">
              <div className="bg-green-500/20 grid place-items-center aspect-square rounded-full p-4 tp:p-5">
                <AiOutlineWhatsApp className="tp:text-3xl text-green-500" />
              </div>
              <p className="text-xs">হোয়াটসঅ্যাপ</p>
            </div>
          </Link>

          <a href={settings?.telegram_link}>
            <div className="flex flex-col items-center gap-2">
              <div className="bg-green-500/20 grid place-items-center aspect-square rounded-full p-4 tp:p-5">
                <FaTelegramPlane className="tp:text-3xl text-green-500" />
              </div>
              <p className="text-xs">টেলিগ্রাম</p>
            </div>
          </a>
        </div>
      </div>

      <div className="mt-5 p-5">
        <div className="grid grid-cols-2 gap-5">
          <div className="shadow-md p-5 isolate relative overflow-hidden border-2 border-green-600/20">
            <BiBox className="text-7xl text-green-500/20 absolute -bottom-3 -right-3 -rotate-45" />
            <h2 className="text-xl font-bold text-green-700 mb-3">প্যাকেজ</h2>
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
            <h2 className="text-xl font-bold text-green-700 mb-3">কাজ বাকি</h2>
            <p className="font-bold text-xl text-green-500">
              {works ? `${works}/${pack ? pack.daily_limit : 0}` : 0}
            </p>
          </div>

          <div className="shadow-md p-5 isolate relative overflow-hidden border-2 border-green-600/20">
            <HiCash className="text-7xl text-green-500/20 absolute -bottom-3 -right-3 -rotate-45" />
            <h2 className="text-xl font-bold text-green-700 mb-3">ক্যাশ আউট</h2>
            <p className="font-bold text-xl text-green-500">{totalWithdraw}</p>
          </div>

          <div className="shadow-md p-5 isolate relative overflow-hidden border-2 border-green-600/20">
            <HiOutlineCash className="text-7xl text-green-500/20 absolute -bottom-3 -right-3 -rotate-45" />
            <h2 className="text-xl font-bold text-green-700 mb-3">ডিপোজিট</h2>
            <p className="font-bold text-xl text-green-500">{totalDeposit}</p>
          </div>
        </div>
      </div>
    </DashPage>
  )
}

export default Dashboard
