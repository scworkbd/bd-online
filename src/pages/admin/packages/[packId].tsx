import React, { useEffect } from "react"
import AdminPage from "../../../components/AdminPage"
import { trpc } from "../../../utils/trpc"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import { Packages } from "@prisma/client"
import { toast } from "react-hot-toast"
import { BiLoaderAlt } from "react-icons/bi"

const EditPack = () => {
  const router = useRouter()
  const packId = router.query.packId
  const { register, reset, handleSubmit } = useForm<Packages>()

  const { data: pack } = trpc.useQuery([
    "admin.packageById",
    { packId: packId as string },
  ])
  const { mutate, isLoading } = trpc.useMutation(["admin.updatePack"], {
    onSuccess: () => {
      toast.success("Package Created")
      reset()
    },
  })

  useEffect(() => {
    if (pack) {
      reset(pack)
    }
  }, [pack, reset])

  const update = (values: Packages) => {
    mutate({
      packId: packId as string,
      data: {
        name: values.name,
        price: Number(values.price),
        per_click: Number(values.per_click),
        daily_limit: Number(values.daily_limit),
        validity: Number(values.validity),
      },
    })
  }

  return (
    <AdminPage>
      <form onSubmit={handleSubmit(update)}>
        <div className="w-full max-w-md mx-auto flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label>Name</label>
            <input type="text" placeholder="Name" {...register("name")} />
          </div>

          <div className="flex flex-col gap-2">
            <label>Price</label>
            <input type="number" placeholder="Price" {...register("price")} />
          </div>

          <div className="flex flex-col gap-2">
            <label>Daily Limit (Ads)</label>
            <input
              type="number"
              placeholder="Daily Limit (Ads)"
              {...register("daily_limit")}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label>Per Click</label>
            <input
              type="number"
              placeholder="Per Click"
              {...register("per_click")}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label>Validity (Expiry)</label>
            <input
              type="number"
              placeholder="Validity (Expiry)"
              {...register("validity")}
            />
          </div>

          <div>
            <button
              type="submit"
              className="px-7 py-3 bg-black text-white rounded-md flex items-center gap-2"
            >
              {isLoading && <BiLoaderAlt className="animate-spin" />}
              Save
            </button>
          </div>
        </div>
      </form>
    </AdminPage>
  )
}

export default EditPack
