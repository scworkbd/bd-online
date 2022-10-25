import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import DashPage from "../../components/DashPage"
import { useAccount } from "../../hooks/useAccount"
import { User } from "@prisma/client"
import { trpc } from "../../utils/trpc"
import { toast } from "react-hot-toast"
import CustomToast from "../../components/CustomToast"
import Link from "next/link"

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
      <h1 className="text-2xl font-bold text-center text-rose-900">
        আপডেট প্রোফাইল
      </h1>
      <form
        onSubmit={handleSubmit(updateUser)}
        className="flex flex-col gap-4 mt-5 p-5"
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="first_name">নামের প্রথম অংশ</label>
            <input
              type="text"
              className={`border-2 border-rose-500 shadow-md`}
              {...register("first_name", {
                required: true,
              })}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="last_name">নামের শেষ অংশ</label>
            <input
              type="text"
              className={`border-2 border-rose-500 shadow-md`}
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
            className={`border-2 border-rose-500 shadow-md`}
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
            className={`border-2 border-rose-500 shadow-md bg-zinc-400`}
            value={account?.email}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="username">ইউজারনেম</label>
          <input
            type="text"
            disabled
            value={account?.username}
            className={`border-2 border-rose-500 shadow-md bg-zinc-400`}
          />
        </div>

        <div className="grid grid-cols-1 gap-3">
          <button className="px-7 py-3 bg-rose-600 text-white w-full text-sm">
            আপডেট প্রোফাইল
          </button>

          <Link href="/user/chpwd">
            <a className="border-2 border-rose-600 text-center text-sm flex items-center justify-center py-3">
              পাসওয়ার্ড পরিবর্তন
            </a>
          </Link>
        </div>
      </form>
    </DashPage>
  )
}

export default ChPWD
