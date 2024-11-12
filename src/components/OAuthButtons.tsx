"use client"

import { Button } from "./ui/button"
import { Provider } from "@/lib/types/custom";
import { signInWithProvider } from "@/server/authActions";
import {
    FaGoogle,
    FaDiscord
} from 'react-icons/fa6';

type OAuthProvider = {
    name: Provider;
    displayName: string;
    color: string;
    bg_color: string;
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
            color: "bg-red-500",
            bg_color: "bg-red-800",
            icon: <FaGoogle size={18} className="mr-2" />
        },
        {
            name: "discord",
            displayName: "Discord",
            color: "bg-blue-500",
            bg_color: "bg-blue-800",
            icon: <FaDiscord size={18} className="mr-2" />
        },
    ]

    return (
        <div className="flex gap-2">
            {providers.map((provider) => (
                <Button
                    key={provider.name}
                    className={`px-4 py-2 ${provider.color} text-white rounded hover:${provider.bg_color}`}
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