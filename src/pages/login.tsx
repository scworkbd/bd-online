import React, { useState } from "react"
import type { NextPage } from "next"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { signIn } from "next-auth/react"
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
          <p className="text-3xl font-bold">Welcome Back!</p>
          <p>Login to continue</p>
        </div>

        <form
          onSubmit={handleSubmit(login)}
          className="flex flex-col gap-4 mt-10"
        >
          <div className="flex">
            <input
              type="text"
              className="border-2 border-rose-600
               w-full !bg-transparent !outline-none !ring-0"
              placeholder="ইউজারনেইম"
              {...register("username", {
                required: {
                  value: true,
                  message: "username is required",
                },
              })}
            />
            <div className="bg-rose-600 text-white h-full p-3">
              <BiUser className="text-2xl" />
            </div>
          </div>

          <div className="flex">
            <input
              type="password"
              placeholder="পাসওয়ার্ড"
              className="border-2 border-rose-600
               w-full !bg-transparent !outline-none !ring-0"
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
            <div className="bg-rose-600 text-white h-full p-3">
              <BiLockAlt className="text-2xl" />
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-10">
            <button
              type="submit"
              className="px-7 py-3 w-full bg-rose-600 text-white flex items-center gap-2 justify-center"
            >
              {loading && <BiLoaderAlt className="animate-spin" />}
              লগিন
            </button>
            <Link href="/register">
              <a className="px-7 py-3 w-full border-2 border-rose-600 text-red-600 hover:text-white hover:bg-rose-600 flex items-center gap-2 justify-center">
                রেজিস্ট্রেশন
              </a>
            </Link>
          </div>
        </form>

        <div className="flex flex-col mt-10 text-indigo-600"></div>
      </div>
    </div>
  )
}

export default Login
