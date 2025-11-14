'use client';

import { auth } from "@/lib/firebaseClient";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }

      // 로그인 성공 후 홈으로
      router.push('/');
    } catch (err: any) {
      console.error(err);
      setError(err?.message ?? '로그인 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm border rounded-lg p-6">
        <h1 className="text-xl font-semibold mb-4">
          {mode === "login" ? "로그인" : "회원가입"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">이메일</label>
            <input
              type="email"
              className="w-full border rounded px-3 py-2 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">비밀번호</label>
            <input
              type="password"
              className="w-full border rounded px-3 py-2 text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="text-xs text-red-500 whitespace-pre-line">{error}</p>
          )}

          <button type="submit" disabled={submitting} className="w-full py-2 rounded bg-black text-white text-sm disabled:opacity-60">
            {
              submitting ? '처리 중...' : mode === 'login' ? '로그인' : '회원가입'
            }
          </button>
        </form>

        <button type="button" className="mt-4 text-xs text-gray-600 underline" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
            {mode === 'login' ? '아직 계정이 없다면? 회원가입' : '이미 계정이 있다면? 로그인'}
        </button>
      </div>
    </main>
  );
}