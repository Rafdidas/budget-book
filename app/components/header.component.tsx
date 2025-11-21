'use client';

import Link from "next/link";
import { Typography } from "./typography/typography.component";
import Button from "./button/button.component";

export default function Header() {
  return (
    <header className="sticky top-0 z-200 flex items-center h-[60px] bg-surface-container border-b border-outline-low">
      <div className="inner flex justify-between align-center w-full max-w-[1200px] mx-auto my-0">
        <Typography type="headline" size="sm" className="text-on-surface-highest" as="h1">
          <Link href="/">MY BUDGET BOOK 💸</Link>
        </Typography>
        <ul className="flex items-center gap-4">
          {/* 로그인 후 */}
          <li>
            <Typography type="body" size="md">
              유저이름 or 이메일 님 안녕하세요.
            </Typography>
          </li>
          {/* 로그인 후 */}
          <li>
            <Button size="sm" styleTheme="default">
              <Link href="/stats">분석</Link>
            </Button>
          </li>
          {/* 로그인 전 */}
          <li>
            <Button size="sm" styleTheme="default">
              <Link href="/login">로그인</Link>
            </Button>
          </li>
          {/* 로그인 후 */}
          <li>
            <Button size="sm" styleTheme="default">
              로그아웃
            </Button>
          </li>
        </ul>
      </div>
    </header>
  );
}