import type { Metadata } from 'next';
import './globals.css';
import '@/sofaclean_site/index.css';
export const metadata: Metadata = {
 title: 'SofaClean | Higienização de sofás no Porto e Braga',
 description: 'Higienização de sofás e estofados ao domicílio nas regiões do Porto e Braga.',
 robots: { index: true, follow: true },
 icons: { icon: '/favicon.svg' },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
 return <html lang="pt-PT"><body>{children}</body></html>;
}
