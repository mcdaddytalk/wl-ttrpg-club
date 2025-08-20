"use client";

import { GameResourceDO } from "@/lib/types/data-objects";
import { Button } from "../ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { useDeleteGameResource } from "@/hooks/gamemaster/useGamemasterResources";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";
import { ImageIcon, FileIcon, ExternalLink, FileText } from "lucide-react";
import { Badge } from "../ui/badge";
import { formatDate } from "@/utils/helpers";
import Image from "next/image";

interface GameResourceProps {
  member?: boolean;
  resources: GameResourceDO[];
  onSelect: (resource: GameResourceDO) => void;
  refetch?: () => void;
}

export const GameResourceList = ({ member, resources, onSelect, refetch }: GameResourceProps) => {
  const { mutateAsync: deleteResource } = useDeleteGameResource();

  // State for confirmation modal
  const [resourceToDelete, setResourceToDelete] = useState<GameResourceDO | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openDeleteModal = (resource: GameResourceDO) => setResourceToDelete(resource);
  const closeDeleteModal = () => setResourceToDelete(null);

  const handleConfirmDelete = async () => {
    if (!resourceToDelete || member) return;
    setIsDeleting(true);
    try {
      await deleteResource(resourceToDelete.id);
      toast.success("Resource deleted");
      refetch?.();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete resource");
    } finally {
      setIsDeleting(false);
      closeDeleteModal();
    }
  };

  if (resources.length === 0) {
    return <p className="text-muted-foreground">No resources available.</p>;
  }

  const renderThumbnail = (resource: GameResourceDO) => {
    if (resource.resource_type === "url") return <ExternalLink className="h-10 w-10 text-blue-600" />;
    if (resource.resource_type === "file") {
      const ext = resource.file_name?.split(".").pop()?.toLowerCase();
      if (ext && ["png", "jpg", "jpeg", "gif", "webp"].includes(ext)) {
        return (
          <Image
            src={resource.download_url || ""}
            alt={resource.title}
            width={80}
            height={80}
            className="h-20 w-20 object-cover rounded-md border"
          />
        );
      }
      if (ext && ["pdf"].includes(ext)) return <FileText className="h-10 w-10 text-red-600" />;
      return <FileIcon className="h-20 w-20 text-gray-500" />;
    }
    return <ImageIcon className="h-20 w-20 text-gray-400" />;
  };

  return (
    <div className="space-y-3">
      {resources.map((resource) => (
        <div
          key={resource.id}
          className="flex items-center justify-between border rounded-md p-3 shadow-sm hover:bg-accent transition"
        >
          {/* Left: Thumbnail + Details */}
          <div className="flex items-center gap-3 flex-1 cursor-pointer" onClick={() => onSelect?.(resource)}>
            {renderThumbnail(resource)}
            <div className="flex flex-col">
              <span className="font-semibold">{resource.title}</span>
              <span className="text-sm text-muted-foreground">{resource.game_title}</span>
              <div className="flex gap-2 items-center mt-1">
                <Badge variant="secondary">{resource.resource_type}</Badge>
                <span className="text-xs text-muted-foreground">Uploaded by {resource.uploader_name}</span>
                <span className="text-xs text-muted-foreground">{formatDate(new Date(resource.created_at), { formatStr: "MMMM D, YYYY" })}</span>
              </div>
            </div>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex gap-2">
            {resource.resource_type === "file" ? (
              <Button asChild variant="outline" size="sm">
                <a href={resource.download_url} target="_blank" rel="noopener noreferrer" download>
                  Download
                </a>
              </Button>
            ) : (
              <Button asChild variant="outline" size="sm">
                <a href={resource.external_url} target="_blank" rel="noopener noreferrer">
                  Open Link
                </a>
              </Button>
            )}
            {!member && 
              <Button variant="destructive" size="sm" onClick={() => openDeleteModal(resource)}>
                Delete
              </Button>
            }
          </div>
        </div>
      ))}

      {/* Confirmation Modal */}
      {resourceToDelete && (
        <ConfirmationModal
          title="Delete Resource?"
          description={`Are you sure you want to delete "${resourceToDelete.title}"? This action cannot be undone.`}
          isOpen={!!resourceToDelete}
          onCancel={closeDeleteModal}
          onConfirm={handleConfirmDelete}
          confirmDelayMs={2000}
          isLoading={isDeleting}
        />
      )}
    </div>
  );
};
