import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
    return (
        <section className="flex flex-col items-center">
        <h1 className="text-9xl font-extrabold text-white tracking-widest">403</h1>
        <div className="bg-[#FF6A3D] px-2 mt-16 text-sm rounded rotate-12 absolute">
            Unauthorized
        </div>
        <Button asChild className="mt-5">
        <a
            className="relative inline-block text-sm font-medium text-[#FF6A3D] group active:text-orange-500 focus:outline-none focus:ring"
        >
            <span
            className="absolute inset-0 transition-transform translate-x-0.5 translate-y-0.5 bg-[#FF6A3D] group-hover:translate-y-0 group-hover:translate-x-0"
            ></span>

            <span className="relative block px-8 py-3 bg-[#1A2238] border border-current">
            <Link href="/">Go Home</Link>
            </span>
        </a>
        </Button>
        <div className="flex flex-col justify-center items-center pt-4">
            <span>unexpected?</span>
            <Link href="/contact-us">contact support</Link>
        </div>
    </section>
    )
}