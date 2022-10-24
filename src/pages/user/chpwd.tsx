import React from "react"
import { useForm } from "react-hook-form"
import DashPage from "../../components/DashPage"
import { trpc } from "../../utils/trpc"
import { toast } from "react-hot-toast"
import { BiLoaderAlt } from "react-icons/bi"
import CustomToast from "../../components/CustomToast"

type UserInput = {
  old_pass: string
  new_pass: string
  new_pass_conf: string
}

const ChPWD = () => {
  const {
    reset,
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<UserInput>()

  const { mutate, isLoading } = trpc.useMutation(["user.updatePassword"], {
    onSuccess: () => {
      toast.custom(<CustomToast success message="পাসওয়ার্ড পরিবর্তন হয়েছে" />)
      reset()
    },
  })

  const updateUser = (values: UserInput) => {
    mutate({
      data: values,
    })
  }

  return (
    <DashPage>
      <h1 className="text-3xl font-bold text-center text-rose-600">
        পাসওয়ার্ড পরিবর্তন
      </h1>

      <form
        onSubmit={handleSubmit(updateUser)}
        className="flex flex-col gap-4 mt-5 p-5"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="old_pass">পূর্বের পাসওয়ার্ড</label>

          <input
            type="password"
            className="border-2 border-rose-600"
            {...register("old_pass", {
              required: true,
              minLength: 6,
            })}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password_hash">নতুন পাসওয়ার্ড</label>

          <input
            type="password"
            className="border-2 border-rose-600"
            {...register("new_pass", {
              required: true,
              minLength: 6,
            })}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="new_pass_conf">পাসওয়ার্ড আবার লিখুন</label>

          <input
            type="password"
            className="border-2 border-rose-600"
            {...register("new_pass_conf", {
              validate: (value: string) => {
                const values = getValues()
                return values.new_pass === value
              },
            })}
          />
        </div>

        <div className="mt-5">
          <button className="px-7 py-3 bg-rose-600 w-full text-white text-center flex items-center justify-center gap-2">
            {isLoading && <BiLoaderAlt />}
            Update Password
          </button>
        </div>
      </form>
    </DashPage>
  )
}

export default ChPWD
