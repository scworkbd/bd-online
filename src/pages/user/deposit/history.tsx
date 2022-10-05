import moment from "moment"
import React from "react"
import DashPage from "../../../components/DashPage"
import { useDeposit } from "../../../hooks/useDeposits"

const History = () => {
  const { data: deposits } = useDeposit()

  return (
    <DashPage hideFooter>
      <div className="p-5">
        <h1 className="text-2xl font-bold mb-3">ডিপোজিট ইতিহাস</h1>
        <div className="w-full overflow-y-auto">
          <table className="max-w-full w-full text-xs">
            <thead>
              <tr className="bg-white text-black overflow-hidden border-2">
                <th className="text-left px-5 py-3 whitespace-nowrap">আইডি</th>
                <th className="text-left px-5 py-3">ওয়ালেট</th>
                <th className="text-left px-5 py-3">পরিমান</th>
                <th className="text-left px-5 py-3">স্টাটাস</th>
                <th className="text-left px-5 py-3">সময়</th>
              </tr>
            </thead>

            <tbody>
              {deposits?.map((withdraw) => (
                <tr key={withdraw.id} className="odd:bg-zinc-100">
                  <td className="text-left px-5 py-3">{withdraw.tnx_id}</td>
                  <td className="text-left px-5 py-3">{withdraw.method}</td>
                  <td className="text-left px-5 py-3">{withdraw.amount}</td>
                  <td className="text-left px-5 py-3">
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
