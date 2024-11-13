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
import { Analytics } from "@vercel/analytics/react";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
      <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
        <body
          className="min-h-screen sticky top-0 bg-background text-foreground"
        >
            <Analytics />
            <ThemeProvider 
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Header />
              <Toaster position="top-right" />
              <Suspense fallback="<div>Loading...</div>">
                <ToastHandler />
              </Suspense>
              <div className="layout-container">
                <main className="flex flex-col items-center">{children}</main>
              </div>
              <Footer />
            </ThemeProvider>
        </body>
      </html>
    
  );
}
