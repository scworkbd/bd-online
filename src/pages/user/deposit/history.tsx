import React from "react"
import DashPage from "../../../components/DashPage"
import moment from "moment"
import { useDeposit } from "../../../hooks/useDeposits"

const History = () => {
  const { data: deposits } = useDeposit()

  return (
    <DashPage hideFooter>
      <h1 className="text-2xl font-bold text-center mb-3 mt-10">
        Deposit History
      </h1>
      <div className="p-5">
        <div className="w-full overflow-y-auto">
          <table className="max-w-full text-xs">
            <thead>
              <tr className="bg-black text-white overflow-hidden">
                <th className="text-left px-5 py-3 whitespace-nowrap">
                  Tracking Number
                </th>
                <th className="text-left px-5 py-3">Wallet</th>
                <th className="text-left px-5 py-3">Amount</th>
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-left px-5 py-3">Time</th>
              </tr>
            </thead>

            <tbody>
              {deposits?.map((withdraw) => (
                <tr key={withdraw.id} className="odd:bg-zinc-800">
                  <td className="text-left px-5 py-3">{withdraw.id}</td>
                  <td className="text-left px-5 py-3">{withdraw.method}</td>
                  <td className="text-left px-5 py-3">{withdraw.amount}</td>
                  <td className="text-left px-5 py-3">
                    {withdraw.pending ? (
                      <span className="px-3 py-1 text-xs bg-black rounded-full">
                        Pending
                      </span>
                    ) : withdraw.approved ? (
                      <span className="px-3 py-1 text-xs bg-black rounded-full">
                        Successful
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-xs bg-black rounded-full">
                        Declined
                      </span>
                    )}
                  </td>
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
