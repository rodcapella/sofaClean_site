import type { Metadata } from "next";
import { Manrope, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const body = Manrope({ variable: "--font-body", subsets: ["latin"] });
const display = Plus_Jakarta_Sans({ variable: "--font-display", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Master Clean | Limpeza de Sofás em Fátima",
  description: "Limpeza de sofás, higienização de colchões e limpeza de carpetes em Fátima e arredores. Peça o seu orçamento à Master Clean.",
  keywords: ["limpeza de sofás em Fátima", "higienização de colchões em Fátima", "limpeza de carpetes em Fátima", "Master Clean"],
  openGraph: {
    title: "Master Clean | Limpeza profissional em Fátima",
    description: "Limpeza de sofás, colchões e carpetes em Fátima e arredores.",
    locale: "pt_PT",
    type: "website",
    images: [{ url: "/og.png", width: 1734, height: 907, alt: "Master Clean — Limpeza profissional em Fátima" }],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-PT"><body className={`${body.variable} ${display.variable}`}>{children}</body></html>;
}
