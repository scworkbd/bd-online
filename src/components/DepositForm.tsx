import React from "react"
import { useForm } from "react-hook-form"
import { trpc } from "../utils/trpc"
import { useSession } from "next-auth/react"
import { toast } from "react-hot-toast"
import { BiLoaderAlt } from "react-icons/bi"
import CustomToast from "./CustomToast"
type Props = {
  method: "bkash" | "nagad" | "upay"
}

type DepositInput = {
  amount: string
  tnx_id: string
}

const DepositForm = ({ method }: Props) => {
  const { data: session } = useSession()
  const { register, handleSubmit, reset } = useForm<DepositInput>()

  const { mutate, isLoading } = trpc.useMutation(["user.deposit"], {
    onSuccess: () => {
      toast.custom(
        <CustomToast
          success
          message="ডিপোজিট রিকুয়েস্ট করা হয়েছে। কিছুক্ষনের মধ্যে আপনার ব্যালেন্স এ যুক্ত হয়ে যাবে"
        />
      )
      reset()
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const deposit = (values: DepositInput) => {
    const amount = Number(values.amount) || 0

    if (!amount || amount < 500) {
      return toast.custom(
        <CustomToast message="সর্বনিম্ন ৫০০ টাকা ডিপোজিট করা যাবে" />
      )
    }

    mutate({
      username: session?.user?.username as string,
      depositData: {
        method,
        amount: amount,
        tnx_id: values.tnx_id,
      },
    })
  }

  return (
    <div className="mt-20">
      <p className="mt-10 text-xl font-bold text-center">
        সর্বনিম্ন ডিপোজিট ৫০০ টাকা
      </p>

      <form className="mt-3" onSubmit={handleSubmit(deposit)}>
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="টাকার পরিমান"
            required
            className="text-center shadow-md rounded-full border-none !bg-zinc-100"
            {...register("amount", { required: true })}
          />
          <input
            type="text"
            className="text-center shadow-md rounded-full border-none !bg-zinc-100"
            placeholder="ট্রানজেকশন আইডি"
            {...register("tnx_id", { required: true })}
          />

          <div>
            <button
              type="submit"
              className="px-7 py-3 bg-green-500 w-full text-white flex items-center justify-center gap-2 rounded-full"
            >
              {isLoading && <BiLoaderAlt />}
              <span>Submit</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default DepositForm
