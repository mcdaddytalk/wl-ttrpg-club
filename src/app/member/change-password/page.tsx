"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import useSession from "@/utils/supabase/use-session";
// import { redirect } from "next/navigation";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<null | string>(null);
  //const supabase = useSupabaseBrowserClient();
  //const queryClient = useQueryClient();
  const session = useSession();

  console.debug('Session:  ', session);
  
  const handleChangePassword = async () => {
    setLoading(true);
    setStatusMessage(null);

    if (newPassword !== confirmNewPassword) {
      setStatusMessage("New passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update password.");
      }

      toast.success(data.message || "Your password has been updated successfully!");
      setStatusMessage("Your password has been updated successfully!");      
    } catch (err) {
        toast.error((err as Error).message || "Failed to update password.");
        setStatusMessage((err as Error).message || "Failed to update password.");
    } finally {
      setLoading(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    }
  };

  return (
    <section className="py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Change Your Password</CardTitle>
          <CardDescription>
            Update your password by entering your current password and the new password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              type="password"
              placeholder="Enter your old password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              disabled={loading}
              required
            />
            <Input
              type="password"
              placeholder="Enter your new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={loading}
              required
            />
            <Input
              type="password"
              placeholder="Confirm your new password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-center">
          <Button
            onClick={handleChangePassword}
            disabled={loading || !oldPassword || !newPassword || !confirmNewPassword}
            className="w-full"
          >
            {loading ? "Updating..." : "Change Password"}
          </Button>
          {statusMessage && <p className="text-sm text-gray-600 mt-2">{statusMessage}</p>}
        </CardFooter>
      </Card>
    </section>
  );
};

export default ChangePassword;
