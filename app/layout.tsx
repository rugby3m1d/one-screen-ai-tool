import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'One Screen AI Tool',
  description: 'Minimal one-page AI web application'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
