'use client';

import { auth } from "@/lib/firebaseClient";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 파이어베이스에서 현재 로그인 한 유저를 알려줌
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    })

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth는 AuthProvider 안에서만 사용할 수 있습니다.');
  }
  return ctx;
}