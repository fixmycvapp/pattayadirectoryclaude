import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pattaya Directory - Discover Events in Pattaya",
  description: "Find the best concerts, festivals, nightlife, sports events and local markets in Pattaya, Thailand",
  keywords: ["Pattaya", "events", "concerts", "festivals", "nightlife", "Thailand"],
  openGraph: {
    title: "Pattaya Directory",
    description: "Discover the best events in Pattaya",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}