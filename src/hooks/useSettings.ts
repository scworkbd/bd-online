import { trpc } from "../utils/trpc"

export const useSettings = () => {
  const { data, isLoading, refetch } = trpc.useQuery(["settings.settings"])

  return { data, isLoading, refetch }
}
