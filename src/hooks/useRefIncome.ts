import { trpc } from "../utils/trpc"

export const useRefIncome = () => {
  const { data, isLoading } = trpc.useQuery(["user.refIncomeByUser"])

  return { data, isLoading }
}
