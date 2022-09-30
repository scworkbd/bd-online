import React, { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import { trpc } from "../utils/trpc"
import { useRouter } from "next/router"
const Timer = () => {
  const adsDuration = 5
  const [remainingTime, setRemainingTime] = useState(adsDuration)
  const router = useRouter()

  const { mutate } = trpc.useMutation(["user.work"], {
    onSuccess: () => {
      toast.success("Ads দেখা সফল হয়েছে।")
      router.push("/user/ptc")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log("Watch done")
      clearInterval(interval)
      setRemainingTime(0)
      mutate()
    }, adsDuration * 1000)

    const interval = setInterval(() => {
      setRemainingTime((prev) => prev - 1)
    }, 1000)

    return () => {
      clearTimeout(timer)
      clearInterval(interval)
      console.log("Timeout cleared")
    }
  }, [mutate])

  return (
    <div className="py-10 flex items-center justify-center flex-col gap-2">
      <p>Please wait</p>
      <div className="w-20 bg-black text-white rounded-full aspect-square flex items-center justify-center">
        <h1 className="text-4xl font-black">{remainingTime}</h1>
      </div>
    </div>
  )
}

export default Timer
