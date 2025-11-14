'use client';

import Link from "next/link";
import { useAuth } from "./context/AuthContext";

export default function HomePage() {
  const { user, loading, logout } = useAuth();

  if (loading) return <div>로딩 중...</div>;

  return(
    <main className="p-4">
      {
        user ? (
          <>
            <p>로그인 된 이메일: {user.email}</p>
            <button className="mt-2 px-3 py-1 border rounded text-sm" onClick={logout}>로그아웃</button>
          </>
        ) : (
          <>
            <p>로그인 되지 않았습니다.</p>
            <Link href={"/login"} className="inline-block mt-2 px-3 py-1 border rounded text-sm">
              로그인 하러가기
            </Link>
          </>
        )
      }
    </main>
  )
}