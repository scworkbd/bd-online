import React, { Fragment, useState } from "react"

import { useRouter } from "next/router"

import { toast } from "react-hot-toast"
import { Packages } from "@prisma/client"
import { Dialog, Transition } from "@headlessui/react"

import { BiChevronRight, BiLoaderAlt, BiPackage } from "react-icons/bi"

import DashPage from "../../components/DashPage"
import { useSettings } from "../../hooks/useSettings"
import CustomToast from "../../components/CustomToast"

import { trpc } from "../../utils/trpc"
import { useAccount } from "../../hooks/useAccount"

const Package = () => {
  const [selPack, setSelPack] = useState<Packages | null>(null)
  const { data: account } = useAccount()
  const { data: settings } = useSettings()
  const { data: packages } = trpc.useQuery(["admin.packages"])
  const router = useRouter()

  const { mutate, isLoading } = trpc.useMutation(["user.subscribe"], {
    onSuccess: () => {
      toast.custom(<CustomToast success message="প্যাকেজ চালু হয়েছে" />)
      router.push("/user/dashboard")
    },
    onError: () => {
      if (account?.current_pack) {
        toast.custom(<CustomToast message="ইতমধ্যে একটি প্যাক চালু আছে" />)
      } else {
        toast.custom(
          <CustomToast message="আপনার পর্যাপ্ত পরিমানে ব্যালেন্স নেই" />
        )
      }
    },
  })

  const startPackage = () => {
    if (!selPack) {
      return
    }

    mutate({
      pack: selPack.id,
    })
  }

  return (
    <DashPage hideFooter>
      <h1 className="text-3xl font-bold text-center">প্যাকেজ সমুহ</h1>
      <div className="grid grid-cols-1 gap-5 p-5">
        {packages?.map((pack) => (
          <div
            className="p-8 bg-gradient-to-r from-rose-500 to-rose-400 border-2 rounded-md shadow-md bg-cover bg-center"
            key={pack.id}
          >
            <h1 className="flex items-center justify-center">
              <BiPackage className="text-5xl text-white" />
            </h1>

            <h2 className="text-3xl font-bold text-center text-rose-100 mt-3">
              {pack.name}
            </h2>

            <div className="rounded-md px-10 py-3 bg-rose-900 text-white text-2xl text-center w-max mx-auto mt-4">
              {pack.price} tk
            </div>

            <ul className="text-center mt-10 text-white text-xl">
              <li>Daily Ads: {pack.daily_limit}</li>
              <li>Daily Income: {pack.daily_limit * pack.per_click}</li>
              <li>Per Click: {pack.per_click} tk</li>
              <li>
                Refer Bonus:{" "}
                {(
                  (pack.price / 100) *
                  (settings ? settings?.referral_commision : 0)
                ).toFixed(0)}{" "}
                tk
              </li>
              <li>Expire: {pack.validity} day</li>
            </ul>

            <div className="flex items-center justify-center mt-5">
              <button
                onClick={() => setSelPack(pack)}
                className="bg-white hover:bg-slate-100 text-black rounded-full flex items-center gap-2 px-5 py-2 text-sm"
              >
                Activate <BiChevronRight className="text-xl" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Transition appear show={selPack ? true : false} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setSelPack(null)}
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
            <div className="flex min-h-full items-end justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden bg-rose-900 p-6 text-left align-middle shadow-xl transition-all text-white">
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-medium leading-6 inline-flex justify-between items-center w-full"
                  >
                    <span className="font-bold">{selPack?.name}</span>
                  </Dialog.Title>
                  <div className="pt-5">
                    <p>আপনি কি সত্যি এই প্যাকেজটিতে বিনিয়োগ করতে চাচ্ছেন?</p>

                    <div className="mt-4 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => startPackage()}
                        className="inline-flex gap-2 justify-center items-center bg-rose-600 px-5 py-2 text-sm font-medium text-white"
                      >
                        {isLoading && <BiLoaderAlt className="animate-spin" />}
                        বিনিয়োগ করুণ
                      </button>

                      <button
                        type="button"
                        className="inline-flex gap-2 justify-center items-center bg-rose-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
                        onClick={() => setSelPack(null)}
                      >
                        বাতিল
                      </button>
                    </div>
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

export default Package
