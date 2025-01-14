"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type PasswordlessButtonProps = {
    handleSignInWithEmail: (formData: FormData) => Promise<void>
    useLabel?: boolean
}
export default function PasswordlessButton({ handleSignInWithEmail, useLabel = false }: PasswordlessButtonProps) {
    return (
        <form id="email-signin-form" className="flex flex-col items-center">
              <div className="flex flex-col space-y-2">
                { useLabel && <Label htmlFor="email" className="text-slate-800 dark:text-slate-800">Email</Label> }
                <Input 
                    type="email" 
                    id="email" 
                    name="email" 
                    placeholder='Enter your email' 
                    autoComplete="email"
                    required 
                    className="w-full text-slate-100 dark:text-slate-800"
                />
              </div>
              <Button
                formAction={handleSignInWithEmail}
                className="mt-2 mb-2 space-y-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Sign In with Email
              </Button>
        </form>
    )
}