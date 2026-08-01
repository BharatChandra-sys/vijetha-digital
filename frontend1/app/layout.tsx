import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'More Than B&W | Premium Printing Solutions',
  description: 'The go-to experts for all your printing needs',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
