import React, { Fragment, useEffect, useState } from "react"
import type { NextPage } from "next"
import DashPage from "../../../components/DashPage"
import Image from "next/image"
import { useAccount } from "../../../hooks/useAccount"
import { Dialog, Transition } from "@headlessui/react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { trpc } from "../../../utils/trpc"
import { useSettings } from "../../../hooks/useSettings"
import { BiLoaderAlt } from "react-icons/bi"
import { useRouter } from "next/router"

type Methods = "bkash" | "nagad" | "upay"

const Deposit: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<{
    amount: number
    method: Methods
    mobile_number: string
  }>()
  type WithData = {
    amount: number
    method: "bkash" | "nagad" | "upay"
    mobile_number: string
    fees: number
  }
  const router = useRouter()
  const { data: settings } = useSettings()
  const [withData, setWithData] = useState<WithData>()
  const { data: account, refetch } = useAccount()
  const { mutate, isLoading: wLoading } = trpc.useMutation(["user.withdraw"], {
    onSuccess: () => {
      toast.success("উইথড্র সফল হয়েছে")
      reset()
      refetch()
      setMethod(null)
      setWithData(undefined)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const withDraws: { [key: string]: { min: number; max: number } } = {
    bkash: {
      min: 300,
      max: 25000,
    },
    nagad: {
      min: 300,
      max: 25000,
    },
    upay: {
      min: 300,
      max: 25000,
    },
  }

  const [method, setMethod] = useState<"bkash" | "nagad" | "upay" | null>()

  const submitWithdrawal = (values: {
    amount: number
    mobile_number: string
  }) => {
    const amount = Number(values.amount) || 0

    if (
      //@ts-expect-error("can't be null")
      amount < withDraws[method || "bkash"]?.min || //@ts-expect-error("can't be null")
      amount > withDraws[method || "bkash"]?.max
    ) {
      return toast.error("Please enter valid amount")
    }

    if (amount > (account ? account?.balance : 0)) {
      return toast.error("Not enough balance")
    }

    if (amount && method && account && settings) {
      console.log((Number(values.amount) / 100) * settings.bkash_percentage)
      setWithData({
        amount: Number(values.amount) || 300,
        mobile_number: values.mobile_number,
        method: method,
        fees:
          (Number(values.amount) / 100) * settings.bkash_percentage +
          (method === "bkash" ? 10 : 0),
      })
    }
  }

  const executeWithdraw = () => {
    if (withData && account && !wLoading) {
      mutate({
        userId: account.id,
        amount: Number(withData.amount) || 300,
        method: withData.method,
        mobile_number: withData.mobile_number,
      })
    }
  }

  useEffect(() => {
    if (account) {
      if (!account.current_pack) {
        toast.error("Please activate your account")
        router.push("/user/dashboard")
      }
    }
  }, [account, router])

  return (
    <DashPage hideFooter>
      <h1 className="text-2xl font-bold text-center mt-10 mb-5">
        {settings?.cashout_enabled ? "Select Wallet" : settings?.cashout_notice}
      </h1>
      {settings?.cashout_enabled && (
        <div className="grid grid-cols-6 gap-5">
          <div></div>
          <div
            onClick={() => setMethod("bkash")}
            className="text-center col-span-2"
          >
            <div className="bg-zinc-800 p-3 text-center">
              <Image
                src="/icons/bkash.png"
                width={100}
                height={100}
                alt="bkash"
              />
            </div>
          </div>

          <div
            onClick={() => setMethod("nagad")}
            className="text-center col-span-2"
          >
            <div className="bg-zinc-800 p-3 text-center">
              <Image
                src="/icons/nagad.png"
                width={100}
                height={100}
                alt="bkash"
              />
            </div>
          </div>
          <div></div>
        </div>
      )}

      <Transition appear show={method ? true : false} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => {
            setMethod(null)
            setWithData(undefined)
            reset()
          }}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden bg-black p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-medium leading-6 text-gray-900 flex items-center justify-between"
                  >
                    <span className="text-white capitalize">{method}</span>
                  </Dialog.Title>
                  <div className="pt-5">
                    {!withData ? (
                      <form onSubmit={handleSubmit(submitWithdrawal)}>
                        <div className="flex flex-col gap-3">
                          <input
                            type="text"
                            placeholder="Amount"
                            className="w-full"
                            {...register("amount", {
                              required: {
                                value: true,
                                message: "amount is required",
                              },
                            })}
                          />

                          <input
                            type="text"
                            placeholder="Number"
                            className="w-full"
                            {...register("mobile_number", {
                              required: {
                                value: true,
                                message: "number is required",
                              },
                            })}
                          />
                        </div>

                        <span
                          className={`text-xs ${
                            errors.amount?.message
                              ? "text-red-500"
                              : "text-yellow-500"
                          }`}
                        >
                          Minimum {withDraws[method || "bkash"]?.min}, Maximum{" "}
                          {withDraws[method || "bkash"]?.max} BDT
                        </span>

                        <div className="mt-4 flex items-center gap-2">
                          <button
                            type="submit"
                            className="bg-zinc-700 px-4 py-2 text-sm text-white hover:bg-zinc-800 "
                          >
                            Next
                          </button>

                          <button
                            type="button"
                            className="inline-flex justify-center border border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 "
                            onClick={() => {
                              setMethod(null)
                              setWithData(undefined)
                              reset()
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div>
                        <p>Method: {withData.method}</p>
                        <p>Amount: {withData.amount}</p>
                        <p>
                          Fees: {withData.fees.toFixed(2)}{" "}
                          <span className="text-sm text-red-500">
                            ({settings?.bkash_percentage}% +
                            {withData.method === "bkash" ? " 10" : " 0"}tk)
                          </span>
                        </p>
                        <p>Mobile Number: {withData.mobile_number}</p>

                        <div className="mt-4 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => executeWithdraw()}
                            className="bg-zinc-700 px-4 py-2 text-sm text-white hover:bg-zinc-800 "
                          >
                            {wLoading && (
                              <BiLoaderAlt className="animate-spin" />
                            )}
                            Submit
                          </button>

                          <button
                            type="button"
                            className="inline-flex justify-center border border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 "
                            onClick={() => setWithData(undefined)}
                          >
                            Back
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </DashPage>
  )
}

export default Deposit
