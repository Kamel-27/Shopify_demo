import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lumen — Headless Shopify Storefront",
  description:
    "A headless storefront built with Next.js and the Shopify Storefront API.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Suspense fallback={<div className="h-[65px] border-b border-white/10" />}>
          <Navbar />
        </Suspense>
        <main className="flex-1">{children}</main>
        <footer className="mt-20 border-t border-white/10">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-10 text-sm text-white/40 sm:flex-row sm:items-center sm:justify-between">
            <p>
              <span className="font-semibold text-white/70">Lumen</span> — demo
              storefront, not a real shop.
            </p>
            <p>
              Built with Next.js + Shopify Storefront API.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
