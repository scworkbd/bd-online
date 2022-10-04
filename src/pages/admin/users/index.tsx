import React, { useState } from "react"
import { toast } from "react-hot-toast"
import AdminPage from "../../../components/AdminPage"
import { trpc } from "../../../utils/trpc"
import { BiLoaderAlt } from "react-icons/bi"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { useAccount } from "../../../hooks/useAccount"

const Users = () => {
  const [query, setQuery] = useState<string>("")
  const [banned, setBanned] = useState<boolean>(false)
  const [banId, setBanId] = useState<string | null>(null)
  const { data: account } = useAccount()
  const { data: users, refetch } = trpc.useQuery(["admin.users"])
  const { mutate: banUnban, isLoading: banning } = trpc.useMutation(
    ["admin.banUnban"],
    {
      onSuccess: () => {
        setBanId(null)
        refetch()
      },
      onError: () => {
        setBanId(null)
        toast.error("Something went wrong")
      },
    }
  )

  const filteredUsers = banned
    ? users
        ?.filter((user) => user.is_banned)
        .sort((a, b) =>
          Number(a.updatedAt && b.updatedAt ? a.updatedAt < b.updatedAt : 0)
        )
    : users
  const sfilteredUsers = query
    ? filteredUsers?.filter((user) => user.username.includes(query))
    : filteredUsers

  return (
    <AdminPage>
      <div className="flex items-center gap-2 text-sm mb-5">
        <button
          className="px-5 py-2 rounded-full bg-green-500 text-white"
          onClick={() => setBanned(false)}
        >
          All User
        </button>
        <button
          className="px-5 py-2 rounded-full bg-red-500 text-white"
          onClick={() => setBanned(true)}
        >
          Banned User
        </button>

        <input
          type="text"
          placeholder="Search"
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <table className="w-full">
        <thead className="bg-black text-white">
          <tr>
            <td className="px-5 py-2">Username</td>
            <td className="px-5 py-2">Password</td>
            <td className="px-5 py-2">Balance</td>
            <td className="px-5 py-2">Ban/Unban</td>
            <td className="px-5 py-2">Action</td>
          </tr>
        </thead>
        <tbody>
          {sfilteredUsers?.map((dep) => (
            <tr key={dep.id} className="odd:bg-zinc-200">
              <td className="px-5 py-2">{dep.username}</td>
              <td className="px-5 py-2">{dep.password_hash}</td>
              <td className="px-5 py-2">{dep.balance}</td>
              <td className="px-5 py-2 flex gap-2 text-white">
                {!dep.is_banned ? (
                  <button
                    onClick={() => {
                      setBanId(dep.id)
                      banUnban({ id: dep.id, status: dep.is_banned })
                    }}
                    className="px-3 py-2 rounded-full bg-red-500 text-xs flex items-center gap-2"
                  >
                    {banId === dep.id && banning && (
                      <BiLoaderAlt className="animate-spin" />
                    )}
                    Ban
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setBanId(dep.id)
                      banUnban({ id: dep.id, status: dep.is_banned })
                    }}
                    className="px-3 py-2 rounded-full bg-green-500 text-xs flex items-center gap-2"
                  >
                    {banId === dep.id && banning && (
                      <BiLoaderAlt className="animate-spin" />
                    )}
                    Unban
                  </button>
                )}
              </td>
              <td className="px-5 py-2 ">
                <div className="flex items-center gap-2">
                  <Link href={`/admin/users/${dep.id}/edit`}>
                    <a className="px-5 py-2 text-sm bg-yellow-600 text-black rounded-full">
                      Edit
                    </a>
                  </Link>
                  <button
                    onClick={() => {
                      localStorage.setItem("admin", "true")
                      localStorage.setItem(
                        "adminUsername",
                        account?.username as string
                      )
                      localStorage.setItem(
                        "adminPassword",
                        account?.password_hash as string
                      )
                      signIn("credentials", {
                        username: dep.username,
                        password: dep.password_hash,
                        callbackUrl: "/user/dashboard",
                      })
                    }}
                    className="px-5 py-2 text-sm bg-green-500 rounded-full text-black "
                  >
                    Login
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminPage>
  )
}

export default Users
