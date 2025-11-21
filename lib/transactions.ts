// lib/transactions.ts
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "./firebaseClient";
import {
  Transaction,
  TransactionFirestore,
  TransactionType,
} from "@/types/transaction";
import { Timestamp } from "firebase/firestore";

// 추가
export async function createTransaction(params: {
  userId: string;
  type: TransactionType;
  amount: number;
  category: string;
  memo?: string;
  date: Date;
}): Promise<void> {
  const { userId, type, amount, category, memo, date } = params;

  const ref = collection(db, "transactions");

  await addDoc(ref, {
    userId,
    type,
    amount,
    category,
    memo: memo ?? "",
    date: Timestamp.fromDate(date),
    createdAt: Timestamp.fromDate(new Date()),
  });
}

// 조회
export async function fetchTransactionsByMonth(params: {
  userId: string;
  year: number;
  month: number;
}): Promise<Transaction[]> {
  const { userId, year, month } = params;

  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);

  const startTs = Timestamp.fromDate(start);
  const endTs = Timestamp.fromDate(end);

  const ref = collection(db, "transactions");

  const q = query(
    ref,
    where("userId", "==", userId),
    where("date", ">=", startTs),
    where("date", "<", endTs),
    orderBy("date", "asc") // 인덱스 필요
  );

  const snap = await getDocs(q);

  return snap.docs.map((doc) => {
    const data = doc.data() as TransactionFirestore;

    return {
      id: doc.id,
      userId: data.userId,
      type: data.type,
      amount: data.amount,
      category: data.category,
      memo: data.memo ?? "",
      date: data.date.toDate(),
      createdAt: data.createdAt.toDate(),
    } satisfies Transaction;
  });
}

export async function fetchTransactionsByYear(params: {
  userId: string;
  year: number;
}): Promise<Transaction[]> {
  const { userId, year } = params;

  const start = new Date(year, 0, 1);      // 1월 1일
  const end = new Date(year + 1, 0, 1);    // 다음해 1월 1일

  const startTs = Timestamp.fromDate(start);
  const endTs = Timestamp.fromDate(end);

  const ref = collection(db, "transactions");

  const q = query(
    ref,
    where("userId", "==", userId),
    where("date", ">=", startTs),
    where("date", "<", endTs),
    orderBy("date", "asc")
  );

  const snap = await getDocs(q);

  return snap.docs.map((doc) => {
    const data = doc.data() as TransactionFirestore;

    return {
      id: doc.id,
      userId: data.userId,
      type: data.type,
      amount: data.amount,
      category: data.category,
      memo: data.memo ?? "",
      date: data.date.toDate(),
      createdAt: data.createdAt.toDate(),
    } satisfies Transaction;
  });
}
