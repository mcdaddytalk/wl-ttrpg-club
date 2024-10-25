import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import Header from "@/components/Header";
import ThemeProvider from "@/components/ThemeProvider";
import { Toaster } from "sonner";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Western Loudoun Table Top Roleplaying Game Club (WLTTRPG)",
  description: "Club for table top roleplaying gamers in the Western Loudoun area.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || ''}
      signInFallbackRedirectUrl={"/dashboard"}
      signUpFallbackRedirectUrl={"/sign-in"}
    >
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider 
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            {children}
            <Toaster position="top-right" />
            <Footer />
          </ThemeProvider>
        </body>
      </html>
    </AuthProvider>
  );
}
