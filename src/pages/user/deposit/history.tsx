import moment from "moment"
import React from "react"
import DashPage from "../../../components/DashPage"
import { useDeposit } from "../../../hooks/useDeposits"

const History = () => {
  const { data: deposits } = useDeposit()

  return (
    <DashPage hideFooter>
      <div className="p-5">
        <h1 className="text-2xl font-bold mb-10 block text-center text-rose-600">
          ডিপোজিট ইতিহাস
        </h1>
        <div className="w-full overflow-y-auto flex flex-col gap-3">
          {deposits?.map((withdraw) => (
            <div
              key={withdraw.id}
              className="bg-zinc-200 text-xs p-3 relative rounded-md"
            >
              <p className="text-lg font-bold">{withdraw.tnx_id}</p>
              <div>{withdraw.method}</div>
              <div className="text-rose-500 text-xl mt-5">
                {withdraw.amount} tk
              </div>
              <div className="absolute top-5 right-5">
                {withdraw.pending ? (
                  <span className="px-3 py-1 text-xs bg-yellow-500 rounded-full">
                    পেন্ডিং
                  </span>
                ) : withdraw.approved ? (
                  <span className="px-3 py-1 text-xs bg-green-500 rounded-full">
                    সফল
                  </span>
                ) : (
                  <span className="px-3 py-1 text-xs text-red-500 rounded-full">
                    বাতিল
                  </span>
                )}
              </div>
              <div className="text-zinc-500">
                {moment(withdraw.date.toISOString()).format(
                  "DD MMM, YYYY h:mm a"
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashPage>
  )
}

export default History
