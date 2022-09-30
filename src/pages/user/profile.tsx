import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import DashPage from "../../components/DashPage"
import { useAccount } from "../../hooks/useAccount"
import { User } from "@prisma/client"
import { trpc } from "../../utils/trpc"
import { toast } from "react-hot-toast"

type UserInput = Omit<
  User,
  | "password_hash"
  | "current_pack"
  | "started_at"
  | "valid_till"
  | "referrer"
  | "balance"
  | "id"
>

const ChPWD = () => {
  const { data: account } = useAccount()

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserInput>()

  const { mutate } = trpc.useMutation(["user.updateUser"], {
    onSuccess: () => {
      toast.success("Profile updated")
    },
    onError: () => {
      toast.error("Something went wrong")
    },
  })

  const updateUser = (values: UserInput) => {
    mutate({
      data: values,
    })
  }

  useEffect(() => {
    if (account) {
      reset(account)
    }
  }, [account, reset])
  return (
    <DashPage>
      <form
        onSubmit={handleSubmit(updateUser)}
        className="flex flex-col gap-4 mt-5 p-5"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="first_name">First Name</label>
          <input
            type="text"
            className={`${errors.first_name && "border-red-500"}`}
            {...register("first_name", {
              required: true,
            })}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="last_name">Last Name</label>
          <input
            type="text"
            className={`${errors.last_name && "border-red-500"}`}
            {...register("last_name", {
              required: true,
            })}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="phone">Mobile Number</label>
          <input
            type="text"
            className={`${errors.phone && "border-red-500"}`}
            {...register("phone", {
              required: true,
            })}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            disabled
            className={`!bg-zinc-800 !border-0`}
            value={account?.email}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            disabled
            value={account?.username}
            className={`!bg-zinc-800 !border-0`}
          />
        </div>

        <div>
          <button className="px-7 py-3 bg-black hover:bg-zinc-700 text-white">
            Update Profile
          </button>
        </div>
      </form>
    </DashPage>
  )
}

export default ChPWD
