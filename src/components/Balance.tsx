import React from "react"
import Link from "next/link"
import { TbCurrencyTaka } from "react-icons/tb"
import { BiChevronRight, BiDownload } from "react-icons/bi"
import { useAccount } from "../hooks/useAccount"

const Balance = () => {
  const { data: user } = useAccount()

  return (
    <div>
      <div className="py-10">
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-2xl font-bold text-center flex items-center justify-center gap-1">
            <TbCurrencyTaka className="text-2xl" />
            {user?.balance.toFixed(2)}
          </h1>

          <div className="flex items-center flex-wrap gap-3">
            <Link href="/user/history">
              <a className="rounded-full px-1 py-1 border-[1px] border-rose-900 text-xs flex items-center gap-2 pl-3 mt-3">
                ইতিহাস{" "}
                <BiChevronRight className="text-xl bg-black/5 rounded-full" />
              </a>
            </Link>

            <a
              href="/sweetwork.apk"
              className="border-[1px] border-rose-900 rounded-full px-1 py-1 text-xs flex items-center gap-2 pl-3 mt-3"
            >
              App ডাউনলোড{" "}
              <BiDownload className="text-lg bg-black/5 rounded-full animate-bounce -mb-1" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Balance
