// hooks/useCreateTransaction.ts
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTransaction } from '@/lib/transactions';
import type { TransactionType } from '@/types/transaction';

type UseCreateTransactionParams = {
  userId: string | undefined;
  year: number;
  month: number;
};

export function useCreateTransaction({
  userId,
  year,
  month,
}: UseCreateTransactionParams) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: {
      type: TransactionType;
      amount: number;
      category: string;
      memo?: string;
      date: Date;
    }) => {
      if (!userId) {
        return Promise.reject(new Error('로그인 유저가 없습니다.'));
      }
      return createTransaction({ userId, ...payload });
    },
    onSuccess: () => {
      if (!userId) return;
      // 현재 연/월 데이터 리프레시
      queryClient.invalidateQueries({
        queryKey: ['transactions', userId, year, month],
      });
    },
  });

  return mutation;
}
