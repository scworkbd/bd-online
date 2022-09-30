import { NextApiRequest, NextApiResponse } from "next/types"
// import { createTransport } from "nodemailer"
// import { prisma } from "../../server/db/client"

// const transport = createTransport("SMTP", {
//   service: "hotmail",
//   auth: {
//     user: "websitework155@outlook.com",
//     pass: "back2you@",
//   },
// })
// const sendMail = async (message: any) => {
//   return new Promise((resolve, reject) => {
//     transport.sendMail(message, (error: any, info: any) => {
//       if (error) {
//         console.log(`Error ${error}`)
//         resolve(false)
//       } else {
//         console.log(`Email sent ${info.response}`)
//         resolve(true)
//       }
//     })
//   })
// }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.json({ error: "Method not allowed" })
  }

  // const { email } = req.body
  // const user = await prisma.user.findUnique({
  //   where: {
  //     email: email,
  //   },
  // })
  // if (!user) {
  //   res.json({
  //     success: false,
  //     message: "Invalid email",
  //   })
  // }
  // const message = {
  //   from: `BD Work <websitework155@outlook.com>`,
  //   replyTo: email,
  //   to: email,
  //   subject: "Workbd Password Reset",
  //   etxt: "text",
  // }

  // const sent = await sendMail(message)

  // if (sent) {
  //   res.json({
  //     success: true,
  //     message:
  //       "Mail sent successfully. You will get a reply on your email soon",
  //   })
  // } else {
  //   res.json({
  //     success: false,
  //     message: "Unable to send mail. Please try again",
  //   })
  // }
}
