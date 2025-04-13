"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { AnnouncementDO } from "@/lib/types/custom";

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
          <Markdown remarkPlugins={[remarkGfm]}>
            {announcement.body}
          </Markdown>
        </div>
      </DialogContent>
    </Dialog>
  );
};
