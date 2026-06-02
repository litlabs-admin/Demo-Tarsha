import type { Metadata } from "next";
import { Syne, DM_Sans, JetBrains_Mono, Allura } from "next/font/google";
import "./globals.css";
import { TarshaProvider } from "@/context/TarshaContext";
import { Toaster } from "@/components/ui/toaster";

const syne = Syne({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-syne",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-dm-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

const allura = Allura({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-brand",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tarsha AI — AI Receptionist Platform",
  description: "The AI receptionist that keeps your phone covered",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable} ${jetbrainsMono.variable} ${allura.variable}`}>
      <body>
        <TarshaProvider>
          {children}
          <Toaster />
        </TarshaProvider>
      </body>
    </html>
  );
}
