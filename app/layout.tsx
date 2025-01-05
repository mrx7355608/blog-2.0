import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Navbar } from './compnents/navbar';

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'This is my personal blog website where I write tech related content',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="bg-gray-950" lang="en">
      <body className={`text-gray-100 ${spaceGrotesk.variable} antialiased`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
