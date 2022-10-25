import React, { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import { trpc } from "../utils/trpc"
import { useRouter } from "next/router"
import CustomToast from "./CustomToast"
const Timer = () => {
  const adsDuration = 5
  const [remainingTime, setRemainingTime] = useState(adsDuration)
  const router = useRouter()

  const { mutate } = trpc.useMutation(["user.work"], {
    onSuccess: () => {
      toast.custom(
        <CustomToast
          success
          message="একটি এডস দেখার টাকা ব্যালেন্স এ যুক্ত হয়েছে"
        />
      )
      router.push("/user/ptc")
    },
    onError: (error) => {
      toast.custom(<CustomToast message={error.message} />)
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
      <p>অপেক্ষা করুন</p>
      <div
        className="w-full bg-rose-900 h-10 py-3"
        style={{ width: `${remainingTime * 20}%` }}
      ></div>
    </div>
  )
}

export default Timer
