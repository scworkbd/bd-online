import React from "react"
import Link from "next/link"

import type { NextPage } from "next"

import { useDeposit } from "../../hooks/useDeposits"
import { useWithdraw } from "../../hooks/useWithdraw"
import { useAccount } from "../../hooks/useAccount"
import { useRouter } from "next/router"

import Balance from "../../components/Balance"
import DashPage from "../../components/DashPage"

import { BiTransfer, BiPlus, BiUserPlus, BiUser } from "react-icons/bi"
import { BsWhatsapp } from "react-icons/bs"
import { FaTelegramPlane } from "react-icons/fa"

import { trpc } from "../../utils/trpc"
import CustomToast from "../../components/CustomToast"

import toast from "react-hot-toast"
import { useSettings } from "../../hooks/useSettings"

const Dashboard: NextPage = () => {
  const { data: account } = useAccount()
  const { data: deposits } = useDeposit()
  const { data: withdraws } = useWithdraw()
  const { data: settings } = useSettings()
  const { data: works } = trpc.useQuery(["user.works"])
  const { data: pack } = trpc.useQuery([
    "admin.packageById",
    { packId: `${account?.current_pack}` },
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
      <div className="fixed bottom-20 right-5 flex flex-col gap-2 z-50">
        <div className="p-3 bg-rose-900 text-white rounded-full">
          <a href={`https://wa.me/${settings?.whatsapp_number}`}>
            <BsWhatsapp className="text-lg" />
          </a>
        </div>

        <div className="p-3 bg-rose-900 text-white rounded-full">
          <a href={settings?.telegram_link as string}>
            <FaTelegramPlane className="text-lg" />
          </a>
        </div>
      </div>
      <Balance />
      <div className="grid grid-cols-3 gap-3 p-5">
        <div className="flex flex-col gap-2 items-center justify-center">
          <Link href="/user/deposit">
            <a className="bg-rose-500 p-3 rounded-full">
              <BiPlus className="text-4xl text-white" />
            </a>
          </Link>
          <span className="text-[10px]">ডিপোজিট</span>
        </div>

        <div className="flex flex-col gap-2 items-center justify-center">
          <Link href="/user/withdraw">
            <a className="bg-rose-500 p-3 rounded-full">
              <BiTransfer className="text-4xl text-white" />
            </a>
          </Link>
          <span className="text-[10px]">ক্যাশআউট</span>
        </div>

        <div className="flex flex-col gap-2 items-center justify-center">
          <Link href="/user/referral">
            <a className="bg-rose-500 p-3 rounded-full">
              <BiUserPlus className="text-4xl text-white" />
            </a>
          </Link>
          <span className="text-[10px]">রেফার</span>
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
            className="p-5 bg-gradient-to-r from-rose-700 to-rose-400 rounded-md text-white relative"
            onClick={() => {
              if (!account || works === undefined) return
              if (!account.current_pack) {
                return toast.custom(
                  <CustomToast message="প্যাকেজ কিনে কাজ শুরু করুণ।" />
                )
              }

              if (works <= 0) {
                return toast.custom(
                  <CustomToast message="আপনার আজকের এড দেখার লিমিট শেষ।" />
                )
              }
            }}
          >
            <h2 className="font-bold text-xl mb-3">কাজ বাকি</h2>
            <p className="font-bold text-xs">
              {pack
                ? `${works || 0}/${pack.daily_limit}`
                : "প্যাকেজ কিনে কাজ শুরু করুণ"}
            </p>

            {pack && works ? (
              <Link href="/user/ptc">
                <a className="text-xs px-5 py-3 bg-white text-black block w-max absolute top-4 right-5">
                  ক্লিক করুণ
                </a>
              </Link>
            ) : null}
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
            <h2 className="font-bold text-xl mb-3">সেটিংস</h2>
            <Link href="/user/profile">
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
