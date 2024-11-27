"use client";

import React, { Suspense, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import useSession from "@/utils/supabase/use-session";

const ResetPassword = (): React.ReactNode => {
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState<null | string>(null);
    const session = useSession();
    
    console.log(session); // Log the session?.access_token
    const accessToken = session?.access_token;

    const handleResetPassword = async () => {
        setLoading(true);
        setStatusMessage(null);

        try {
            const response = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({ accessToken, newPassword }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to reset password.");
            }
            toast.success(data.message || "Your password has been updated successfully!");
            setStatusMessage(data.message || "Your password has been updated successfully!");
        } catch (err) {
            toast.error((err as Error).message || "Failed to reset password.");
            console.error(err);
            setStatusMessage((err as Error).message || "Failed to reset password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Suspense fallback="<div>Loading...</div>">
            <section className="flex flex-col items-center justify-between pt-4">
                <Card className="max-w-md mx-auto mt-10">
                <CardHeader>
                    <CardTitle>Reset Your Password</CardTitle>
                    <CardDescription>
                    Enter your new password below to reset your account password.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                    <Input
                        type="password"
                        placeholder="Enter your new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        disabled={loading}
                        required
                    />
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col items-center">
                    <Button
                    onClick={handleResetPassword}
                    disabled={loading || !newPassword}
                    className="w-full"
                    >
                    {loading ? "Updating..." : "Reset Password"}
                    </Button>
                    {statusMessage && <p className="text-sm text-gray-600 mt-2">{statusMessage}</p>}
                </CardFooter>
                </Card>
            </section>
        </Suspense>
    );
};

export default ResetPassword;
