import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { getServerSession } from 'next-auth';
import './globals.css';
import SessionProvider from './components/SessionProvider';

const inter = Inter({ subsets: ['latin'] });
const viewportClasses = 'min-h-screen min-w-full';

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  return (
    <html lang='en' className='min-h-screen min-w-full'>
      <body className={inter.className}>
        <SessionProvider session={session}>
          <main>{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
