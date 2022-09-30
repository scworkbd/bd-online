import React from "react"
import type { NextPage } from "next"
import DashPage from "../../components/DashPage"
import Balance from "../../components/Balance"
import { useDeposit } from "../../hooks/useDeposits"
import { BsFillClockFill, BsTelegram, BsWhatsapp } from "react-icons/bs"
import { useWithdraw } from "../../hooks/useWithdraw"
import { useAccount } from "../../hooks/useAccount"
import moment from "moment"
import { useRouter } from "next/router"
import { trpc } from "../../utils/trpc"
import Link from "next/link"
import { BiKey, BiUser } from "react-icons/bi"
import { SiGoogleplay } from "react-icons/si"
import { useSettings } from "../../hooks/useSettings"

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
        <h1 className="text-2xl font-bold mb-5">Other Links</h1>
        <div className="grid grid-cols-5 gap-3 text-center">
          <Link href="/user/chpwd">
            <a className="flex flex-col gap-2 items-center ">
              <div className="w-12 h-12 bg-zinc-700 grid place-items-center rounded-full">
                <BiKey className="text-2xl" />
              </div>
              <span className="text-xs">Change Password</span>
            </a>
          </Link>

          <Link href="/user/referral">
            <a className="flex flex-col gap-2 items-center ">
              <div className="w-12 h-12 bg-zinc-700 grid place-items-center rounded-full">
                <BiUser className="text-2xl" />
              </div>
              <span className="text-xs">Referral</span>
            </a>
          </Link>

          <a
            href={`https://wa.me/${settings?.whatsapp_number}`}
            className="flex flex-col gap-2 items-center "
          >
            <div className="w-12 h-12 bg-zinc-700 grid place-items-center rounded-full">
              <BsWhatsapp className="text-2xl" />
            </div>
            <span className="text-xs">Whatsapp</span>
          </a>

          <a
            href={`${settings?.telegram_link}`}
            className="flex flex-col gap-2 items-center "
          >
            <div className="w-12 h-12 bg-zinc-700 grid place-items-center rounded-full">
              <BsTelegram className="text-2xl" />
            </div>
            <span className="text-xs">Telegram Group</span>
          </a>

          {settings?.app_download_link && (
            <a
              href="/DreamProject.apk"
              className="flex flex-col gap-2 items-center "
            >
              <div className="w-12 h-12 bg-zinc-700 grid place-items-center rounded-full">
                <SiGoogleplay className="text-2xl" />
              </div>
              <span className="text-xs">Download App</span>
            </a>
          )}
        </div>
      </div>

      <section className="mt-5 p-5">
        <div className="grid grid-cols-2 gap-5">
          <div className="p-5 bg-black rounded-md shadow-md flex flex-col gap-1">
            <span>Total Work</span>
            <span className="text-xl font-bold">
              {pack ? pack.daily_limit * pack.validity : 0}
            </span>
          </div>

          <div
            className="p-5 bg-green-600 rounded-md shadow-md flex flex-col gap-1"
            onClick={() => router.push("/user/withdraw/history")}
          >
            <span>Withdraws</span>
            <span className="text-2xl font-bold">
              {totalWithdraw.toFixed(2)}
            </span>
            <span className="font-bold text-sm flex items-center gap-2">
              {pendingWithdraw > 0 && (
                <>
                  <span>
                    <BsFillClockFill />
                  </span>
                  <span className="text-white">
                    {pendingWithdraw.toFixed(2)}
                  </span>
                </>
              )}
            </span>
          </div>

          <div className="p-5 bg-black rounded-md shadow-md flex flex-col gap-1">
            <span>Todays Work</span>
            <span className="text-xl font-bold">
              {works ? works : 0}/{pack?.daily_limit || 0}
            </span>
          </div>

          <div
            className="p-5 bg-red-500 rounded-md shadow-md flex flex-col gap-1"
            onClick={() => router.push("/user/deposit/history")}
          >
            <span>Deposits</span>
            <span className="text-2xl font-bold">
              {totalDeposit.toFixed(2)}
            </span>
            <span className="font-bold text-sm flex items-center gap-2">
              {pendingDeposit > 0 && (
                <>
                  <span>
                    <BsFillClockFill />
                  </span>
                  <span className="text-white">
                    {pendingDeposit.toFixed(2)}
                  </span>
                </>
              )}
            </span>
          </div>

          <div
            className={`p-5 bg-black rounded-md shadow-md flex flex-col gap-2 ${
              account?.current_pack && "col-span-2"
            }`}
          >
            <span>Package Name</span>
            <span className="text-xl font-bold">
              {pack ? pack.name : "No Package"}
            </span>
            {account?.current_pack && (
              <span className="text-zinc-600">
                Expire at - {moment(account?.valid_till).format("DD MMM, YYYY")}
              </span>
            )}
          </div>
          {!account?.current_pack && (
            <div
              onClick={() => router.push("/user/package")}
              className="p-5 bg-black rounded-md shadow-md flex flex-col gap-3"
            >
              <span>Activate Account</span>
              <span className="text-xl font-bold">Click Here</span>
            </div>
          )}
        </div>
      </section>
    </DashPage>
  )
}

export default Dashboard
