import React from "react"
import { useForm } from "react-hook-form"
import { trpc } from "../utils/trpc"
import { useSession } from "next-auth/react"
import { toast } from "react-hot-toast"
import { BiLoaderAlt } from "react-icons/bi"
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
      toast.success("Deposit successful")
      reset()
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const deposit = (values: DepositInput) => {
    const amount = Number(values.amount) || 0

    if (!amount || amount < 500) {
      return toast.error("Minimum deposit is 500 BDT")
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
    <div>
      <p className="mt-10">Minimum deposit 500 BDT</p>

      <form className="mt-3" onSubmit={handleSubmit(deposit)}>
        <div className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="Enter amount"
            required
            {...register("amount", { required: true })}
          />
          <input
            type="text"
            placeholder="TNX ID"
            {...register("tnx_id", { required: true })}
          />

          <div>
            <button
              type="submit"
              className="px-7 py-3 bg-black text-white flex items-center justify-center gap-2"
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
