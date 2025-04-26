import Head from 'next/head';
import Link from 'next/link';
import { ReactNode } from 'react';

type MainLayoutProps = {
  children: ReactNode;
  title?: string;
  description?: string;
};

export default function MainLayout({
  children,
  title = 'Amazon Q Developer News',
  description = 'Subscribe to Amazon Q Developer news and updates',
}: MainLayoutProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen flex flex-col">
        <header className="bg-amazon-blue text-white py-4">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center">
              <Link href="/" className="text-xl font-bold flex items-center">
                <span className="text-amazon-orange mr-1">Amazon</span> Q Developer News
              </Link>
              <nav>
                <ul className="flex space-x-4">
                  <li>
                    <Link href="/" className="hover:text-amazon-orange transition-colors">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/admin" className="hover:text-amazon-orange transition-colors">
                      Admin
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </header>
        <main className="flex-grow container mx-auto px-4 py-8">{children}</main>
        <footer className="bg-amazon-blue text-white py-6">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <p>&copy; {new Date().getFullYear()} Amazon Web Services, Inc. or its affiliates.</p>
              </div>
              <div className="flex space-x-4">
                <Link href="/privacy" className="hover:text-amazon-orange transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="hover:text-amazon-orange transition-colors">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
