import React, { useEffect, useState } from "react"
import type { NextPage } from "next"
import Image from "next/image"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { signIn } from "next-auth/react"
import { useRouter } from "next/router"
import { BiLoaderAlt, BiLockAlt, BiUser } from "react-icons/bi"
import CustomToast from "../components/CustomToast"

type Credentials = {
  username: string
  password: string
}

const Login: NextPage = () => {
  const { register, handleSubmit } = useForm<Credentials>()
  const [loading, setLoading] = useState(false)

  const login = (values: Credentials) => {
    setLoading(true)
    fetch("/api/user/authenticate", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(values),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          toast.custom(<CustomToast message="ভুল ইউজারনেম অথবা পাসওয়ার্ড" />)
          setLoading(false)
        } else {
          setLoading(true)
          signIn("credentials", { ...values, callbackUrl: "/user/dashboard" })
        }
      })
      .catch(() => {
        setLoading(true)
      })
  }

  return (
    <div>
      <div className="max-w-lg mx-auto py-20 p-5">
        <div className="flex flex-col items-center justify-center">
          <Image src="/logo.png" width={200} height={80} alt="logo" />
          <p>স্বাগতম</p>
        </div>

        <form
          onSubmit={handleSubmit(login)}
          className="flex flex-col gap-4 mt-10"
        >
          <div className="flex items-center gap-1 py-2 px-5 bg-zinc-300 rounded-full ">
            <BiUser />
            <input
              type="text"
              className="w-full !bg-transparent !border-0 !outline-none !ring-0"
              placeholder="ইউজারনেইম"
              {...register("username", {
                required: {
                  value: true,
                  message: "username is required",
                },
              })}
            />
          </div>

          <div className="flex items-center gap-1 py-2 px-5 bg-zinc-300 rounded-full">
            <BiLockAlt />
            <input
              type="password"
              placeholder="পাসওয়ার্ড"
              className="w-full !bg-transparent !border-0 !outline-0 !ring-0"
              {...register("password", {
                required: {
                  value: true,
                  message: "pasword is required",
                },
                minLength: {
                  value: 6,
                  message: "minimum 6 character",
                },
              })}
            />
          </div>

          <div className="flex flex-col gap-5">
            <button
              type="submit"
              className="px-7 py-3 w-full bg-green-600 hover:bg-green-500 text-white flex items-center gap-2 justify-center rounded-full"
            >
              {loading && <BiLoaderAlt className="animate-spin" />}
              লগিন করুণ
            </button>
            <p className="text-center">Or</p>
            <Link href="/register">
              <a className="text-center text-red-500">রেজিস্ট্রেশন</a>
            </Link>
          </div>
        </form>

        <div className="flex flex-col mt-10 text-indigo-600"></div>
      </div>
    </div>
  )
}

export default Login
