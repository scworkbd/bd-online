import React from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import AdminPage from "../../components/AdminPage"
import { trpc } from "../../utils/trpc"

const Ads = () => {
  const { data: deposits, refetch } = trpc.useQuery(["admin.ads"])
  const { register, reset, handleSubmit } = useForm<{
    videoId: string
  }>()

  const { mutate: createAds } = trpc.useMutation(["admin.createAds"], {
    onSuccess: () => {
      toast.success("Video Added")
      refetch()
      reset()
    },
  })

  const { mutate: delAds } = trpc.useMutation(["admin.delAds"], {
    onSuccess: () => {
      toast.success("Video deleted")
      refetch()
    },
  })

  const addAds = (values: { videoId: string }) => {
    if (deposits && deposits.find((dep) => dep.videoId === values.videoId)) {
      toast.error("Video already added")
      return
    }

    createAds({
      videoId: values.videoId,
    })
  }

  return (
    <AdminPage>
      <form onSubmit={handleSubmit(addAds)} className="mb-10">
        <div className="flex gap-2">
          <input
            type="text"
            className="w-full"
            placeholder="Video ID"
            {...register("videoId", { required: true })}
          />

          <button className="px-5 py-2 bg-black text-white whitespace-nowrap rounded-md">
            Add Video
          </button>
        </div>
      </form>
      <table className="w-full">
        <thead className="bg-black text-white">
          <tr>
            <td className="px-5 py-2 whitespace-nowrap w-6">SL</td>
            <td className="px-5 py-2 whitespace-nowrap">Video Id</td>
            <td className="px-5 py-2">Action</td>
          </tr>
        </thead>
        <tbody>
          {deposits?.map((dep, index) => (
            <tr key={dep.videoId} className="odd:bg-zinc-200">
              <td className="px-5 py-2">{index + 1}</td>
              <td className="px-5 py-2">{dep.videoId}</td>
              <td className="px-5 py-2 whitespace-nowrap">
                <button
                  onClick={() => {
                    const x = confirm("Are you sure?")
                    if (x) {
                      delAds({ videoId: dep.videoId })
                    }
                  }}
                  className="px-3 py-1 bg-red-500 text-white font-bold rounded-md"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminPage>
  )
}

export default Ads
