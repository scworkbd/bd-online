import React, { useEffect } from "react"
import AdminPage from "../../../../components/AdminPage"
import { trpc } from "../../../../utils/trpc"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import { User } from "@prisma/client"
import { toast } from "react-hot-toast"
import { BiLoaderAlt } from "react-icons/bi"

const EditUser = () => {
  const router = useRouter()
  const userId = router.query.userId
  const { data: user } = trpc.useQuery([
    "admin.userById",
    {
      userId: userId as string,
    },
  ])

  const { mutate, isLoading } = trpc.useMutation(["admin.updateUserByid"], {
    onSuccess: () => {
      toast.success("Data Updated")
    },
  })

  const { register, reset, handleSubmit } = useForm<User>()

  const update = (value: User) => {
    mutate({
      userId: userId as string,
      data: {
        ...value,
        balance: Number(value.balance) || (user?.balance as number),
      },
    })
  }

  useEffect(() => {
    if (user) {
      reset(user)
    }
  }, [user, reset])

  return (
    <AdminPage>
      <form onSubmit={handleSubmit(update)}>
        <div className="w-full max-w-md mx-auto flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label>First Name</label>
            <input
              type="text"
              placeholder="First Name"
              {...register("first_name")}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label>First Name</label>
            <input
              type="text"
              placeholder="Last Name"
              {...register("last_name")}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label>Username</label>
            <input
              type="text"
              placeholder="Username"
              {...register("username")}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label>Mobile</label>
            <input type="text" placeholder="Mobile" {...register("phone")} />
          </div>

          <div className="flex flex-col gap-2">
            <label>Email</label>
            <input type="text" placeholder="Email" {...register("email")} />
          </div>

          <div className="flex flex-col gap-2">
            <label>Passoword</label>
            <input
              type="text"
              placeholder="Passoword"
              {...register("password_hash")}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label>Balance</label>
            <input
              type="number"
              placeholder="Balance"
              step={0.01}
              {...register("balance")}
            />
          </div>

          <div className="flex gap-5 items-center">
            <div className="flex items-center gap-2">
              <input id="is_admin" type="checkbox" {...register("is_admin")} />
              <label htmlFor="is_admin">Admin</label>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="is_banned"
                type="checkbox"
                {...register("is_banned")}
              />
              <label htmlFor="is_banned">Banned</label>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="px-7 py-3 bg-black text-white rounded-md flex items-center gap-2"
            >
              {isLoading && <BiLoaderAlt className="animate-spin" />}
              Save Settings
            </button>
          </div>
        </div>
      </form>
    </AdminPage>
  )
}

export default EditUser
