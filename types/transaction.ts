
import { Timestamp } from "firebase/firestore";

export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  category: string;
  memo?: string;
  date: Date;
  createdAt: Date;
}

// Firestore에서 가져오는 원본 타입
export interface TransactionFirestore {
  userId: string;
  type: TransactionType;
  amount: number;
  category: string;
  memo?: string;
  date: Timestamp;
  createdAt: Timestamp;
}
