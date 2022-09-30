import React from "react"
import AdminPage from "../../../components/AdminPage"
import { trpc } from "../../../utils/trpc"
import { useForm } from "react-hook-form"
import { Packages } from "@prisma/client"
import { toast } from "react-hot-toast"
import { BiLoaderAlt } from "react-icons/bi"

const EditUser = () => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<Packages>()

  const { mutate, isLoading } = trpc.useMutation(["admin.createPack"], {
    onSuccess: () => {
      toast.success("Package Created")
      reset()
    },
  })

  const create = (values: Packages) => {
    mutate({
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
      <form onSubmit={handleSubmit(create)}>
        <div className="w-full max-w-md mx-auto flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label>Name</label>
            <input
              className={`${errors.name && "!border-red-500"}`}
              type="text"
              placeholder="Name"
              {...register("name", { required: true })}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label>Price</label>
            <input
              className={`${errors.price && "!border-red-500"}`}
              type="number"
              placeholder="Price"
              {...register("price", { required: true })}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label>Daily Limit (Ads)</label>
            <input
              className={`${errors.daily_limit && "!border-red-500"}`}
              type="number"
              placeholder="Daily Limit (Ads)"
              {...register("daily_limit", { required: true })}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label>Per Click</label>
            <input
              className={`${errors.per_click && "!border-red-500"}`}
              type="number"
              placeholder="Per Click"
              {...register("per_click", { required: true })}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label>Validity (Expiry)</label>
            <input
              className={`${errors.validity && "!border-red-500"}`}
              type="number"
              placeholder="Validity (Expiry)"
              {...register("validity", { required: true })}
            />
          </div>

          <div>
            <button
              type="submit"
              className="px-7 py-3 bg-black text-white rounded-md flex items-center gap-2"
            >
              {isLoading && <BiLoaderAlt className="animate-spin" />}
              Create Pack
            </button>
          </div>
        </div>
      </form>
    </AdminPage>
  )
}

export default EditUser
