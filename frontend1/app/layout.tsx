import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Vijetha Digital | Premium Printing Solutions',
  description: 'The go-to experts for all your printing needs',
  icons: {
    icon: '/vd-logo.jpeg',
    shortcut: '/vd-logo.jpeg',
    apple: '/vd-logo.jpeg',
  },
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
