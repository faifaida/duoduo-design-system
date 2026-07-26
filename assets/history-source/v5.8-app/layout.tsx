import type { Metadata } from "next";
import "./globals.css";
import "./v5-tail.css";
import { LocaleProvider } from "./components/LocaleProvider";

export const metadata: Metadata = {
  title: "DUODUO — 多多的未完成实验",
  description:
    "Stories, work and unfinished experiments from a life exploring how to live freely while staying rooted in the real world.",
  icons: {
    icon: "/brand/duoduo-symbol.png",
    shortcut: "/brand/duoduo-symbol.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
