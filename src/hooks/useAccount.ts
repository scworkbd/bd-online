import { useSession } from "next-auth/react"
import { trpc } from "../utils/trpc"

export const useAccount = () => {
  const { data: session, status } = useSession()
  const { data, isLoading, refetch } = trpc.useQuery([
    "user.details",
    {
      username: session?.user?.username as string,
    },
  ])

  if (status === "loading") {
    return { data, isLoading: true, refetch }
  }

  return { data, isLoading, refetch }
}
