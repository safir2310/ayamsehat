import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AYAM GEPREK SAMBAL IJO - Pedasnya Bikin Nagih 🔥🔥",
  description: "Aplikasi pesanan online Ayam Geprek Sambal Ijo. Pesan ayam geprek pedas nikmat dengan mudah dan cepat!",
  keywords: ["Ayam Geprek", "Sambal Ijo", "Makanan Pedas", "Pesanan Online", "Delivery Makanan"],
  authors: [{ name: "AYAM GEPREK SAMBAL IJO" }],
  openGraph: {
    title: "AYAM GEPREK SAMBAL IJO - Pedasnya Bikin Nagih 🔥🔥",
    description: "Aplikasi pesanan online Ayam Geprek Sambal Ijo. Pesan ayam geprek pedas nikmat dengan mudah dan cepat!",
    siteName: "AYAM GEPREK SAMBAL IJO",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
