import { z } from "zod"
import { packSchema, userUpdateScheama } from "../schema/registration.schema"
import { createRouter } from "../context"

export const adminRouter = createRouter()
  .query("users", {
    async resolve({ ctx }) {
      const usr = await ctx.prisma.user.findMany({
        orderBy: {
          username: "asc",
        },
      })

      return usr
    },
  })
  .mutation("banUnban", {
    input: z.object({
      id: z.string(),
      status: z.boolean(),
    }),
    async resolve({ ctx, input }) {
      await ctx.prisma.user.update({
        where: {
          id: input.id,
        },
        data: {
          is_banned: !input.status,
        },
      })
    },
  })
  .query("userById", {
    input: z.object({
      userId: z.string(),
    }),
    async resolve({ ctx, input }) {
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: input.userId,
        },
      })

      return user
    },
  })
  .mutation("updateUserByid", {
    input: z.object({
      userId: z.string(),
      data: userUpdateScheama,
    }),
    async resolve({ ctx, input }) {
      await ctx.prisma.user.update({
        where: {
          id: input.userId,
        },
        data: input.data,
      })
    },
  })
  .query("packages", {
    async resolve({ ctx }) {
      return await ctx.prisma.packages.findMany()
    },
  })
  .mutation("createPack", {
    input: z.object({
      data: packSchema,
    }),
    async resolve({ ctx, input }) {
      await ctx.prisma.packages.create({
        data: input.data,
      })
    },
  })
  .query("packageById", {
    input: z.object({
      packId: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.packages.findUnique({
        where: { id: input.packId },
      })
    },
  })
  .mutation("updatePack", {
    input: z.object({
      packId: z.string(),
      data: packSchema,
    }),
    async resolve({ ctx, input }) {
      await ctx.prisma.packages.update({
        where: {
          id: input.packId,
        },
        data: input.data,
      })
    },
  })
  .mutation("delPack", {
    input: z.object({
      packId: z.string(),
    }),
    async resolve({ ctx, input }) {
      const pack = await ctx.prisma.packages.findUnique({
        where: {
          id: input.packId,
        },
      })

      await ctx.prisma.packages.delete({
        where: {
          id: input.packId,
        },
      })

      if (pack) {
        await ctx.prisma.user.updateMany({
          where: {
            current_pack: pack.id,
          },
          data: {
            current_pack: null,
            valid_till: null,
            started_at: null,
          },
        })
      }
    },
  })
  .query("ads", {
    async resolve({ ctx }) {
      return await ctx.prisma.ads.findMany()
    },
  })
  .mutation("createAds", {
    input: z.object({
      videoId: z.string(),
    }),
    async resolve({ ctx, input }) {
      await ctx.prisma.ads.create({
        data: {
          videoId: input.videoId,
        },
      })
    },
  })
  .mutation("delAds", {
    input: z.object({
      videoId: z.string(),
    }),
    async resolve({ ctx, input }) {
      await ctx.prisma.ads.delete({
        where: {
          videoId: input.videoId,
        },
      })
    },
  })
