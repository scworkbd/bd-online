import React, { useState } from "react"
import type { NextPage } from "next"
import Image from "next/image"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { trpc } from "../utils/trpc"
import { useRouter } from "next/router"
import { BiLoaderAlt } from "react-icons/bi"

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
      toast.error(error.message)
      setLoading(false)
    },
    onSuccess: () => {
      setLoading(false)
      toast.success("Registration successful. Please login")
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
        <Image
          src="/logo.png"
          width={200}
          height={80}
          alt="logo"
          layout="responsive"
        />

        <form
          onSubmit={handleSubmit(registerUser)}
          className="flex flex-col gap-4 mt-5"
        >
          {refUser && (
            <div className="flex flex-col gap-1">
              <label htmlFor="first_name">Referrer</label>
              <input
                type="text"
                value={refUser}
                disabled
                {...register("referrer")}
              />
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label htmlFor="first_name">First Name</label>
            <input
              type="text"
              className={`${errors.first_name && "border-red-500"}`}
              {...register("first_name", {
                required: true,
              })}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="last_name">Last Name</label>
            <input
              type="text"
              className={`${errors.last_name && "border-red-500"}`}
              {...register("last_name", {
                required: true,
              })}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              className={`${errors.email && "border-red-500"}`}
              {...register("email", {
                required: true,
              })}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="text"
              className={`${errors.phone && "border-red-500"}`}
              {...register("phone", {
                required: true,
              })}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              className={`${errors.username && "border-red-500"}`}
              {...register("username", {
                required: true,
              })}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password_hash">Password</label>

            <input
              type="password"
              className={`${errors.password_hash && "border-red-500"}`}
              {...register("password_hash", {
                required: true,
                minLength: 6,
              })}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password_hash_again">Confirm Password</label>

            <input
              type="password"
              className={`${errors.password_hash_again && "border-red-500"}`}
              {...register("password_hash_again", {
                validate: (value: string) => {
                  const values = getValues()
                  return values.password_hash === value
                },
              })}
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <button
              type="submit"
              className="px-7 py-3 w-full bg-green-500 hover:bg-green-600 text-white flex items-center gap-2 justify-center"
            >
              {loading && <BiLoaderAlt className="animate-spin" />}
              Register
            </button>
            <Link href="/login">
              <a className="px-7 py-3 w-full bg-zinc-700 hover:bg-zinc-800 text-white text-center">
                Login
              </a>
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
