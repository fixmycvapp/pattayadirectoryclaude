import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import SessionProvider from "@/components/session-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pattaya Directory - Events & Activities",
  description: "Discover the best events and activities in Pattaya, Thailand",
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
        {children}
        <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}