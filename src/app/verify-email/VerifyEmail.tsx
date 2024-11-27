"use client";

import { useSearchParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { toast } from "sonner";

const VerifyEmail = (): React.ReactElement => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [loading, setLoading] = useState(false);
  const [resendStatus, setResendStatus] = useState<null | string>(null);

  const handleResend = async () => {
    setLoading(true);
    setResendStatus(null);

    try {
      if (!email) {
        throw new Error("No email provided.");
      }
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to resend email.");
      }
      setResendStatus("Verification email resent successfully!");
      toast.success("Verification email resent successfully!");
    } catch (err) {
      setResendStatus((err as Error).message || "Failed to resend email.");
      toast.error((err as Error).message || "Failed to resend email.");
    } finally {
      setLoading(false);
    }
  };

  return (
      <section className="flex items-center justify-center p-6">
            <Card className="max-w-md mx-auto mt-10">
          <CardHeader>
            <CardTitle>Verify Your Email</CardTitle>
            <CardDescription>
              {email ? (
                <>We sent a verification link to <strong>{email}</strong>. Check your inbox and spam folder.</>
              ) : (
                "We couldn't find an email address in the URL."
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>If you didn&apos;t receive the email or need a new link, click the button below to resend the verification email.</p>
          </CardContent>
          <CardFooter className="flex flex-col items-center">
            <Button onClick={handleResend} disabled={loading || !email} variant="default" className="w-full">
              {loading ? "Resending..." : "Resend Email"}
            </Button>
            {resendStatus && <p className="text-sm text-slate-600 mt-2">{resendStatus}</p>}
          </CardFooter>
        </Card>
      </section>
  );
};

export default VerifyEmail;