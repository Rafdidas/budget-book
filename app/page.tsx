// app/page.tsx
"use client";

import { useState, useMemo } from "react";
import { useAuth } from "./context/AuthContext";
import { useMonthlyTransactions } from "@/hooks/useMonthlyTransactions";
import { useCreateTransaction } from "@/hooks/useCreateTransaction";
import type { TransactionType } from "@/types/transaction";
import Link from "next/link";

export default function HomePage() {
  const { user, loading } = useAuth();

  // 초기 연/월: 오늘 기준
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1); // 1~12

  // 월별 데이터
  const {
    data: transactions = [],
    isLoading,
    isError,
    error,
  } = useMonthlyTransactions({
    userId: user?.uid,
    year,
    month,
  });

  // 등록 mutation
  const {
    mutate: addTransaction,
    isPending: isSaving,
    error: saveError,
  } = useCreateTransaction({
    userId: user?.uid,
    year,
    month,
  });

  // 폼 상태
  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [memo, setMemo] = useState("");
  const [date, setDate] = useState(
    today.toISOString().slice(0, 10) // yyyy-MM-dd
  );

  // 합계 계산
  const { incomeTotal, expenseTotal, balance } = useMemo(() => {
    let income = 0;
    let expense = 0;

    transactions.forEach((t) => {
      if (t.type === "income") income += t.amount;
      else expense += t.amount;
    });

    return {
      incomeTotal: income,
      expenseTotal: expense,
      balance: income - expense,
    };
  }, [transactions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = Number(amount);
    if (!amountNum || amountNum <= 0) return; // 여기 나중에 에러메시지로 바꿔도 됨

    addTransaction(
      {
        type,
        amount: amountNum,
        category,
        memo,
        date: new Date(date),
      },
      {
        onSuccess: () => {
          setAmount("");
          setCategory("");
          setMemo("");
          // date는 그대로 오늘 유지해도 됨
        },
      }
    );
  };

  if (loading) {
    return <main className="p-4">로그인 상태 확인 중...</main>;
  }

  if (!user) {
    return (
      <main className="p-4">
        <p>로그인이 필요합니다.</p>
        <Link href="/login" className="underline text-sm">
          로그인 페이지로 이동
        </Link>
      </main>
    );
  }

  return (
    <main className="p-4 max-w-3xl mx-auto space-y-6">
      {/* 연/월 선택 영역 */}
      <section className="flex items-center gap-2">
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="border rounded px-2 py-1 text-sm"
        >
          {/* 일단 최근 3년 정도만 */}
          {Array.from({ length: 3 }).map((_, idx) => {
            const y = today.getFullYear() - idx;
            return (
              <option key={y} value={y}>
                {y}년
              </option>
            );
          })}
        </select>

        <select
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          className="border rounded px-2 py-1 text-sm"
        >
          {Array.from({ length: 12 }).map((_, idx) => {
            const m = idx + 1;
            return (
              <option key={m} value={m}>
                {m}월
              </option>
            );
          })}
        </select>
      </section>

      {/* 합계 영역 */}
      <section className="border rounded p-4 text-sm space-y-1">
        <div className="text-(--orange-high)">총 수입: {incomeTotal.toLocaleString()}원</div>
        <div>총 지출: {expenseTotal.toLocaleString()}원</div>
        <div>잔액: {balance.toLocaleString()}원</div>
        <Link href="/stats" className="text-xs underline">
          연도별 통계 보러가기
        </Link>
      </section>

      {/* 입력 폼 */}
      <section className="border rounded p-4">
        <h2 className="font-semibold mb-3 text-sm">새 내역 추가</h2>
        <form className="grid gap-2 text-sm" onSubmit={handleSubmit}>
          <div className="flex gap-2">
            <select
              value={type}
              onChange={(e) => setType(e.target.value as TransactionType)}
              className="border rounded px-2 py-1"
            >
              <option value="expense">지출</option>
              <option value="income">수입</option>
            </select>

            <input
              type="number"
              className="border rounded px-2 py-1 flex-1"
              placeholder="금액"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              className="border rounded px-2 py-1 flex-1"
              placeholder="카테고리 (예: 식비, 급여)"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
            <input
              type="date"
              className="border rounded px-2 py-1"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <textarea
            className="border rounded px-2 py-1 text-sm"
            placeholder="메모 (선택)"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            rows={2}
          />

          {saveError && (
            <p className="text-xs text-red-500">{(saveError as Error).message}</p>
          )}

          <button
            type="submit"
            disabled={isSaving}
            className="mt-2 w-full border rounded py-2 text-sm bg-black text-white disabled:opacity-60"
          >
            {isSaving ? "저장 중..." : "내역 추가"}
          </button>
        </form>
      </section>

      {/* 리스트 영역 */}
      <section className="border rounded p-4 text-sm">
        <h2 className="font-semibold mb-3 text-sm">
          {year}년 {month}월 내역 ({transactions.length}건)
        </h2>
        {isLoading ? (
          <p>불러오는 중...</p>
        ) : isError ? (
          <p className="text-red-500 text-xs">{(error as Error).message}</p>
        ) : transactions.length === 0 ? (
          <p>등록된 내역이 없습니다.</p>
        ) : (
          <ul className="space-y-2">
            {transactions.map((t) => (
              <li
                key={t.id}
                className="flex items-center justify-between border-b pb-1 text-xs last:border-b-0"
              >
                <div>
                  <div>
                    {t.type === "income" ? "➕" : "➖"} {t.category} (
                    {t.amount.toLocaleString()}원)
                  </div>
                  {t.memo && <div className="text-gray-500 text-[11px]">{t.memo}</div>}
                </div>
                <div className="text-[11px]">{t.date.toLocaleDateString("ko-KR")}</div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
