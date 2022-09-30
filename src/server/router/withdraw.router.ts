import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { createRouter } from "../context"

export const withdrawRouter = createRouter()
  .query("withdrawsWUser", {
    async resolve({ ctx }) {
      const dps = await ctx.prisma.withdraw.findMany({
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
  .query("withdraws", {
    async resolve({ ctx }) {
      const wth = await ctx.prisma.withdraw.findMany({
        orderBy: {
          updatedAt: "asc",
        },
      })

      return wth
    },
  })
  .mutation("approveWith", {
    input: z.object({
      withId: z.string(),
    }),
    async resolve({ ctx, input }) {
      const dep = await ctx.prisma.withdraw.findUnique({
        where: {
          id: input.withId,
        },
        include: {
          user: true,
        },
      })

      if (dep) {
        await ctx.prisma.withdraw.update({
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
          message: "Withdraw not found",
        })
      }
    },
  })

  .mutation("cancelWith", {
    input: z.object({
      withId: z.string(),
    }),
    async resolve({ ctx, input }) {
      const dep = await ctx.prisma.withdraw.findUnique({
        where: {
          id: input.withId,
        },
        include: {
          user: true,
        },
      })
      await ctx.prisma.withdraw.update({
        where: {
          id: input.withId,
        },
        data: {
          pending: false,
          approved: false,
        },
      })

      if (dep) {
        await ctx.prisma.user.update({
          where: {
            id: dep.user.id,
          },
          data: {
            balance: dep.user.balance + dep.amount,
          },
        })
      }
    },
  })
