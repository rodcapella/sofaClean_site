import { Analytics } from '@vercel/analytics/next';
// Teste temporário desativado. Para reativar ?tema=escuro, repor os imports e o componente abaixo.
// import { ThemePreview } from '@/sofaclean_site/ThemePreview';
// import '@/styles/theme-preview.css';
import type { Metadata } from 'next';
import '@/styles/globals.css';
import '@/styles/index.css';
import '@/styles/modal.css';
import '@/styles/general-services.css';
export const metadata: Metadata = {
 metadataBase: new URL('https://www.sofacleanpt.pt'),
 title: 'SofaClean | Higienização ao domicílio no Porto e Braga e região',
 description: 'Higienização de sofás, poltronas e colchões, limpeza de tapete e de banco de carro e impermeabilização de estofos ao domicílio nas regiões do Porto e Braga e região.',
 keywords: ['higienização de estofados', 'limpeza de estofos', 'higienização de sofás Porto', 'limpeza de tapetes Braga', 'higienização de colchões', 'limpeza de bancos de carros', 'impermeabilização de estofos', 'higienização de poltronas', 'limpeza ao domicílio Porto e Braga e região'],
 robots: { index: true, follow: true },
 icons: { icon: [{ url: '/sofaclean/icons/favicon-16x16.png', type: 'image/png', sizes: '16x16' }, { url: '/sofaclean/icons/favicon-32x32.png', type: 'image/png', sizes: '32x32' }], apple: '/sofaclean/icons/apple-touch-icon.png', shortcut: '/sofaclean/icons/favicon-32x32.png', other: [{ rel: 'manifest', url: '/site.webmanifest' }] },
  authors: [{ name: 'SofaClean' }],
  other: { generator: 'Website desenvolvido pela Sapiente.AI' },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
 return <html lang="pt-PT" data-developer="Sapiente.AI" data-developer-url="https://www.sapienteai.com/pt"><head>{/* Metadados de Autoria e Desenvolvimento */}<meta name="author" content="Sapiente.AI" /><meta name="creator" content="Sapiente.AI" /><meta name="publisher" content="Sapiente.AI" /><meta name="twitter:creator" content="https://x.com/SapienteAI" /><meta name="generator" content="Website desenvolvido pela Sapiente.AI" /><link rel="author" href="https://www.sapienteai.com/pt" /><link type="text/plain" rel="author" href="/humans.txt" />{/* Meta Pixel Code */}<script id="meta-pixel" dangerouslySetInnerHTML={{ __html: `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1464649785626362');
fbq('track', 'PageView');` }} />{/* End Meta Pixel Code */}</head><body><noscript><img height="1" width="1" style={{ display: 'none' }} src="https://www.facebook.com/tr?id=1464649785626362&amp;ev=PageView&amp;noscript=1" alt="" /></noscript>{/*
  ==================================================
  Design, estruturação e desenvolvimento por Sapiente.AI
  Website: https://www.sapienteai.com/pt
  ==================================================
 */}{/* <ThemePreview /> */}{children}<Analytics /></body></html>;
}




