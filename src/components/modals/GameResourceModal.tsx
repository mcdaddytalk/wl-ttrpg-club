"use client";

import { GameResourceDO } from "@/lib/types/data-objects";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, ExternalLink } from "lucide-react";
import { useCallback } from "react";
import { toast } from "sonner";
import Image from "next/image";

interface GameResourcePreviewModalProps {
  resource: GameResourceDO | null;
  isOpen: boolean;
  onClose: () => void;
}

export function GameResourcePreviewModal({ resource, isOpen, onClose }: GameResourcePreviewModalProps) {
  
  const ext = resource?.file_name?.split(".").pop()?.toLowerCase();
  const isImage = ext && ["jpg", "jpeg", "png", "gif", "webp"].includes(ext);
  const isPdf = ext === "pdf";

  const shareUrl =
    resource?.resource_type === "file" && resource.download_url 
      ? resource.download_url 
      : resource?.resource_type === "url" 
        ? resource.external_url 
        : null;

  const handleCopy = useCallback(() => {
    if (!shareUrl) return;

    navigator.clipboard.writeText(shareUrl)
      .then(() => toast.success("Link copied to clipboard"))
      .catch(() => {
        toast.error("Failed to copy link");
      });
  }, [shareUrl]);

  // const encoded = encodeURIComponent(shareUrl || "");

  if (!resource) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between">
          <DialogHeader className="flex-1">
            <DialogTitle>{resource.title}</DialogTitle>
          </DialogHeader>
          
          {shareUrl && (
            <div className="flex gap-2 items-center justify-end mr-[8px]">
              <Button variant="secondary" size="sm" onClick={handleCopy}>
                <Copy className="w-4 h-4 mr-1" />
                Copy Link
              </Button>              
            </div>
          )}
        </div>

        <div className="mt-4 space-y-4">
          <DialogDescription className="text-sm text-slate-600">
            {resource.summary}
          </DialogDescription>

          {/* If markdown body exists, render it */}
          {resource.body ? (
            <div className="prose dark:prose-invert max-w-full">
              <Markdown remarkPlugins={[remarkGfm]}>{resource.body}</Markdown>
            </div>
          ) : resource.resource_type === "file" && resource.download_url ? (
            <>
              {isImage && (
                <Image
                  src={resource.download_url}
                  alt={resource.title}
                  width={1024}
                  height={768}
                  className="rounded-md max-w-full max-h-[70vh] object-contain border"
                />
              )}
              {isPdf && (
                <iframe
                  src={resource.download_url}
                  className="w-full h-[75vh] border rounded-md"
                  title={resource.title}
                />
              )}
              {!isImage && !isPdf && (
                <Button asChild variant="outline">
                  <a href={resource.download_url} target="_blank" rel="noopener noreferrer" download>
                    Download File
                  </a>
                </Button>
              )}
            </>
          ) : resource.resource_type === "url" && resource.external_url ? (
            <Button asChild variant="outline">
              <a href={resource.external_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Open External Link
              </a>
            </Button>
          ) : (
            <p className="text-muted-foreground text-sm italic">No preview available.</p>
          )}          
        </div>
      </DialogContent>
    </Dialog>
  );
}
