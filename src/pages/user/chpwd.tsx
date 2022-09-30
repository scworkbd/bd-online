import React from "react"
import { useForm } from "react-hook-form"
import DashPage from "../../components/DashPage"
import { trpc } from "../../utils/trpc"
import { toast } from "react-hot-toast"
import { BiLoaderAlt } from "react-icons/bi"

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
      toast.success("Password updated")
      reset()
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const updateUser = (values: UserInput) => {
    mutate({
      data: values,
    })
  }

  return (
    <DashPage>
      <form
        onSubmit={handleSubmit(updateUser)}
        className="flex flex-col gap-4 mt-5 p-5"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="old_pass">Old Password</label>

          <input
            type="password"
            className={`${errors.old_pass && "border-red-500"}`}
            {...register("old_pass", {
              required: true,
              minLength: 6,
            })}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password_hash">New Password</label>

          <input
            type="password"
            className={`${errors.new_pass && "border-red-500"}`}
            {...register("new_pass", {
              required: true,
              minLength: 6,
            })}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="new_pass_conf">Confirm Password</label>

          <input
            type="password"
            className={`${errors.new_pass_conf && "border-red-500"}`}
            {...register("new_pass_conf", {
              validate: (value: string) => {
                const values = getValues()
                return values.new_pass === value
              },
            })}
          />
        </div>

        <div>
          <button className="px-7 py-3 bg-black text-zinc-400 flex items-center gap-2">
            {isLoading && <BiLoaderAlt />}
            Update Password
          </button>
        </div>
      </form>
    </DashPage>
  )
}

export default ChPWD
