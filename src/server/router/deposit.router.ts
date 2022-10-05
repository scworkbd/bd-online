import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { createRouter } from "../context"

export const depositRouter = createRouter()
  .query("deposits", {
    async resolve({ ctx }) {
      const dps = await ctx.prisma.deposit.findMany({
        where: {
          method: {
            not: "referral",
          },
        },
        orderBy: {
          amount: "desc",
        },
      })

      return dps
    },
  })
  .query("depositsWUser", {
    async resolve({ ctx }) {
      const dps = await ctx.prisma.deposit.findMany({
        where: {
          method: {
            not: "referral",
          },
        },
        include: {
          user: true,
        },
      })

      return dps
    },
  })
  .mutation("approveDeposit", {
    input: z.object({
      depId: z.string(),
    }),
    async resolve({ ctx, input }) {
      const dep = await ctx.prisma.deposit.findUnique({
        where: {
          id: input.depId,
        },
        include: {
          user: true,
        },
      })

      if (dep && !dep.approved) {
        const user = await ctx.prisma.user.findUnique({
          where: {
            id: dep.user.id,
          },
        })

        if (user) {
          await ctx.prisma.user.update({
            where: {
              id: user.id,
            },
            data: {
              balance: user.balance + dep.amount,
            },
          })

          await ctx.prisma.deposit.update({
            where: {
              id: dep.id,
            },
            data: {
              approved: true,
              pending: false,
            },
          })
        } else {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          })
        }
      } else {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Deposit not found",
        })
      }
    },
  })
  .mutation("cancelDeposit", {
    input: z.object({
      depId: z.string(),
    }),
    async resolve({ ctx, input }) {
      await ctx.prisma.deposit.update({
        where: {
          id: input.depId,
        },
        data: {
          pending: false,
          approved: false,
        },
      })
    },
  })
  .mutation("undoDepApprove", {
    input: z.object({
      depId: z.string(),
    }),
    async resolve({ ctx, input }) {
      const dep = await ctx.prisma.deposit.findUnique({
        where: {
          id: input.depId,
        },
      })

      if (dep) {
        await ctx.prisma.deposit.update({
          where: {
            id: dep.id,
          },
          data: {
            approved: false,
            pending: false,
          },
        })

        const user = await ctx.prisma.user.findUnique({
          where: {
            id: dep.userId,
          },
        })

        if (user) {
          await ctx.prisma.user.update({
            where: {
              id: user.id,
            },
            data: {
              balance: user.balance - dep.amount,
            },
          })
        }
      }
    },
  })
