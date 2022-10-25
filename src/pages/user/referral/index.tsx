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
        <p className="mb-2 font-bold text-xl">রেফার লিংক</p>
        <div>
          <p>{ref}</p>
          <button
            onClick={() => {
              navigator.clipboard.writeText(ref)
              toast.custom(
                <CustomToast success message="রেফার লিংক কপি করা হয়েছে" />
              )
            }}
            className="px-5 py-3 bg-black text-white block w-max mt-3"
          >
            Copy
          </button>
        </div>
      </div>

      <div className="p-5">
        <div>
          <div className="flex flex-col gap-5">
            {data?.map((ref) => (
              <div key={ref.id} className="bg-zinc-200 p-5 rounded-md">
                <p className="text-left whitespace-nowrap text-lg font-bold">
                  {ref.first_name} {ref.last_name}
                </p>
                <p className="text-left whitespace-nowrap">
                  Username: {ref.username}
                </p>
                <p className="text-left whitespace-nowrap">
                  Phone: {ref.phone}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashPage>
  )
}

export default Referral
