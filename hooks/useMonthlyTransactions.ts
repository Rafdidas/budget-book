'use client';

import { fetchTransactionsByMonth } from "@/lib/transactions";
import { Transaction } from "@/types/transaction";
import { useQuery } from "@tanstack/react-query";

type UseMonthlyTransactionsParams = {
  userId: string | undefined;
  year: number;
  month: number;
};
// 월별 조회
export function useMonthlyTransactions({
  userId,
  year,
  month,
}: UseMonthlyTransactionsParams) {
  return useQuery<Transaction[]>({
    queryKey: ['transactions', userId, year, month],
    queryFn: () => {
      if (!userId) throw new Error('로그인 유저가 없습니다.');
      return fetchTransactionsByMonth({ userId, year, month });
    },
    enabled: !!userId,
  });
}