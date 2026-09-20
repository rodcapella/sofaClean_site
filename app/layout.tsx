import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Manrope, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const body = Manrope({ variable: "--font-body", subsets: ["latin"] });
const display = Plus_Jakarta_Sans({ variable: "--font-display", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sofá Clean | Seu estofo novo de novo | Porto e Braga",
  description: "Seu estofo novo de novo. Limpeza e higienização profissional de sofás, colchões e estofados no Porto, Braga e arredores.",
  keywords: ["limpeza de sofás no Porto", "limpeza de sofás em Braga", "higienização de colchões no Porto", "limpeza de carpetes em Braga", "Sofá Clean"],
  icons: { icon: "/sofa-clean-logo.png", shortcut: "/sofa-clean-logo.png" },
  openGraph: {
    title: "Sofá Clean | Seu estofo novo de novo",
    description: "Seu estofo novo de novo. Higienização profissional no Porto, Braga e arredores.",
    locale: "pt_PT",
    type: "website",
    images: [{ url: "/og.png", width: 1734, height: 907, alt: "Sofá Clean — Limpeza profissional no Porto e Braga" }],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-PT"><body className={`${body.variable} ${display.variable}`}>{children}<Analytics /></body></html>;
}
