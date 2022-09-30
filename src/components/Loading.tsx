import React from "react"
import { BiLoaderAlt } from "react-icons/bi"

const Loading = () => {
  return (
    <div className="w-full h-screen grid place-items-center">
      <BiLoaderAlt className="text-4xl animate-spin text-white" />
    </div>
  )
}

export default Loading
