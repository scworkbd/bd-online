import React from "react"
import AdminPage from "../../../components/AdminPage"
import { trpc } from "../../../utils/trpc"
import Link from "next/link"
import { toast } from "react-hot-toast"

const Packages = () => {
  const { data: packs, refetch } = trpc.useQuery(["admin.packages"])
  const { mutate } = trpc.useMutation(["admin.delPack"], {
    onSuccess: () => {
      refetch()
      toast.success("Pack deleted")
    },
  })

  const del = (packId: string) => {
    const can = confirm("Are you sure?")
    if (can) {
      mutate({ packId })
    }
  }

  return (
    <AdminPage>
      <Link href="/admin/packages/create">
        <a className="bg-indigo-500 px-5 py-2 rounded-md text-white inline-block">
          Create Pack
        </a>
      </Link>

      <table className="w-full mt-5">
        <thead className="bg-black text-white">
          <tr>
            <td className="px-5 py-2">Name</td>
            <td className="px-5 py-2">Price</td>
            <td className="px-5 py-2">Action</td>
          </tr>
        </thead>
        <tbody>
          {packs &&
            packs
              .sort((a, b) => a.price - b.price)
              .map((dep) => (
                <tr key={dep.id} className="odd:bg-zinc-200">
                  <td className="px-5 py-2">{dep.name}</td>
                  <td className="px-5 py-2">{dep.price}</td>
                  <td className="px-5 py-2 flex gap-2 flex-wrap">
                    <Link href={`/admin/packages/${dep.id}`}>
                      <a className="px-5 py-2 text-sm bg-yellow-600 text-white rounded-full">
                        Edit
                      </a>
                    </Link>

                    <button
                      onClick={() => del(dep.id)}
                      className="px-5 py-2 text-sm bg-red-600 text-white rounded-full"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
    </AdminPage>
  )
}

export default Packages
