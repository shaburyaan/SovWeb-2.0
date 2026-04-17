import type { Metadata } from "next";
import { Noto_Sans_Armenian, Roboto } from "next/font/google";

import { RootExperience } from "@/components/providers/root-experience";

import "./globals.css";

const sans = Roboto({
  variable: "--font-sans",
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "700"],
});

const armenianSans = Noto_Sans_Armenian({
  variable: "--font-armenian",
  subsets: ["armenian"],
  weight: ["300", "400", "500", "700"],
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
      <body className={`${sans.variable} ${armenianSans.variable}`}>
        <RootExperience>{children}</RootExperience>
      </body>
    </html>
  );
}
