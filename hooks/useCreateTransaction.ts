// hooks/useCreateTransaction.ts
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTransaction } from '@/lib/transactions';
import type { TransactionType } from '@/types/transaction';

type UseCreateTransactionParams = {
  userId?: string;
  year: number;
  month: number;
};

type CreatePayload = {
  type: TransactionType;
  amount: number;
  category: string;
  memo?: string;
  date: Date;
};

export function useCreateTransaction({
  userId,
  year,
  month,
}: UseCreateTransactionParams) {
  const queryClient = useQueryClient();

  return useMutation<void, Error, CreatePayload>({
    mutationFn: (payload) => {
      if (!userId) {
        throw new Error('로그인 유저가 없습니다.');
      }
      return createTransaction({ userId, ...payload });
    },
    onSuccess: () => {
      if (!userId) return;
      queryClient.invalidateQueries({
        queryKey: ['transactions', userId, year, month],
      });
    },
  });
}
