"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ConfirmationModal } from "@/components/Modal/ConfirmationModal";
import { MemberDO } from "@/lib/types/custom";
import { useToggleConsent } from "@/hooks/admin/useToggleConsent";

export const ConsentCell = ({ member }: { member: MemberDO }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate: toggleConsent } = useToggleConsent();

  const handleConfirm = () => {
    toggleConsent({
      memberId: member.id,
      newConsent: !member.consent,
    });
    setIsOpen(false);
  };

  return (
    <>
      <Button
        size="sm"
        variant={member.consent ? "default" : "destructive"}
        onClick={() => setIsOpen(true)}
      >
        {member.consent ? "Yes" : "No"}
      </Button>

      <ConfirmationModal
        isOpen={isOpen}
        title="Update Consent"
        description={`Are you sure you want to ${
          member.consent ? "revoke" : "grant"
        } consent for ${member.email}?`}
        onConfirm={handleConfirm}
        onCancel={() => setIsOpen(false)}
      />
    </>
  );
};
