// app/stats/page.tsx
"use client";

import { Fragment, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useYearlySummary } from "@/hooks/useYearlySummary";
import type { MonthlySummary } from "@/hooks/useYearlySummary";
import Link from "next/link";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

export default function StatsPage() {
  const { user, loading } = useAuth();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());

  const {
    data: summary = [],
    isLoading,
    isError,
    error,
  } = useYearlySummary({
    userId: user?.uid,
    year,
  });

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

  const totalIncome = summary.reduce((sum, m) => sum + m.income, 0);
  const totalExpense = summary.reduce((sum, m) => sum + m.expense, 0);
  const totalBalance = totalIncome - totalExpense;

  return (
    <main className="p-4 max-w-4xl mx-auto space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">연도별 통계</h1>
        <Link href="/" className="text-xs underline">
          ← 가계부로 돌아가기
        </Link>
      </header>

      {/* 연도 선택 */}
      <section className="flex items-center gap-2 text-sm">
        <label>연도</label>
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="border rounded px-2 py-1"
        >
          {Array.from({ length: 3 }).map((_, idx) => {
            const y = today.getFullYear() - idx;
            return (
              <option key={y} value={y}>
                {y}년
              </option>
            );
          })}
        </select>
      </section>

      {/* 연간 합계 박스 */}
      <section className="border rounded p-4 text-sm space-y-1">
        <div>연간 총 수입: {totalIncome.toLocaleString()}원</div>
        <div>연간 총 지출: {totalExpense.toLocaleString()}원</div>
        <div>연간 잔액: {totalBalance.toLocaleString()}원</div>
      </section>

      {/* 그래프 영역 */}
      <section className="border rounded p-4">
        <h2 className="font-semibold mb-3 text-sm">{year}년 월별 수입/지출</h2>

        {isLoading ? (
          <p className="text-sm">불러오는 중...</p>
        ) : isError ? (
          <p className="text-xs text-red-500">{(error as Error).message}</p>
        ) : (
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summary as MonthlySummary[]}>
                <XAxis dataKey="month" tickFormatter={(m) => `${m}월`} />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => `${value.toLocaleString()}원`}
                  labelFormatter={(label) => `${label}월`}
                />
                <Legend />
                <Bar
                  dataKey="expense"
                  name="지출"
                  fill="#f97316" // 주황색
                />
                <Bar
                  dataKey="income"
                  name="수입"
                  fill="#22c55e" // 초록색
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>

      {/* 월별 표 (간단 텍스트) */}
      <section className="border rounded p-4 text-xs">
        <h2 className="font-semibold mb-3 text-sm">{year}년 월별 요약</h2>
        <div className="grid grid-cols-4 gap-y-1">
          <div className="font-semibold">월</div>
          <div className="font-semibold">수입</div>
          <div className="font-semibold">지출</div>
          <div className="font-semibold">잔액</div>
          {summary.map((m) => (
            <Fragment key={m.month}>
              <div>{m.month}월</div>
              <div>{m.income.toLocaleString()}원</div>
              <div>{m.expense.toLocaleString()}원</div>
              <div>{m.balance.toLocaleString()}원</div>
            </Fragment>
          ))}
        </div>
      </section>
    </main>
  );
}
