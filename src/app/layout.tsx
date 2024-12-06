import type { Metadata } from "next";
// import localFont from "next/font/local";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

// import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import Header from "@/components/Header";
import ThemeProvider from "@/components/ThemeProvider";
import { Toaster } from "sonner";
import Footer from "@/components/Footer";
import ToastHandler from "@/components/ToastHandler";
import { Suspense } from "react";
// import { Analytics } from "@vercel/analytics/react";
import QueryProviderWrapper from "@/providers/QueryProvider";

// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

const defaultUrl = process?.env?.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Western Loudoun Table Top Roleplaying Game Group (WLTTRPGG)",
  description: "Club for table top roleplaying gamers in the Western Loudoun area.",
  icons: {
    icon: "/favicon.ico"
  },
  manifest: "/manifest.json",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body
        className="bg-background text-foreground bg-banner bg-no-repeat bg-cover"
      >
          <ThemeProvider 
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <QueryProviderWrapper>
              <div className="flex flex-col min-h-screen">
                <Header />
                <Toaster position="top-right" />
                <Suspense fallback="<div>Loading...</div>">
                  <ToastHandler />
                </Suspense>
                  <div className="flex-grow dark:bg-black-overlay bg-white-overlay">
                    <main className="container w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 overflow-auto">
                      {children}
                    </main>
                  </div>
                <Footer />
              </div>
            </QueryProviderWrapper>
          </ThemeProvider>
      </body>
    </html> 
  );
}
