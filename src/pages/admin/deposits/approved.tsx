import moment from "moment"
import Link from "next/link"
import React from "react"
import { toast } from "react-hot-toast"
import AdminPage from "../../../components/AdminPage"
import { trpc } from "../../../utils/trpc"

const Deposits = () => {
  const { data: deposits, refetch } = trpc.useQuery(["deposit.depositsWUser"])

  const { mutate: canMute } = trpc.useMutation(["deposit.undoDepApprove"], {
    onSuccess: () => {
      toast.success("Withdraw cancelled")
      refetch()
    },
  })

  const canceclWith = (id: string) => {
    const conf = confirm("Are you sure?")

    if (conf) {
      canMute({
        depId: id,
      })
    }
  }

  return (
    <AdminPage>
      <div className="flex gap-2 items-center mb-5">
        <Link href="/admin/deposits">
          <a className="px-5 py-3 bg-zinc-700 rounded-md text-white">Pending</a>
        </Link>

        <Link href="/admin/deposits/approved">
          <a className="px-5 py-3 bg-zinc-700 rounded-md text-white">
            Approved
          </a>
        </Link>

        <Link href="/admin/deposits/cancelled">
          <a className="px-5 py-3 bg-zinc-700 rounded-md text-white">
            Cancelled
          </a>
        </Link>
      </div>
      <table className="w-full">
        <thead className="bg-black text-white">
          <tr>
            <td className="px-5 py-2">ID</td>
            <td className="px-5 py-2">Username</td>
            <td className="px-5 py-2">TNX ID</td>
            <td className="px-5 py-2">Amount</td>
            <td className="px-5 py-2">Wallet</td>
            <td className="px-5 py-2">Date</td>
            <td className="px-5 py-2">Action</td>
          </tr>
        </thead>
        <tbody>
          {deposits
            ?.filter((dep) => !dep.pending && dep.approved)
            .sort((a, b) =>
              Number(a.updatedAt && b.updatedAt ? a.updatedAt < b.updatedAt : 0)
            )
            .map((dep) => (
              <tr key={dep.id} className="odd:bg-zinc-200">
                <td className="px-5 py-2">{dep.id}</td>
                <td className="px-5 py-2">{dep.user.username}</td>
                <td className="px-5 py-2">{dep.tnx_id}</td>
                <td className="px-5 py-2">{dep.amount}</td>
                <td className="px-5 py-2">{dep.method}</td>
                <td className="px-5 py-2 whitespace-nowrap">
                  {moment(dep.date).format("DD MMM, YYYY hh:mm a")}
                </td>
                <td className="flex items-center flex-wrap gap-2 px-5 py-2">
                  <button
                    onClick={() => canceclWith(dep.id)}
                    className="px-3 py-1 bg-red-500 text-white font-bold rounded-md"
                  >
                    Decline
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </AdminPage>
  )
}

export default Deposits
