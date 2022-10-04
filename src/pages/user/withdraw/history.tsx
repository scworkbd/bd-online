import React from "react"
import DashPage from "../../../components/DashPage"
import { useWithdraw } from "../../../hooks/useWithdraw"
import moment from "moment"

const History = () => {
  const { data: withdraws } = useWithdraw()

  return (
    <DashPage hideFooter>
      <h1 className="text-2xl font-bold text-center mb-3 mt-10">
        Withdraw History
      </h1>
      <div className="p-5">
        <div className="w-full overflow-y-auto">
          <table className="max-w-full text-xs">
            <thead>
              <tr className="bg-white text-black overflow-hidden border-2">
                <th className="text-left px-5 py-3 whitespace-nowrap">
                  ট্রাকিং নাম্বার
                </th>
                <th className="text-left px-5 py-3">ওয়ালেট</th>
                <th className="text-left px-5 py-3">মোবাইল</th>
                <th className="text-left px-5 py-3">পরিমান</th>
                <th className="text-left px-5 py-3">ফিস</th>
                <th className="text-left px-5 py-3">পেমেন্ট</th>
                <th className="text-left px-5 py-3">স্টাটাস</th>
              </tr>
            </thead>

            <tbody>
              {withdraws?.map((withdraw) => (
                <tr key={withdraw.id} className="odd:bg-zinc-100">
                  <td className="text-left px-5 py-3">{withdraw.id}</td>
                  <td className="text-left px-5 py-3">{withdraw.method}</td>
                  <td className="text-left px-5 py-3">
                    {withdraw.mobile_number}
                  </td>
                  <td className="text-left px-5 py-3">
                    {withdraw.amount.toFixed(2)}
                  </td>
                  <td className="text-left px-5 py-3">
                    {withdraw.fees.toFixed(2)}
                  </td>
                  <td className="text-left px-5 py-3">
                    {(withdraw.amount - withdraw.fees).toFixed(2)}
                  </td>
                  <td className="text-left px-5 py-3">
                    {withdraw.pending ? (
                      <span className="px-3 py-1 text-xs bg-yellow-500 rounded-full">
                        Pending
                      </span>
                    ) : withdraw.approved ? (
                      <span className="px-3 py-1 text-xs bg-green-500 rounded-full">
                        Paid
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-xs bg-red-500 rounded-full">
                        Declined
                      </span>
                    )}
                  </td>
                  {/* <td className="text-left px-5 py-3 whitespace-nowrap">
                    {moment(withdraw.date.toISOString()).format(
                      "DD MMM, YYYY h:mm a"
                    )}
                  </td> */}
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
