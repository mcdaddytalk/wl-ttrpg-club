//import Image from "next/image";
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PublicAnnouncementsWidget } from "@/components/widgets/PublicAnnouncementsWidget"

export default function Home() {
  return (
    <>
      <PublicAnnouncementsWidget />
      <section className="relative flex flex-col"> 
        <div className="bg-slate-200 dark:bg-slate-700 opacity-50 max-w-4xl mt-4">
          <div className="pt-4 pl-4 opacity-100">
            <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl text-slate-900 dark:text-white">Western Loudoun</h1>
            <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl text-slate-900 dark:text-white">Tabletop Roleplaying Game Club</h1>
          </div>
          <div className="mt-4 pb-4 pl-8">
            <p className="text-xl text-muted-foreground text-slate-900 dark:text-slate-400">
              Our website serves as the central hub for a thriving community of tabletop roleplayers who come together to share their passion for immersive storytelling and collaborative adventures. 
              Whether you&apos;re a seasoned adventurer or just starting your journey, we offer a variety of games, including Dungeons & Dragons 5e, Pathfinder, and many other systems. 
              Through our platform, you can easily join the group, schedule new games as a gamemaster, or register for upcoming sessions.
              Our mission is to foster a welcoming environment where players of all experience levels can connect, explore new worlds, and build lasting friendships. 
            </p>
            <p className="pt-2 text-xl text-muted-foreground text-slate-900 dark:text-slate-400">
              Dive into epic quests, face thrilling challenges, and become a part of our growing community today!                
            </p>
          </div>
        </div>
        <div className="bg-slate-400 dark:bg-slate-900 opacity-50 max-w-4xl">
          <div className="pt-4 pl-8 opacity-100">
            <p className="text-xl text-muted-foreground text-slate-900 dark:text-slate-400">Want to learn more?</p>
            <p className="text-xl text-muted-foreground text-slate-900 dark:text-slate-400">Click the button below and fill out the form and someone will contact you.</p>
          </div>
          <div className="mt-4 gap-3 pb-4 flex justify-center">
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
      </section>
    </>
  )
}
