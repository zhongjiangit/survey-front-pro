import '@/styles/global.css';
import { ColorScheme } from '@/types/ColorScheme';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { inter } from '../components/display/fonts';
import { cn } from '../lib/utils';
import { Provider } from './provider';

export const metadata: Metadata = {
  title: {
    template: '%s | 四川鼎兴数智教育咨询有限公司',
    default: '四川鼎兴数智教育咨询有限公司',
  },
  description: '四川鼎兴数智教育咨询有限公司教育督导评估信息化平台集群。',
  metadataBase: new URL('https://dxjy.online/'),
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();

  const colorScheme =
    cookieStore.get('color-scheme')?.value ?? ColorScheme.LIGHT;

  return (
    <html lang="en" className={cn({ dark: colorScheme === ColorScheme.DARK })}>
      <body className={`${inter.className} antialiased`}>
        <AntdRegistry>
          <Provider colorScheme={colorScheme as ColorScheme}>
            {children}
          </Provider>
        </AntdRegistry>
      </body>
    </html>
  );
}
