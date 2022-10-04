import React, { useState } from "react"
import { toast } from "react-hot-toast"
import { useSettings } from "../hooks/useSettings"
import CustomToast from "./CustomToast"

const CopyNumberForm = ({ method }: { method: "bkash" | "nagad" | "upay" }) => {
  const { data: settings } = useSettings()
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [text, setText] = useState<"Copy" | "Copied">("Copy")

  console.log(settings)

  const copyNumber = () => {
    navigator.clipboard.writeText(inputRef.current?.value as string)
    setText("Copied")
    toast.custom(<CustomToast success message="নাম্বার কপি করা হয়েছে" />)

    setTimeout(() => {
      setText("Copy")
    }, 2000)
  }

  return (
    <div className="grid grid-cols-3 mt-10 gap-3 w-full">
      <input
        ref={inputRef}
        type="text"
        value={
          method === "bkash"
            ? settings?.bkash
            : method === "nagad"
            ? settings?.nagad
            : settings?.upay
        }
        className="px-5 py-2 border-none col-span-2 w-full rounded-l-md !rounded-r-none !bg-transparent text-black"
        disabled
      />
      <button
        onClick={copyNumber}
        className="px-5 py-2 bg-rose-500 text-white rounded-md"
      >
        {text}
      </button>
    </div>
  )
}

export default CopyNumberForm
