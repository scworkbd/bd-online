import React, { Fragment, useState } from "react"
import DashPage from "../../components/DashPage"

import { Dialog, Transition } from "@headlessui/react"
import { BiLoaderAlt } from "react-icons/bi"
import { trpc } from "../../utils/trpc"
import { toast } from "react-hot-toast"
import { useRouter } from "next/router"
import { Packages } from "@prisma/client"
import { useSettings } from "../../hooks/useSettings"
import { BsCheck2Circle } from "react-icons/bs"

const Package = () => {
  const [selPack, setSelPack] = useState<Packages | null>(null)
  const { data: settings } = useSettings()
  const { data: packages } = trpc.useQuery(["admin.packages"])
  const router = useRouter()

  const { mutate, isLoading } = trpc.useMutation(["user.subscribe"], {
    onSuccess: () => {
      setSelPack(null)
      toast.success("প্যাকেজ একটিভ হয়েছে")
      router.push("/user/dashboard")
    },
    onError: (error) => {
      toast.error(error.message)
      setSelPack(null)
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
      <div className="grid grid-cols-1 gap-5 p-10">
        {packages?.map((pack) => (
          <div className="p-10 bg-zinc-700" key={pack.id}>
            <div className="flex items-center justify-between">
              <h2 className="text-center font-bold text-3xl text-rose-500">
                {pack.name}
              </h2>
              <h2 className="text-center text-lg">{pack.price} BDT</h2>
            </div>

            <ul className="mt-5">
              <li className="flex items-center gap-2">
                <BsCheck2Circle className="text-green-500" /> Daily Video:{" "}
                {pack.daily_limit}
              </li>
              <li className="flex items-center gap-2">
                <BsCheck2Circle className="text-green-500" /> Per Ad:{" "}
                {pack.per_click} BDT
              </li>
              <li className="flex items-center gap-2">
                <BsCheck2Circle className="text-green-500" /> Daily Income:{" "}
                {pack.daily_limit * pack.per_click} BDT
              </li>
              <li className="flex items-center gap-2">
                <BsCheck2Circle className="text-green-500" /> Referral
                Comission:{" "}
                {(
                  (pack.price / 100) *
                  (settings ? settings?.referral_commision : 0)
                ).toFixed(2)}{" "}
                BDT
              </li>
              <li className="flex items-center gap-2">
                <BsCheck2Circle className="text-green-500" /> Validity:{" "}
                {pack.validity} Days
              </li>
            </ul>

            <button
              onClick={() => setSelPack(pack)}
              className="px-5 py-3 bg-zinc-900 hover:bg-zinc-800 text-white mt-5"
            >
              Start Package
            </button>
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
                    className="text-xl font-medium leading-6 text-white inline-flex justify-between items-center w-full"
                  >
                    <span>Activate packae?</span>
                  </Dialog.Title>
                  <div className="pt-5">
                    <p>Are you sure to subscribe this plan?</p>

                    <div className="mt-4 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => startPackage()}
                        className="inline-flex gap-2 justify-center items-center bg-zinc-800 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
                      >
                        {isLoading && <BiLoaderAlt className="animate-spin" />}
                        Activate
                      </button>

                      <button
                        type="button"
                        className="inline-flex gap-2 justify-center items-center bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
                        onClick={() => setSelPack(null)}
                      >
                        Back
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
