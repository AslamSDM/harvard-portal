"use client";
import type { Metadata } from "next";
import { Petrona } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import Navbar from "@/components/Navbar/Navbar";
const inter = Petrona({ subsets: ["latin"] });

const metadata: Metadata = {
  title: "Harvard Portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <Navbar />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
