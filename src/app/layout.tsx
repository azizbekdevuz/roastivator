import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/AppProviders";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Roastivator - GitHub Profile Roaster",
  description: "Get brutally honest feedback about your GitHub profile, commit messages, and coding habits. Enter your username and prepare to be roasted!",
  keywords: ["github", "roast", "code review", "developer", "programming", "git commits", "commit analysis", "repository analysis"],
  authors: [{ name: "Roastivator Team" }],
  creator: "Roastivator",
  publisher: "Roastivator",
  openGraph: {
    title: "Roastivator - GitHub Profile Roaster",
    description: "Get brutally honest feedback about your GitHub profile, commit messages, and coding habits",
    type: "website",
    locale: "en_US",
    siteName: "Roastivator",
  },
  twitter: {
    card: "summary_large_image",
    title: "Roastivator - GitHub Profile Roaster",
    description: "Get brutally honest feedback about your GitHub profile",
    creator: "@roastivator",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'technology',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f0f23' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body 
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
