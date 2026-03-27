import './globals.css';
import type { Metadata, Viewport } from 'next';
import { ClerkProvider } from '@clerk/nextjs';

export const metadata: Metadata = {
  title: 'Maintenance OS',
  description: 'Maintenance coordination for homeowners and landlords.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider>{children}</ClerkProvider>
      </body>
    </html>
  );
}
