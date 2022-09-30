import React, { useEffect } from "react"
import type { NextPage } from "next"
import DashPage from "../../components/DashPage"
import { useRouter } from "next/router"
import { trpc } from "../../utils/trpc"
import { toast } from "react-hot-toast"
import { useAccount } from "../../hooks/useAccount"

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
      toast.error("Ads limit over. Try again tomorrow")
      router.push("/user/dashboard")
    }
  }, [works, router])
  return (
    <DashPage>
      <div className="p-10">
        <table className="w-full overflow-y-auto">
          <thead>
            <tr className="bg-black overflow-hidden">
              <th className="w-[40%] text-left px-5 py-3">Title</th>
              <th className="w-[30%] text-left px-5 py-3">Reward</th>
              <th className="w-[30%] text-right px-5 py-3">Work</th>
            </tr>
          </thead>
          <tbody>
            {ads?.map((ad) => (
              <tr key={ad.videoId} className="odd:bg-zinc-800">
                <td className="px-5 py-3">Video</td>
                <td className="px-5 py-3">
                  {pack ? pack.per_click : "..."} BDT
                </td>
                <td className="px-5 py-3 whitespace-nowrap">
                  <button
                    onClick={() => showAds()}
                    className="px-3 py-2 bg-black text-zinc-400"
                  >
                    Watch
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
