import { Transaction, TransactionFirestore, TransactionType } from "@/types/transaction";
import { db } from "./firebaseClient";
import { addDoc, collection, getDocs, orderBy, query, Timestamp, where } from "firebase/firestore";

// 1) 트랜잭션 추가
export async function createTransaction(params: {
  userId: string;
  type: TransactionType;
  amount: number;
  category: string;
  memo?: string;
  date: Date; // 실제 사용일
}): Promise<void> {
  const { userId, type, amount, category, memo, date } = params;

  const ref = collection(db, 'transactions');

  await addDoc(ref, {
    userId,
    type,
    amount,
    category,
    memo: memo ?? '',
    date: Timestamp.fromDate(date),
    createdAt: Timestamp.fromDate(new Date()),
  });
}

// 2) 특정 연/월의 트랜잭션 목록 가져오기
export async function fetchTransactionsByMonth(params: {
  userId: string;
  year: number;
  month: number;
}): Promise<Transaction[]> {
  const { userId, year, month } = params;

  // 해당 월의 시작/끝 날짜 계산
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);

  const ref = collection(db, 'transactions');

  const q = query(
    ref,
    where('userId', '==', userId),
    where('date', '>=', start),
    where('date', '<', end),
    orderBy('date', 'asc'),
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