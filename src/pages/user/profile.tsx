import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import DashPage from "../../components/DashPage"
import { useAccount } from "../../hooks/useAccount"
import { User } from "@prisma/client"
import { trpc } from "../../utils/trpc"
import { toast } from "react-hot-toast"
import CustomToast from "../../components/CustomToast"

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
      toast.custom(<CustomToast success message="প্রফাইল আপডেট করা হয়েছে" />)
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
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="first_name">নামের প্রথম অংশ</label>
            <input
              type="text"
              className={`${
                errors.first_name && "border-red-500"
              } rounded-full !bg-zinc-100 border-none shadow-md`}
              {...register("first_name", {
                required: true,
              })}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="last_name">নামের শেষ অংশ</label>
            <input
              type="text"
              className={`${
                errors.last_name && "border-red-500"
              } rounded-full !bg-zinc-100 border-none shadow-md`}
              {...register("last_name", {
                required: true,
              })}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="phone">মোবাইল নাম্বার</label>
          <input
            type="text"
            className={`${
              errors.phone && "border-red-500"
            } rounded-full !bg-zinc-100 border-none shadow-md`}
            {...register("phone", {
              required: true,
            })}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="email">ইমেইল</label>
          <input
            type="email"
            disabled
            className={`!border-0 rounded-full !bg-zinc-300 border-none shadow-md`}
            value={account?.email}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="username">ইউজারনেম</label>
          <input
            type="text"
            disabled
            value={account?.username}
            className={`!border-0 rounded-full !bg-zinc-300 border-none shadow-md`}
          />
        </div>

        <div>
          <button className="px-7 py-3 bg-green-500 rounded-full w-full shadow-md">
            প্রোফাইল হালনাগাদ করুণ
          </button>
        </div>
      </form>
    </DashPage>
  )
}

export default ChPWD
