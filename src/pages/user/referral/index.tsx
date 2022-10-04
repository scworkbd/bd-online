import React from "react"
import DashPage from "../../../components/DashPage"
import { useSession } from "next-auth/react"
import { toast } from "react-hot-toast"
import { trpc } from "../../../utils/trpc"
import CustomToast from "../../../components/CustomToast"

const Referral = () => {
  const { data: session } = useSession()
  const ref = `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/register?ref=${session?.user?.username}`

  const { data } = trpc.useQuery(["user.refs"])

  return (
    <DashPage hideFooter>
      <div className="p-5">
        <p className="mb-2 text-center font-bold">রেফার লিংক</p>
        <div className="grid grid-cols-3">
          <input
            type="text"
            disabled
            className="col-span-2 !bg-white !border-0 !px-0"
            value={ref}
          />
          <button
            onClick={() => {
              navigator.clipboard.writeText(ref)
              toast.custom(
                <CustomToast success message="রেফার লিংক কপি করা হয়েছে" />
              )
            }}
            className="px-5 py-3 bg-rose-500 text-white rounded-md"
          >
            Copy
          </button>
        </div>
      </div>

      <div className="p-5">
        <div className="w-full overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-white overflow-hidden border-2">
                <th className="text-left px-5 py-3 whitespace-nowrap">Name</th>
                <th className="text-left px-5 py-3 whitespace-nowrap">
                  Username
                </th>
                <th className="text-left px-5 py-3 whitespace-nowrap">
                  Mobile
                </th>
              </tr>
            </thead>
            <tbody>
              {data?.map((ref) => (
                <tr key={ref.id} className="odd:bg-zinc-100">
                  <td className="text-left px-5 py-3 whitespace-nowrap">
                    {ref.first_name} {ref.last_name}
                  </td>
                  <td className="text-left px-5 py-3 whitespace-nowrap">
                    {ref.username}
                  </td>
                  <td className="text-left px-5 py-3 whitespace-nowrap">
                    {ref.phone}
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

export default Referral
