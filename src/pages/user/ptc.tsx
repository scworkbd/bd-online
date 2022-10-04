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
        <table className="w-full">
          <tbody>
            {ads?.map((ad) => (
              <tr key={ad.videoId} className="shadow-lg">
                <td className="px-3 py-3">ভিডিও</td>
                <td className="px-2 py-3 whitespace-nowrap">
                  {pack ? pack.per_click : "..."} টাকা
                </td>
                <td className="px-2 py-3 whitespace-nowrap">
                  <button
                    onClick={() => showAds()}
                    className="px-5 py-2 bg-green-500 text-white rounded-full text-xs"
                  >
                    দেখুন
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashPage>
  )
}

export default Dashboard
