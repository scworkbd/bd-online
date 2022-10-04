import React from "react"
import AdminPage from "../../components/AdminPage"
import { trpc } from "../../utils/trpc"

const AdminHome = () => {
  const { data: deposits } = trpc.useQuery(["deposit.deposits"])
  const { data: withdraws } = trpc.useQuery(["withdraw.withdraws"])
  const { data: users } = trpc.useQuery(["admin.users"])

  return (
    <AdminPage>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-zinc-100 rounded-md p-5">
          <p className="text-2xl font-black mb-5">Deposits</p>
          <p>
            Approved:{" "}
            {deposits
              ?.filter((dep) => dep.approved)
              .reduce((prev, item) => prev + item.amount, 0)}
          </p>
          <p>
            Pending:{" "}
            {deposits
              ?.filter((dep) => dep.pending)
              .reduce((prev, item) => prev + item.amount, 0)}
          </p>

          <p>
            Cancelled:{" "}
            {deposits
              ?.filter((dep) => !dep.pending && !dep.approved)
              .reduce((prev, item) => prev + item.amount, 0)}
          </p>
        </div>
        <div className="bg-zinc-100 rounded-md p-5">
          <p className="text-2xl font-black mb-5">Withdraws</p>
          <p>
            Approved:{" "}
            {withdraws
              ?.filter((dep) => dep.approved)
              .reduce((prev, item) => prev + item.amount, 0)}
          </p>
          <p>
            Pending:{" "}
            {withdraws
              ?.filter((dep) => dep.pending)
              .reduce((prev, item) => prev + item.amount, 0)}
          </p>
          <p>
            Cancelled:{" "}
            {withdraws
              ?.filter((dep) => !dep.pending && !dep.approved)
              .reduce((prev, item) => prev + item.amount, 0)}
          </p>
        </div>
        <div className="bg-zinc-100 rounded-md p-5">
          <p className="text-2xl font-black mb-5">Users</p>
          <p>All: {users?.length}</p>
        </div>
      </div>
    </AdminPage>
  )
}

export default AdminHome
