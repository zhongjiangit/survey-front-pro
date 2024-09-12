import '@/styles/global.css';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { inter } from '../components/common/fonts';
import { ColorScheme } from '../interfaces/colorScheme';
import { cn } from '../lib/utils';
import { Provider } from './provider';

export const metadata: Metadata = {
  title: {
    template: '%s | Acme Dashboard',
    default: 'Acme Dashboard',
  },
  description: 'The official Next.js Learn Dashboard built with App Router.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const colorScheme =
    cookieStore.get('color-scheme')?.value ?? ColorScheme.DARK;
  return (
    <html lang="en" className={cn({ dark: colorScheme === ColorScheme.DARK })}>
      <body className={`${inter.className} antialiased`}>
        <Provider colorScheme={colorScheme as ColorScheme}>{children}</Provider>
      </body>
    </html>
  );
}
