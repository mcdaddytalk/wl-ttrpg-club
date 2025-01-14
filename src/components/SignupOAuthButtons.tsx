"use client"

import { Button } from "@/components/ui/button"
import { Provider } from "@/lib/types/custom";
import {
    FaGoogle,
    FaDiscord
} from 'react-icons/fa6';

type OAuthProvider = {
    name: Provider;
    displayName: string;
    color: string;
    hvr_color: string;
    icon?: React.ReactNode;
}

type SignupOAuthButtonsProps = {
    handleOAuthSignup: (provider: Provider) => Promise<void>
}

export function SignupOAuthButtons({ handleOAuthSignup }: SignupOAuthButtonsProps) {
    const providers: OAuthProvider[] = [
        {
            name: "google",
            displayName: "Google",
            color: "bg-red-500",
            hvr_color: "hover:bg-red-800",
            icon: <FaGoogle size={18} className="mr-2" />
        },
        {
            name: "discord",
            displayName: "Discord",
            color: "bg-blue-500",
            hvr_color: "hover:bg-blue-800",
            icon: <FaDiscord size={18} className="mr-2" />
        },
    ]

    return (
        <div className="flex space-x-2 mt-4">
            {providers.map((provider) => (
                <Button
                    key={provider.name}
                    className={`w-1/2 ${provider.color} text-white rounded ${provider.hvr_color}`}
                    onClick={() => {
                        handleOAuthSignup(provider.name)
                    }}
                >
                    {provider.icon}
                    {provider.displayName}
                </Button>
            ))}
        </div>
    );
}