import './globals.css';
import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { ClerkProvider } from '@clerk/nextjs';
import { Analytics } from '@vercel/analytics/react';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ifbids.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Maintenance OS — Track Property Repairs, Contractors, and Quotes',
    template: '%s | Maintenance OS',
  },
  description:
    'Maintenance OS helps homeowners and landlords track property repairs, contact contractors, compare quotes, and keep repair history organized in one place.',
  keywords: [
    'property maintenance software',
    'home repair tracker',
    'landlord maintenance software',
    'contractor quote comparison',
    'repair history software',
    'rental property maintenance tracking',
  ],
  applicationName: 'Maintenance OS',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Maintenance OS',
  },
  authors: [{ name: 'Maintenance OS' }],
  creator: 'Maintenance OS',
  publisher: 'Maintenance OS',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: siteUrl,
    title: 'Maintenance OS — Track Property Repairs, Contractors, and Quotes',
    description:
      'Manage property maintenance, send contractor requests, compare replies, and keep repair history organized.',
    siteName: 'Maintenance OS',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Maintenance OS dashboard preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Maintenance OS — Track Property Repairs, Contractors, and Quotes',
    description:
      'Manage property maintenance, send contractor requests, compare replies, and keep repair history organized.',
    images: ['/og-image.png'],
  },
  manifest: '/manifest.webmanifest',  // served by app/manifest.ts
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-18068633331"
          strategy="afterInteractive"
        />
        <Script id="google-ads" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-18068633331');
          `}
        </Script>
      </head>
      <body>
        <ClerkProvider>
          {children}
          <Analytics />
        </ClerkProvider>
      </body>
    </html>
  );
}
