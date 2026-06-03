import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, JetBrains_Mono, Allura } from "next/font/google";
import "./globals.css";
import { TarshaProvider } from "@/context/TarshaContext";
import { Toaster } from "@/components/ui/toaster";

// Display / headings — Plus Jakarta Sans (standing in for Satoshi, as on tarsha.co.uk)
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-satoshi",
  display: "swap",
});

// Body / UI — Inter. Reuses the --font-dm-sans variable so body + font-dm usages flip automatically.
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
    <html lang="en" className={`${plusJakarta.variable} ${inter.variable} ${jetbrainsMono.variable} ${allura.variable}`}>
      <body>
        <TarshaProvider>
          {children}
          <Toaster />
        </TarshaProvider>
      </body>
    </html>
  );
}
