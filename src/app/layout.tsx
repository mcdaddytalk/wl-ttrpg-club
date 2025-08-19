import type { Metadata, Viewport } from "next";
// import localFont from "next/font/local";
import { fontSans, fontMono } from "@/lib/fonts";
import "./globals.css";
import { siteConfig } from "@/config/site";

// import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import Header from "@/components/Header";
import { Toaster } from "sonner";
import Footer from "@/components/Footer";
import ToastHandler from "@/components/ToastHandler";
import { Suspense } from "react";
import { cn } from "@/lib/utils";
import UnifiedClientProvider from "@/providers/UnifiedClientProvider";

const defaultUrl = siteConfig.url;
const { title, description, icons, keywords, manifest } = siteConfig;

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    default: title,
    template: `%s | ${title}`,
  },
  description,
  icons,
  keywords,
  manifest,
  authors: [
    {
      name: "Karlan Talkington",
      url: "https://www.kaje.org",
    },
  ],
  creator: "Karlan Talkington",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: defaultUrl,
    title,
    description,
    siteName: title,
    images: [
      {
        url: `${defaultUrl}/og.png`,
        width: 1200,
        height: 630,
        alt: "OG Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [`${defaultUrl}/og.png`],
    creator: "@karlan_talkington",
  },
};

export const viewport: Viewport = {
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ]
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "bg-background text-foreground bg-banner bg-no-repeat bg-cover",
          fontSans.variable,
          fontMono.variable
        )}
      >
        <UnifiedClientProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <Toaster position="top-right" />
            <Suspense fallback="<div>Loading...</div>">
              <ToastHandler />
            </Suspense>
              <div className="flex-grow dark:bg-black-overlay bg-white-overlay">
                <main className="container w-full max-w-screen-3xl mx-auto overflow-auto">
                  {children}
                </main>
              </div>
            <Footer />
          </div>
        </UnifiedClientProvider>
      </body>
    </html>
  );
}
