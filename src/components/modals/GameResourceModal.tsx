"use client";

import { GameResourceDO } from "@/lib/types/custom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface GameResourcePreviewModalProps {
  resource: GameResourceDO | null;
  isOpen: boolean;
  onClose: () => void;
}

export function GameResourcePreviewModal({ resource, isOpen, onClose }: GameResourcePreviewModalProps) {
  if (!resource) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>{resource.title}</DialogTitle>
        </DialogHeader>
        <div className="prose dark:prose-invert max-w-full mt-2">
          <Markdown remarkPlugins={[remarkGfm]}>{resource.body}</Markdown>
        </div>
      </DialogContent>
    </Dialog>
  );
}
