import React from "react"
import DashPage from "../../../components/DashPage"
import moment from "moment"
import { useRefIncome } from "../../../hooks/useRefIncome"

const History = () => {
  const { data: deposits } = useRefIncome()

  return (
    <DashPage hideFooter>
      <div className="p-5">
        <h1 className="text-2xl font-bold text-center my-5">Referral Income</h1>
        <div className="w-full overflow-y-auto">
          <table className="max-w-full text-xs w-full">
            <thead>
              <tr className="bg-black text-zinc-400 overflow-hidden">
                <th className="text-left px-5 py-3">Amount</th>
                <th className="text-left px-5 py-3">Time</th>
              </tr>
            </thead>

            <tbody>
              {deposits?.map((withdraw) => (
                <tr key={withdraw.id} className="odd:bg-zinc-800">
                  <td className="text-left px-5 py-3">{withdraw.id}</td>
                  <td className="text-left px-5 py-3">{withdraw.amount}</td>
                  <td className="text-left px-5 py-3 whitespace-nowrap">
                    {moment(withdraw.date.toISOString()).format(
                      "DD MMM, YYYY h:mm a"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashPage>
  )
}

export default History
