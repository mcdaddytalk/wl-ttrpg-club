import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ModeToggle } from './ModeToggle'
import SignedOut from './SignedOut'
import SignInButton from './SignInButton'

export default function Header() {
  return (
    <header className="flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
            <div className='w-fit bg-[#0160FE]'>
                <Image 
                    src='https://kthrpfzafznkkvalszoi.supabase.co/storage/v1/object/public/images/wl-ttrpg-club-logo3.webp' 
                    alt='logo' 
                    className='invert'
                    height={50}
                    width={50}
                />
            </div>
            <h1 className="font-bold text-xl">Western Loudoun Table Top Roleplaying Game Club</h1>
        </Link>
        <div className="px-5 flex space-x-2 items-center">
            <ModeToggle />
            <SignedOut>
                <SignInButton mode='modal'/>
            </SignedOut>
        </div>
    </header>
  )
}