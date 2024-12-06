"use client"

import { Button } from "./ui/button"
import { Provider } from "@/lib/types/custom";
import { signInWithProvider } from "@/server/authActions";
import {
    FaDiscord
} from 'react-icons/fa6';
import { FcGoogle } from 'react-icons/fc';

type OAuthProvider = {
    name: Provider;
    displayName: string;
    color: string;
    hvr_color: string;
    text_color: string;
    icon?: React.ReactNode;
}

type OAuthButtonsProps = {
    setModalOpen: (value: boolean) => void
}

export function OAuthButtons({ setModalOpen }: OAuthButtonsProps) {
    const providers: OAuthProvider[] = [
        {
            name: "google",
            displayName: "Google",
            color: "bg-white",
            hvr_color: "hover:bg-slate-200",
            text_color: "text-slate-600",
            icon: <FcGoogle size={18} className="mr-2" />
        },
        {
            name: "discord",
            displayName: "Discord",
            color: "bg-blue-500",
            hvr_color: "hover:bg-blue-800",
            text_color: "text-white",
            icon: <FaDiscord size={18} className="mr-2" />
        },
    ]

    return (
        <div className="flex gap-2">
            {providers.map((provider) => (
                <Button
                    key={provider.name}
                    className={`px-4 py-2 ${provider.color} ${provider.text_color} rounded ${provider.hvr_color}`}
                    onClick={async () => {
                        await signInWithProvider(provider.name)
                        setModalOpen(false)
                    }}
                >
                    {provider.icon}
                    {provider.displayName}
                </Button>
            ))}
        </div>
    );
}