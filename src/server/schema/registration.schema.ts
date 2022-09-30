import { z } from "zod"

export const registerSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  username: z.string(),
  email: z.string(),
  phone: z.string(),
  password_hash: z.string(),
  referrer: z.string().optional(),
})

export const upUserSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  phone: z.string(),
})

export const cpUserSchema = z.object({
  old_pass: z.string(),
  new_pass: z.string(),
  new_pass_conf: z.string(),
})

export const userUpdateScheama = z.object({
  first_name: z.string(),
  last_name: z.string(),
  username: z.string(),
  email: z.string(),
  phone: z.string(),
  password_hash: z.string(),
  balance: z.number(),
  is_admin: z.boolean(),
  is_banned: z.boolean(),
})

export const packSchema = z.object({
  name: z.string(),
  price: z.number(),
  daily_limit: z.number(),
  per_click: z.number(),
  validity: z.number(),
})
