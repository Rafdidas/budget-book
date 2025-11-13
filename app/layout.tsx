import type { Metadata } from "next";
import "./globals.scss";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "나만의 가계부",
  description: "나만의 가계부",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
