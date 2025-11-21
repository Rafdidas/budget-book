// hooks/useYearlySummary.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchTransactionsByYear } from "@/lib/transactions";
import type { Transaction } from "@/types/transaction";

export type MonthlySummary = {
  month: number;     // 1~12
  income: number;
  expense: number;
  balance: number;
};

type UseYearlySummaryParams = {
  userId: string | undefined;
  year: number;
};

export function useYearlySummary({ userId, year }: UseYearlySummaryParams) {
  return useQuery<MonthlySummary[]>({
    queryKey: ["yearly-summary", userId, year],
    queryFn: async () => {
      if (!userId) return [];

      const txs: Transaction[] = await fetchTransactionsByYear({
        userId,
        year,
      });

      // 1~12월 기본 틀
      const base: MonthlySummary[] = Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        income: 0,
        expense: 0,
        balance: 0,
      }));

      txs.forEach((t) => {
        const idx = t.date.getMonth(); // 0~11
        if (idx < 0 || idx > 11) return;

        if (t.type === "income") {
          base[idx].income += t.amount;
        } else {
          base[idx].expense += t.amount;
        }
        base[idx].balance = base[idx].income - base[idx].expense;
      });

      return base;
    },
    enabled: !!userId,
  });
}
