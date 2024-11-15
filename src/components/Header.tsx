import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ModeToggle } from './ModeToggle'
import SignedOut from './SignedOut'
import SignInButton from './SignInButton'

export default function Header() {
  return (
    <header className="z-10 sticky w-screen top-0 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center">
            <nav className="flex items-center space-x-4 lg:space-x-6">
                <Link href="/" className="flex items-center space-x-2">
                    <div className='w-fit p-6'>
                        <Image 
                            src='https://kthrpfzafznkkvalszoi.supabase.co/storage/v1/object/public/images/wl-ttrpg-club-logo2-transformed.png' 
                            alt='logo' 
                            className='w-full h-full'
                            height={40}
                            width={40}
                        />
                    </div>
                    <h1 className="font-bold text-xl">Western Loudoun Table Top Roleplaying Game Club</h1>
                </Link>
            </nav>
            <div className="flex flex-auto items-center justify-end space-x-4 lg:space-x-6">
                <ModeToggle />
                <SignedOut>
                    <SignInButton mode='modal'/>
                </SignedOut>
            </div>
        </div>
    </header>
  )
}