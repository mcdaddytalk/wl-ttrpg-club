import Link from 'next/link'
import React from 'react'
import Icon from './Icon';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="z-50 sticky bottom-0 mx-auto w-full dark:bg-slate-900 dark:text-white bg-slate-50 text-slate-600 pt-2 pr-4 pl-4 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex flex-col text-center md:flex-row justify-between items-center ">
        <div className="text-center text-sm md:text-left text-slate-400">
          <p>&copy; {currentYear} Western Loudoun Table Top Roleplaying Game Club. All rights reserved.</p>
        </div>
        <div className="mt-4 md:mt-0 space-x-4 text-center">
          <Link href="/privacy" className="mr-4 text-sm text-slate-400 hover:dark:text-white hover:text-slate-600">Privacy Statement</Link>
          <Link href="/terms-of-service" className="mr-4 text-sm text-slate-400 hover:dark:text-white hover:text-slate-600">Terms of Service</Link>
          <Link href="/contact-us" className="text-sm text-slate-400 hover:dark:text-white hover:text-slate-600">
            Contact Us
          </Link>
        </div>
      </div>
      <div className="mt-2 text-center text-sm text-slate-400 flex justify-center items-center gap-2">
        <span className="flex items-center gap-1">
          Powered by{" "}
          <Link href="https://nextjs.org" target="_blank" rel="noopener noreferrer">
            <Icon type="nextjs" size={24} />
          </Link>
        </span>
        <span>&nbsp;|&nbsp;</span>
        <span className="flex items-center gap-1">
          Hosting by{" "}
          <Link href="https://vercel.com" target="_blank" rel="noopener noreferrer">
            <Icon type="vercel" size={24} />
          </Link>
        </span>
      </div>
    </footer>
  )
}
