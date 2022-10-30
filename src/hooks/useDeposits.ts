import { useSession } from "next-auth/react"
import { trpc } from "../utils/trpc"

export const useDeposit = () => {
  const { data: session, status } = useSession()
  const { data, isLoading } = trpc.useQuery(["user.depositsByUser"])

  if (status === "loading") {
    return { data, isLoading: true }
  }

  return { data, isLoading }
}
