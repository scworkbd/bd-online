import React, { useEffect } from "react"
import type { NextPage } from "next"
import DashPage from "../../components/DashPage"
import { useRouter } from "next/router"
import { trpc } from "../../utils/trpc"
import { toast } from "react-hot-toast"
import { useAccount } from "../../hooks/useAccount"
import CustomToast from "../../components/CustomToast"

const Dashboard: NextPage = () => {
  const router = useRouter()
  const { data: account } = useAccount()
  const { data: works } = trpc.useQuery(["user.works"])
  const { data: ads } = trpc.useQuery(["admin.ads"])
  const { data: pack } = trpc.useQuery([
    "admin.packageById",
    { packId: account?.current_pack as string },
  ])

  const showAds = () => {
    if (ads) {
      const cad = ads[Math.floor(Math.random() * ads.length)]
      router.push(`/user/work?id=${cad?.videoId}`)
    }
  }

  useEffect(() => {
    if (works !== undefined && works <= 0) {
      toast.custom(
        <CustomToast message="আজকের লিমিট শেষ, কাল আবার চেষ্টা করুণ" />
      )
      router.push("/user/dashboard")
    }
  }, [works, router])
  return (
    <DashPage>
      <div className="overflow-y-auto">
        <h1 className="text-2xl font-bold text-rose-900 text-center mb-5">
          কাজ সমুহ
        </h1>
        <div className="flex flex-col gap-3">
          {ads?.map((ad) => (
            <div key={ad.videoId} className="bg-zinc-200 p-5 rounded-md">
              <div className="flex items-center justify-between">
                <div className="px-3 py-3">ভিডিও</div>
                <div className="px-2 py-3 whitespace-nowrap">
                  {pack ? pack.per_click : "..."} টাকা
                </div>
              </div>
              <div className="px-2 py-3 whitespace-nowrap">
                <button
                  onClick={() => showAds()}
                  className="px-5 py-3 bg-rose-900 w-full text-white text-xs"
                >
                  দেখুন
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashPage>
  )
}

export default Dashboard
