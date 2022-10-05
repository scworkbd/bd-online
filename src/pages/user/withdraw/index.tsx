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
import CustomToast from "../../../components/CustomToast"

type Methods = "bkash" | "nagad" | "upay"

const Deposit: NextPage = () => {
  const { register, handleSubmit, reset } = useForm<{
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
      toast.custom(
        <CustomToast success message="ক্যাশ আউট রিকুয়েস্ট পাঠানো হয়েছে।" />
      )
      reset()
      refetch()
      setMethod(null)
      setWithData(undefined)
    },
  })

  const [method, setMethod] = useState<"bkash" | "nagad" | "upay" | null>()

  const submitWithdrawal = (values: {
    amount: number
    mobile_number: string
  }) => {
    const amount = Number(values.amount) || 0

    if (!settings) return

    console.log(amount, settings.min_withdraw)

    if (amount < settings.min_withdraw || amount > settings.max_withdraw) {
      return toast.custom(
        <CustomToast
          message={`সর্বনিম্ন ${settings.min_withdraw} টাকা থেকে ${settings.max_withdraw} পর্যন্ত ক্যাশ আউট করা যাবে`}
        />
      )
    }

    if (amount > (account ? account?.balance : 0)) {
      return toast.custom(
        <CustomToast message="পর্যাপ্ত পরিমানে ব্যালেন্স নেই" />
      )
    }

    if (amount && method && account && settings) {
      setWithData({
        amount: Number(values.amount),
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
        toast.custom(<CustomToast message="একাউন্ট এক্টিভ নেই" />)
        router.push("/user/dashboard")
      }
    }
  }, [account, router])

  return (
    <DashPage hideFooter>
      <h1 className="text-2xl font-bold text-center mt-10 mb-5">
        {!settings?.cashout_enabled && <span>{settings?.cashout_notice}</span>}
      </h1>
      {settings?.cashout_enabled && (
        <div className="grid grid-cols-1 gap-5">
          <div onClick={() => setMethod("bkash")} className="text-center">
            <div className="p-3 text-center">
              <Image
                src="/icons/bkash.png"
                width={100}
                height={100}
                alt="bkash"
              />
            </div>
          </div>

          <div onClick={() => setMethod("nagad")} className="text-center">
            <div className="p-3 text-center">
              <Image
                src="/icons/nagad.png"
                width={100}
                height={100}
                alt="bkash"
              />
            </div>
          </div>
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden bg-white rounded-md p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-medium leading-6 text-gray-900 flex items-center justify-between"
                  >
                    <span>ক্যাশ আউট ({method})</span>
                  </Dialog.Title>
                  <div className="pt-5">
                    {!withData ? (
                      <form onSubmit={handleSubmit(submitWithdrawal)}>
                        <div className="flex flex-col gap-3">
                          <input
                            type="text"
                            placeholder="টাকার পরিমান"
                            className="w-full rounded-full border-0 !bg-zinc-100 shadow-md"
                            {...register("amount", {
                              required: {
                                value: true,
                                message: "টাকার পরিমান লিখুন",
                              },
                            })}
                          />

                          <input
                            type="text"
                            placeholder={`আপনার ${method} নাম্বার`}
                            className="w-full rounded-full border-0 !bg-zinc-100 shadow-md"
                            {...register("mobile_number", {
                              required: {
                                value: true,
                                message: "মোবাইল নাম্বার লিখুন",
                              },
                            })}
                          />
                        </div>
                        <div className="mt-4 flex items-center gap-2">
                          <button
                            type="submit"
                            className="bg-green-500 px-4 py-2 text-sm text-white hover:bg-green-600 rounded-full "
                          >
                            পরবর্তি ধাপ
                          </button>

                          <button
                            type="button"
                            className="inline-flex justify-center border border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 rounded-full"
                            onClick={() => {
                              setMethod(null)
                              setWithData(undefined)
                              reset()
                            }}
                          >
                            বাতিল
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div>
                        <p>ওয়ালেটঃ {withData.method}</p>
                        <p>পরিমানঃ {withData.amount}</p>
                        <p>
                          ফিসঃ {withData.fees.toFixed(2)}{" "}
                          <span className="text-sm text-red-500">
                            ({settings?.bkash_percentage}% +
                            {withData.method === "bkash" ? " 10" : " 0"}tk)
                          </span>
                        </p>
                        <p>মোবাইলঃ {withData.mobile_number}</p>

                        <div className="mt-4 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => executeWithdraw()}
                            className="bg-green-500 px-4 py-2 text-sm text-white hover:bg-green-600 rounded-full"
                          >
                            {wLoading && (
                              <BiLoaderAlt className="animate-spin" />
                            )}
                            ঠিক আছে
                          </button>

                          <button
                            type="button"
                            className="rounded-full inline-flex justify-center border border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 "
                            onClick={() => setWithData(undefined)}
                          >
                            বাতিল
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
