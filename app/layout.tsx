import type { Metadata } from 'next';
import '@/styles/globals.css';
import '@/styles/index.css';
import '@/styles/modal.css';
import '@/styles/general-services.css';
export const metadata: Metadata = {
 title: 'SofaClean | Higienização ao domicílio no Porto e Braga',
 description: 'Higienização de sofás, tapetes, colchões e bancos de carros ao domicílio nas regiões do Porto e Braga.',
 keywords: ['higienização de sofás Porto', 'limpeza de tapetes Braga', 'higienização de colchões', 'limpeza de bancos de carros', 'limpeza ao domicílio Porto e Braga'],
 robots: { index: true, follow: true },
 icons: { icon: [{ url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' }, { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' }], apple: '/apple-touch-icon.png', shortcut: '/favicon-32x32.png', other: [{ rel: 'manifest', url: '/site.webmanifest' }] },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
 return <html lang="pt-PT"><body>{children}</body></html>;
}



