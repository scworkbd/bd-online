import React from "react"
import DashPage from "../../../components/DashPage"
import { useSession } from "next-auth/react"
import { toast } from "react-hot-toast"
import { trpc } from "../../../utils/trpc"

const Referral = () => {
  const { data: session } = useSession()
  const ref = `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/register?ref=${session?.user?.username}`

  const { data } = trpc.useQuery(["user.refs"])

  return (
    <DashPage hideFooter>
      <div className="p-5">
        <p className="mb-2">Link</p>
        <div className="grid grid-cols-3">
          <input
            type="text"
            className="col-span-2 bg-zinc-100 !border-0 !rounded-none !rounded-l-md"
            value={ref}
          />
          <button
            onClick={() => {
              navigator.clipboard.writeText(ref)
              toast.success("Link copied to clipboard")
            }}
            className="px-5 py-3 bg-black text-zinc-400 rounded-r-md"
          >
            Copy
          </button>
        </div>
      </div>

      <div className="p-5">
        <div className="w-full overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-black text-zinc-400 overflow-hidden">
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
                <tr key={ref.id} className="odd:bg-zinc-800">
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
