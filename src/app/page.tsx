//import Image from "next/image";
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className=""> 
      <div className="flex flex-col lg:flex-row items-center bg-[#282929] dark:bg-slate-800">
        <div className="p-10 flex flex-col bg-[#282929] dark:bg-slate-800 text-white space-y-5">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white">Western Loudoun TTRPG Club</h1>
          <p className="text-gray-500 dark:text-gray-400">Fill out the form below to add yourself to our roster.</p>
          <Link href="/join-the-club">
            <Button
              type="button"
              className="w-full rounded-lg bg-gradient-to-r from-primary-600 to-primary-500 text-white px-5 py-2.5 text-center"
            >
              Join the Club
            </Button>
          </Link>
        </div>
      </div>
      <p className="text-center font-bold text-xl pt-5">
        Disclaimer
      </p>
      <p className="text-center font-light p-2">
        This is a demo app.  Please do not use this in a production environment.
      </p>
      <p className="text-center font-light p-2">
        This video is made for informational and educational purposes only.  
        We do not own or affiliate with Dropbox and/or any of its subsidiares in any form.  
        The Copyright Disclaimer under section 107 of the Copyright Act 1976, allowance is made for “fair use” for purposes such as criticism, comment, news reporting, teaching, scholarship, education and training.
      </p>
    </main>
  )
}
