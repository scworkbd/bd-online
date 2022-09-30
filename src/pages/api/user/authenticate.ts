import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "../../../server/db/client"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const data: { username: string; password: string } = req.body
  const user = await prisma.user.findUnique({
    where: {
      username: data.username,
    },
  })

  if (user && user.password_hash == data.password) {
    return res.json({ sucecss: true })
  }

  res.json({ success: false, error: "Username or password wrong" })
}
