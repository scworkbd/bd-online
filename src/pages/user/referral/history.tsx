import React from "react"
import DashPage from "../../../components/DashPage"
import moment from "moment"
import { useRefIncome } from "../../../hooks/useRefIncome"

const History = () => {
  const { data: deposits } = useRefIncome()

  return (
    <DashPage hideFooter>
      <div className="p-5">
        <h1 className="text-2xl font-bold my-5">রেফারেল ইনকাম</h1>
        <div className="w-full overflow-y-auto">
          <table className="max-w-full text-xs w-full">
            <thead>
              <tr className="bg-white overflow-hidden border-2">
                <th className="text-left px-5 py-3 whitespace-nowrap">
                  সম্পুর্ন নাম
                </th>
                <th className="text-left px-5 py-3 whitespace-nowrap">
                  ইউজারনেম
                </th>
                <th className="text-left px-5 py-3">পরিমান</th>
                <th className="text-left px-5 py-3">সময়</th>
              </tr>
            </thead>

            <tbody>
              {deposits?.map((withdraw) => (
                <tr key={withdraw.id} className="odd:bg-zinc-100">
                  <td className="text-left px-5 py-3">
                    {withdraw.user.first_name} {withdraw.user.last_name}
                  </td>
                  <td className="text-left px-5 py-3">
                    {withdraw.user.username}
                  </td>
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
