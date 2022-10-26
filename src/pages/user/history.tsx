import moment from "moment"
import React from "react"
import DashPage from "../../components/DashPage"
import { useAccount } from "../../hooks/useAccount"
import { trpc } from "../../utils/trpc"

const History = () => {
  const { data: account } = useAccount()
  const { data: pack } = trpc.useQuery([
    "admin.packageById",
    { packId: account?.current_pack as string },
  ])

  const { data: works } = trpc.useQuery(["user.myorks"])

  return (
    <DashPage hideFooter>
      <div className="p-5">
        <h1 className="text-2xl font-bold mb-5 text-center">কাজের ইতিহাস</h1>
        <div className="p-5 flex flex-col gap-3">
          {works?.map((work) => (
            <div key={work.id} className="p-5 rounded-md bg-zinc-200">
              <div className="flex items-center justify-between">
                <h1 className="text-lg font-bold">ভিডিও</h1>
                <h1 className="text-3xl font-bold text-rose-500">
                  {pack?.per_click} tk
                </h1>
              </div>
              <p>
                {moment(work.date.toISOString()).format("DD MMM, YYYY h:mm a")}
              </p>
            </div>
          ))}
        </div>
      </div>
    </DashPage>
  )
}

export default History
