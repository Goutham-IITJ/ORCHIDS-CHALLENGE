// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

/* ------------------  FONTS  ------------------ */
const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

/* --------------  PAGE METADATA --------------- */
export const metadata: Metadata = {
  title: "Website Cloner",
  description: "Clone any public website and preview it instantly",
};

/* --------------  ROOT LAYOUT  ---------------- */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    /* `suppressHydrationWarning` prevents React from
       flagging our dark-mode class toggle as a mismatch. */
    <html lang="en" suppressHydrationWarning>
      <body
        className={`
          ${geistSans.variable} 
          ${geistMono.variable} 
          antialiased
          bg-white text-black
          dark:bg-gray-900 dark:text-white
          transition-colors duration-300
        `}
      >
        {children}
      </body>
    </html>
  );
}
