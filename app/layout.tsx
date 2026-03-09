import type { Metadata } from "next";
import { Frank_Ruhl_Libre, Mulish } from "next/font/google";
import SessionProvider from "@/components/providers/SessionProvider";
import "./globals.css";

const frankRuhlLibre = Frank_Ruhl_Libre({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "700"],
});

const mulish = Mulish({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Zoocasa Blog CMS",
  description: "Content management system for Zoocasa blog",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${frankRuhlLibre.variable} ${mulish.variable} antialiased`}
      >
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
