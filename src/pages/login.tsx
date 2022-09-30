import React, { useEffect, useState } from "react"
import type { NextPage } from "next"
import Image from "next/image"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { signIn } from "next-auth/react"
import { useRouter } from "next/router"
import { BiLoaderAlt } from "react-icons/bi"

type Credentials = {
  username: string
  password: string
}

const Login: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Credentials>()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const error = router.query.error

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
          toast.error(data.error)
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

  useEffect(() => {
    if (error) {
      toast.error(error as string)
    }
  }, [error])

  return (
    <div>
      <div className="max-w-lg mx-auto py-20 p-5">
        <Image
          src="/logo.png"
          width={200}
          height={80}
          alt="logo"
          layout="responsive"
        />

        <form
          onSubmit={handleSubmit(login)}
          className="flex flex-col gap-4 mt-5"
        >
          <div className="flex flex-col gap-1">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              {...register("username", {
                required: {
                  value: true,
                  message: "username is required",
                },
              })}
            />
            <span className="text-sm text-red-500">
              {errors.username?.message}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password">Password</label>
            <input
              type="password"
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
            <span className="text-sm text-red-500">
              {errors.password?.message}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <button
              type="submit"
              className="px-7 py-3 w-full bg-indigo-500 hover:bg-indigo-600 text-white flex items-center gap-2 justify-center"
            >
              {loading && <BiLoaderAlt className="animate-spin" />}
              Login
            </button>
            <Link href="/register">
              <a className="px-7 py-3 w-full bg-zinc-700 hover:bg-zinc-800 text-white text-center">
                Register
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
