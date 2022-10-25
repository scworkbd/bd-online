import React, { useState } from "react"
import type { NextPage } from "next"
import Image from "next/image"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { trpc } from "../utils/trpc"
import { useRouter } from "next/router"
import { BiLoaderAlt } from "react-icons/bi"
import CustomToast from "../components/CustomToast"

type Credentials = {
  first_name: string
  last_name: string
  email: string
  phone: string
  username: string
  password_hash: string
  password_hash_again: string
  referrer?: string
}

const Login: NextPage = () => {
  const router = useRouter()
  const refUser = router.query.ref
  const [loading, setLoading] = useState(false)

  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<Credentials>()

  const { mutate } = trpc.useMutation(["user.register"], {
    onError: (error) => {
      toast.custom(<CustomToast message={error.message} />)
      setLoading(false)
    },
    onSuccess: () => {
      setLoading(false)
      toast.custom(
        <CustomToast success message="রেজিস্ট্রেশন সফল হয়েছে। লগিন করুণ" />
      )
      router.push("/login")
    },
  })

  const registerUser = (values: Credentials) => {
    setLoading(true)
    mutate({
      registerData: {
        ...values,
        referrer: refUser ? (refUser as string) : undefined,
      },
    })
  }

  return (
    <div>
      <div className="max-w-lg mx-auto py-20 p-5">
        <div className="flex flex-col items-center justify-center">
          <p className="text-3xl font-bold">Welcome Back!</p>
          <p>Please fill the form</p>
        </div>

        <form
          onSubmit={handleSubmit(registerUser)}
          className="flex flex-col gap-4 mt-10"
        >
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <input
                type="text"
                placeholder="নামের প্রথম অংশ"
                className={`border-2 ${
                  errors.first_name && "border-red-500"
                } border-2 !bg-white`}
                {...register("first_name", {
                  required: true,
                })}
              />
            </div>

            <div className="flex flex-col gap-1">
              <input
                type="text"
                placeholder="নামের দ্বিতীয় অংশ"
                className={`border-2 ${errors.last_name && "border-red-500"}`}
                {...register("last_name", {
                  required: true,
                })}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <input
              type="email"
              placeholder="ইমেইল"
              className={`border-2 ${errors.email && "border-red-500"}`}
              {...register("email", {
                required: true,
              })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <input
                type="text"
                placeholder="মোবাইল নাম্বার"
                className={`border-2 ${errors.phone && "border-red-500"}`}
                {...register("phone", {
                  required: true,
                })}
              />
            </div>

            <div className="flex flex-col gap-1">
              <input
                type="text"
                placeholder="ইউজারনেইম"
                className={`border-2 ${errors.username && "border-red-500"}`}
                {...register("username", {
                  required: true,
                })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <input
                type="password"
                placeholder="পাসওয়ার্ড"
                className={`border-2 ${
                  errors.password_hash && "border-red-500"
                }`}
                {...register("password_hash", {
                  required: true,
                  minLength: 6,
                })}
              />
            </div>

            <div className="flex flex-col gap-1">
              <input
                type="password"
                placeholder="কনফার্ম পাসওয়ার্ড"
                className={`border-2 ${
                  errors.password_hash_again && "border-red-500"
                }`}
                {...register("password_hash_again", {
                  validate: (value: string) => {
                    const values = getValues()
                    return values.password_hash === value
                  },
                })}
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-10">
            <button
              type="submit"
              className="px-7 py-3 w-full bg-rose-600 hover:bg-rose-500 text-white flex items-center gap-2 justify-center"
            >
              রেজিস্ট্রেশন করুণ
            </button>
            <Link href="/login">
              <a className="text-center border-2 border-rose-600 py-3 hover:bg-rose-600 hover:text-white">
                লগিন
              </a>
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
