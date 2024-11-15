//import Image from "next/image";
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <>
      <section className="relative h-screen items-center justify-center"> 
        {/* Gradient background */}
        <div
          aria-hidden="true"
          className="flex absolute -top-96 start-1/2 transform -translate-x-1/2"
        >
          <div className="bg-gradient-to-r from-background/50 to-background blur-3xl w-[25rem] h-[44rem] rotate-[-60deg] transform -translate-x-[10rem]" />
          <div className="bg-gradient-to-tl blur-3xl w-[90rem] h-[50rem] rounded-full origin-top-left -rotate-12 -translate-x-[15rem] from-primary-foreground via-primary-foreground to-background" />
        </div>
        <div className="relative ">
          <div className="py-10 md:py-16">
            <div className="max-w-2xl text-center mx-auto">
              <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl text-slate-900 dark:text-white">Western Loudoun</h1>
              <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl text-slate-900 dark:text-white">Tabletop Roleplaying Game Club</h1>
            </div>
            <div className="max-w-2xl mx-auto mt-6 text-center">
              <p className="text-xl text-muted-foreground text-slate-900 dark:text-slate-400">
                Our website serves as the central hub for a thriving community of tabletop roleplayers who come together to share their passion for immersive storytelling and collaborative adventures. 
              </p>
              <p className="text-xl text-muted-foreground text-slate-900 dark:text-slate-400">
                Whether you&apos;re a seasoned adventurer or just starting your journey, we offer a variety of games, including Dungeons & Dragons 5e, Pathfinder, and many other systems. 
              </p>
              <p className="text-xl text-muted-foreground text-slate-900 dark:text-slate-400">  
              Through our platform, you can easily join the group, schedule new games as a gamemaster, or register for upcoming sessions.
              </p>
              <p className="text-xl text-muted-foreground text-slate-900 dark:text-slate-400"> 
                Our mission is to foster a welcoming environment where players of all experience levels can connect, explore new worlds, and build lasting friendships. 
              </p>
              <p className="text-xl text-muted-foreground text-slate-900 dark:text-slate-400">
                Dive into epic quests, face thrilling challenges, and become a part of our growing community today!                
              </p>
            </div>
            <div className="mt-5 max-w-3xl">
              <p className="text-xl text-muted-foreground text-slate-900 dark:text-slate-400">Want to learn more?</p>
              <p className="text-xl text-muted-foreground text-slate-900 dark:text-slate-400">Click the button below and fill out the form and someone will contact you.</p>
            </div>
            <div className="mt-8 gap-3 flex justify-center">
              <Link href="/join-the-club">
                <Button
                  type="button"
                  className="w-full rounded-lg 
                    bg-blue-500 hover:bg-blue-700
                    active:bg-blue-900
                    focus:outline-none focus:ring focus:ring-blue-600
                    text-white dark:text-slate-300 
                    px-5 py-2.5 text-center"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/*
      <section className="bg-white dark:bg-slate-600">
        <p className="text-center font-bold text-xl pt-5">
          Disclaimer
        </p>
        <p className="text-center font-light p-2">
          This is a demo app.  Please do not use this in a production environment.
        </p>
        <p className="text-center font-light p-2">
          This video is made for informational and educational purposes only.  
          The Copyright Disclaimer under section 107 of the Copyright Act 1976, allowance is made for “fair use” for purposes such as criticism, comment, news reporting, teaching, scholarship, education and training.
        </p>
      </section>
      */}
    </>
  )
}
