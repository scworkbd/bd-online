import { TRPCError } from "@trpc/server"
import { z } from "zod"
import {
  cpUserSchema,
  registerSchema,
  upUserSchema,
} from "../schema/registration.schema"
import { createRouter } from "../context"

export const userRouter = createRouter()
  .mutation("register", {
    input: z.object({
      registerData: registerSchema,
    }),
    async resolve({ ctx, input }) {
      const userName = await ctx.prisma.user.findUnique({
        where: {
          username: input.registerData.username,
        },
      })

      const email = await ctx.prisma.user.findUnique({
        where: {
          email: input.registerData.email,
        },
      })

      const phone = await ctx.prisma.user.findUnique({
        where: {
          phone: input.registerData.phone,
        },
      })

      if (userName) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "অন্য ইউজারনেম দিয়ে চেষ্টা করুণ",
        })
      }

      if (email) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "এই ইমেইল দিয়ে আগে একাউন্ট খোলা হয়েছে",
        })
      }

      if (phone) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "এই ফোন নাম্বার দিয়ে আগে একাউন্ট খোলা হয়েছে",
        })
      }

      const settings = await ctx.prisma.settings.findFirst()

      await ctx.prisma.user.create({
        data: {
          ...input.registerData,
          balance: settings ? settings.registration_bonus : 50,
        },
      })
    },
  })
  .query("details", {
    input: z.object({
      username: z.string(),
    }),
    async resolve({ ctx, input }) {
      const user = await ctx.prisma.user.findUnique({
        where: {
          username: input.username,
        },
      })

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "user not found",
        })
      }

      if (user.current_pack && user.valid_till) {
        const today = new Date()

        if (user.valid_till < today) {
          await ctx.prisma.user.update({
            where: {
              id: user.id,
            },
            data: {
              current_pack: null,
              started_at: null,
              valid_till: null,
            },
          })
        }
      }

      const u = await ctx.prisma.user.findUnique({
        where: {
          username: input.username,
        },
      })

      return u
    },
  })
  .mutation("deposit", {
    input: z.object({
      username: z.string(),
      depositData: z.object({
        amount: z.number(),
        tnx_id: z.string(),
        method: z.enum(["bkash", "nagad", "upay"]),
      }),
    }),
    async resolve({ ctx, input }) {
      const user = await ctx.prisma.user.findUnique({
        where: {
          username: input.username,
        },
      })

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "কিছু একটা সমস্যা হয়েছে, পরে চেষ্টা করুণ",
        })
      }

      const depos = await ctx.prisma.deposit.findUnique({
        where: {
          tnx_id: input.depositData.tnx_id,
        },
      })

      if (depos) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "ভুল ট্রানজেকশন আইডি",
        })
      }

      await ctx.prisma.deposit.create({
        data: {
          userId: user.id,
          date: new Date(),
          pending: true,
          approved: false,
          ...input.depositData,
        },
      })
    },
  })
  .query("depositsByUser", {
    input: z.object({
      userId: z.string(),
    }),
    async resolve({ ctx, input }) {
      const deposits = await ctx.prisma.deposit.findMany({
        where: {
          userId: input.userId,
          method: {
            not: "referral",
          },
        },
      })

      return deposits
    },
  })
  .query("refIncomeByUser", {
    async resolve({ ctx }) {
      const deposits = await ctx.prisma.deposit.findMany({
        where: {
          userId: ctx.session?.user?.id as string,
          method: "referral",
        },
        orderBy: {
          date: "desc"
        }
      })

      return deposits
    },
  })
  .query("withdrawByUser", {
    input: z.object({
      userId: z.string(),
    }),
    async resolve({ ctx, input }) {
      const deposits = await ctx.prisma.withdraw.findMany({
        where: {
          userId: input.userId,
        },
      })

      return deposits
    },
  })
  .mutation("withdraw", {
    input: z.object({
      userId: z.string(),
      amount: z.number().min(300).max(25000),
      method: z.enum(["bkash", "nagad", "upay"]),
      mobile_number: z.string(),
    }),
    async resolve({ ctx, input }) {
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: input.userId,
        },
      })

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "এরর",
        })
      }

      if (!user.current_pack) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "একাউন্ট একটিভ করুণ",
        })
      }

      if (user.balance < input.amount) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "পর্যাপ্ত ব্যালেন্স নেই",
        })
      }

      await ctx.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          balance: user.balance - input.amount,
        },
      })

      const settings = await ctx.prisma.settings.findFirst()
      const fees =
        (parseFloat(input.amount.toFixed(2)) / 100) *
        (settings ? settings.bkash_percentage : 2)

      await ctx.prisma.withdraw.create({
        data: {
          userId: user.id,
          amount: parseFloat(input.amount.toFixed(2)),
          date: new Date(),
          method: input.method,
          mobile_number: input.mobile_number,
          fees:
            parseFloat(fees.toFixed(2)) + (input.method === "bkash" ? 10 : 0),
        },
      })
    },
  })
  .mutation("subscribe", {
    input: z.object({
      pack: z.string(),
    }),
    async resolve({ ctx, input }) {
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: ctx.session?.user?.id as string,
        },
      })

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "এরর",
        })
      }

      const pack = await ctx.prisma.packages.findUnique({
        where: { id: input.pack },
      })

      if (!pack) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "এরর ",
        })
      }

      if (pack.price > user.balance) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "পর্যাপ্ত পরিমানে ব্যালেন্স নেই",
        })
      }

      if (user.current_pack) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "একাউন্ট একটিভ করুণ",
        })
      }

      const current = new Date()
      const future = new Date()
      future.setDate(future.getDate() + pack.validity)

      await ctx.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          current_pack: pack.id,
          started_at: current,
          valid_till: future,
          balance: user.balance - pack.price,
        },
      })

      if (user.referrer) {
        const referrer = await ctx.prisma.user.findUnique({
          where: {
            username: user.referrer,
          },
        })

        const settings = await ctx.prisma.settings.findFirst()

        if (referrer && settings) {
          const amount = (pack.price / 100) * settings.referral_commision

          await ctx.prisma.user.update({
            where: {
              id: referrer.id,
            },
            data: {
              balance: referrer.balance + amount,
            },
          })

          await ctx.prisma.deposit.create({
            data: {
              amount: amount,
              userId: referrer.id,
              pending: false,
              approved: true,
              tnx_id: `ref_${user.username}_${Math.random() * 1000}`,
              method: "referral",
              date: new Date(),
              referrerFullName: user.first_name + ' ' + user.last_name,
              referrerUsername: user.username
            },
          })
        }
      }
    },
  })
  .query("works", {
    async resolve({ ctx }) {
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: ctx.session?.user?.id as string,
        },
      })

      const works = await ctx.prisma.work.findMany({
        where: {
          userId: ctx.session?.user?.id as string,
        },
      })

      if (!user || !user.current_pack) {
        return 0
      }

      const pack = await ctx.prisma.packages.findUnique({
        where: { id: user.current_pack as string },
      })

      const dailyWork = pack ? pack.daily_limit : 0

      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const tomorrow = new Date()
      tomorrow.setHours(23, 59, 59, 0)
      tomorrow.setDate(tomorrow.getDate() + 1)

      const filteredWorks = works.filter(
        (work) => work.date > today && work.date < tomorrow
      )

      return dailyWork - filteredWorks.length
    },
  })
  .mutation("work", {
    async resolve({ ctx }) {
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: ctx.session?.user?.id as string,
        },
      })

      const works = await ctx.prisma.work.findMany({
        where: {
          userId: ctx.session?.user?.id as string,
        },
      })

      if (!user || !user.current_pack) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "আজকের লিমিট শেষ",
        })
      }

      const pack = await ctx.prisma.packages.findUnique({
        where: { id: user.current_pack as string },
      })

      const dailyWork = pack ? pack.daily_limit : 0

      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const tomorrow = new Date()
      tomorrow.setHours(23, 59, 59, 0)
      tomorrow.setDate(tomorrow.getDate() + 1)

      const filteredWorks = works.filter(
        (work) => work.date > today && work.date < tomorrow
      )

      const remainingWorks = dailyWork - filteredWorks.length

      if (remainingWorks > 0 && pack) {
        await ctx.prisma.work.create({
          data: {
            userId: user.id,
            date: new Date(),
          },
        })

        await ctx.prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            balance: user.balance + pack.per_click,
          },
        })
      } else {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "আজকের লিমিট শেষ",
        })
      }
    },
  })
  .query("refs", {
    async resolve({ ctx }) {
      const refs = await ctx.prisma.user.findMany({
        where: {
          referrer: ctx.session?.user?.username as string,
        },
      })

      return refs
    },
  })
  .mutation("updateUser", {
    input: z.object({
      data: upUserSchema,
    }),
    async resolve({ ctx, input }) {
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: ctx.session?.user?.id as string,
        },
      })

      if (user) {
        await ctx.prisma.user.update({
          where: {
            id: user.id,
          },
          data: input.data,
        })
      }
    },
  })

  .mutation("updatePassword", {
    input: z.object({
      data: cpUserSchema,
    }),
    async resolve({ ctx, input }) {
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: ctx.session?.user?.id as string,
        },
      })

      if (user) {
        if (user.password_hash !== input.data.old_pass) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message:"ভুল পাসওয়ার্ড",
          })
        }

        if (input.data.new_pass_conf !== input.data.new_pass) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "দুটি পাসওয়ার্ড একই নয়",
          })
        }

        await ctx.prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            password_hash: input.data.new_pass_conf,
          },
        })
      }
    },
  })
  .query("myorks", {
    async resolve({ ctx }) {
      return await ctx.prisma.work.findMany({
        where: {
          userId: ctx.session?.user?.id as string
        },
        orderBy: {
          date: "desc"
        }
      })
    }
  })