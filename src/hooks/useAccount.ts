import { trpc } from "../utils/trpc"

export const useAccount = () => {
  const { data, isLoading, refetch } = trpc.useQuery(["user.details"])

  return { data, isLoading, refetch }
}
