import type { Metadata } from "next";
import { Cormorant_Garamond, Inter_Tight } from "next/font/google";

import { RootExperience } from "@/components/providers/root-experience";

import "./globals.css";

const sans = Inter_Tight({
  variable: "--font-sans",
  subsets: ["latin", "cyrillic"],
});

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Sovrano Distributions",
  description: "Sovrano is the largest food and beverage distribution company in Armenia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${sans.variable} ${display.variable}`}>
        <RootExperience>{children}</RootExperience>
      </body>
    </html>
  );
}
