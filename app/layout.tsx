import type { Metadata } from "next";
import "./globals.scss";
import Providers from "./providers";
import Header from "./components/header.component";

export const metadata: Metadata = {
  title: "나만의 가계부",
  description: "나만의 가계부",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <Header/>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
