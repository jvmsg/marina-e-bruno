import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import { weddingContent } from "@/lib/content";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${weddingContent.couple.fullNames} | Convite de Casamento`,
  description: `Convite de casamento de ${weddingContent.couple.fullNames}. Confirme sua presença e veja os detalhes do grande dia.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${dmSans.variable} ${playfair.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
