"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ForgotPassword = (): React.ReactElement => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<null | string>(null);

  const handleForgotPassword = async () => {
    setLoading(true);
    setStatusMessage(null);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send reset email.");
      }
      toast.success(data.message || "Password reset email sent! Check your inbox.");
      setStatusMessage(data.message || "Password reset email sent! Check your inbox.");
    } catch (err) {
        toast.error((err as Error).message || "Failed to send reset email.");
        setStatusMessage((err as Error).message || "Failed to send reset email.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <section>
        <Card className="max-w-md mx-auto mt-10">
        <CardHeader>
            <CardTitle>Forgot Your Password?</CardTitle>
            <CardDescription>
            Enter your email address below, and we&apos;ll send you a link to reset your password.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
            <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
            />
            </div>
        </CardContent>
        <CardFooter className="flex flex-col items-center">
            <Button
            onClick={handleForgotPassword}
            disabled={loading || !email}
            variant="default"
            className="w-full"
            >
            {loading ? "Sending..." : "Send Reset Link"}
            </Button>
            {statusMessage && <p className="text-sm text-gray-600 mt-2">{statusMessage}</p>}
        </CardFooter>
        </Card>
    </section>
  );
};

export default ForgotPassword;
