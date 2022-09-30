import React, { useState } from "react"
import { toast } from "react-hot-toast"
import { useSettings } from "../hooks/useSettings"

const CopyNumberForm = ({ method }: { method: "bkash" | "nagad" | "upay" }) => {
  const { data: settings } = useSettings()
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [text, setText] = useState<"Copy" | "Copied">("Copy")

  const copyNumber = () => {
    navigator.clipboard.writeText(inputRef.current?.value as string)
    setText("Copied")
    toast.success("Number copied to clipboard")

    setTimeout(() => {
      setText("Copy")
    }, 2000)
  }

  return (
    <div className="grid grid-cols-3 my-2 w-full">
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
        className="px-5 py-2 border-none bg-zinc-200 col-span-2 w-full rounded-l-md !rounded-r-none"
        disabled
      />
      <button
        onClick={copyNumber}
        className="px-5 py-2 bg-black text-white rounded-r-md"
      >
        {text}
      </button>
    </div>
  )
}

export default CopyNumberForm
