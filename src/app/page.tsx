import business from '@/assets/images/business.svg';
import { lusitana } from '@/components/common/fonts';
import Footer from '@/components/common/footer';
import { Button } from '@/components/ui/button';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { FlaskConical } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../components/common/header';
import CardList from './modules/card-list';

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex h-16 md:h-20 shrink-0 items-end rounded-lg bg-sky-100 dark:bg-sky-900 p-4">
        <Header isThemeShow />
      </div>
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex items-center justify-center p-4 md:w-1/2 md:p-12">
          <Image
            src={business}
            width={1000}
            className="hidden md:block"
            alt="Screenshots of the dashboard project showing desktop version"
          />
          <Image
            src={business}
            width={560}
            height={620}
            className="block md:hidden"
            alt="Screenshot of the dashboard project showing mobile version"
          />
        </div>
        <div className="flex flex-col justify-around gap-6 rounded-lg bg-gray-50 dark:bg-gray-900 px-6 py-10 md:w-1/2 md:px-12">
          <p
            className={`${lusitana.className} text-xl text-gray-800 dark:text-gray-100 md:text-2xl md:leading-normal`}
          >
            <strong>Welcome to Acme.</strong> This is the example for the{' '}
            <a href="https://nextjs.org/learn/" className="text-blue-500">
              Next.js Learn Course
            </a>
            , brought to you by Vercel.
          </p>

          <CardList />
          <div className="flex justify-around">
            <Button variant="outline" className="flex gap-1 items-center">
              <span>系统试用</span> <FlaskConical className="w-4" />
            </Button>
            <Button
              variant="default"
              className="border border-gray-300 flex items-center"
            >
              <Link className="flex items-center" href="/login">
                <span>系统登录</span> <ArrowRightIcon className="w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
