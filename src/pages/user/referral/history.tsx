import React from "react"
import DashPage from "../../../components/DashPage"
import moment from "moment"
import { useRefIncome } from "../../../hooks/useRefIncome"

const History = () => {
  const { data: deposits } = useRefIncome()

  return (
    <DashPage hideFooter>
      <div className="p-5">
        <h1 className="text-2xl font-bold mb-5 text-center">রেফারেল ইনকাম</h1>
        <div className="w-full overflow-y-auto">
          <div>
            {deposits?.map((withdraw) => (
              <div key={withdraw.id} className="bg-zinc-200 p-5 rounded-md">
                <div className="text-left text-xl font-bold">
                  {withdraw.referrerFullName}
                </div>
                <div className="text-left text-xs">
                  ইউজারনেইম - {withdraw.referrerUsername}
                </div>
                <div className="text-left text-rose-500 text-2xl mt-5">
                  {withdraw.amount} tk
                </div>
                <div className="text-left text-zinc-600 mt-2">
                  {moment(withdraw.date.toISOString()).format(
                    "DD MMM, YYYY h:mm a"
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashPage>
  )
}

export default History
