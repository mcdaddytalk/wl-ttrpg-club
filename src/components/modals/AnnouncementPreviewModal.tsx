"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { AnnouncementDO } from "@/lib/types/data-objects";
import { Markdown } from "../Markdown";

export const AnnouncementPreviewModal = ({
  isOpen,
  onClose,
  announcement,
}: {
  isOpen: boolean;
  onClose: () => void;
  announcement: AnnouncementDO | null;
}) => {
  if (!announcement) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{announcement.title}</DialogTitle>
          <DialogDescription>
            Audience: {announcement.audience} | Published:{" "}
            {announcement.published ? "Yes" : "No"}
          </DialogDescription>
        </DialogHeader>
        <div className="prose max-w-full pt-4">
          <Markdown>
            {announcement.body}
          </Markdown>
        </div>
      </DialogContent>
    </Dialog>
  );
};
