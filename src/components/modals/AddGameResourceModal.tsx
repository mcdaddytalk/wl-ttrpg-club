// components/modals/AddGameResourceModal.tsx
"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useState } from "react";
import { useUploadGameResource } from "@/hooks/gamemaster/useGamemasterResources";
import { GMGameDO } from "@/lib/types/data-objects";
import { Textarea } from "../ui/textarea";
import { RESOURCE_CATEGORIES, RESOURCE_TYPES, RESOURCE_VISIBILITY } from "@/lib/types/custom";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  games: GMGameDO[];
  onResourceAdded: () => void;
}

export function AddGameResourceModal({ isOpen, onClose, games, onResourceAdded }: Props) {
  const { mutateAsync, isPending } = useUploadGameResource();
  const [gameId, setGameId] = useState("");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [visibility, setVisibility] = useState("members");
  const [category, setCategory] = useState("misc");
  const [resourceType, setResourceType] = useState("file");
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("gameId", gameId);
    formData.append("title", title);
    formData.append("summary", summary ? summary : title);
    formData.append("visibility", visibility);
    formData.append("category", category);
    formData.append("resourceType", resourceType);
    if (file && resourceType === "file") formData.append("file", file);
    if (url && resourceType === "url") formData.append("url", url);

    await mutateAsync(formData);
    onResourceAdded();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader><DialogTitle>Add Game Resource</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Game Selector */}
          <Select onValueChange={setGameId}>
            <SelectTrigger><SelectValue placeholder="Select Game" /></SelectTrigger>
            <SelectContent>
              {games.map((g) => <SelectItem key={g.id} value={g.id}>{g.title}</SelectItem>)}
            </SelectContent>
          </Select>

          {/* Title */}
          <Input placeholder="Resource Title" value={title} onChange={(e) => setTitle(e.target.value)} />

          {/* Summary */}
          <Textarea
            placeholder="Short description of the resource..."
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />

          {/* Visibility */}
          <Select value={visibility} onValueChange={setVisibility}>
            <SelectTrigger><SelectValue placeholder="Visibility" /></SelectTrigger>
            <SelectContent>
              {RESOURCE_VISIBILITY.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}
            </SelectContent>
          </Select>

          {/* Category */}
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              {RESOURCE_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>

          {/* Resource Type */}
          <Select value={resourceType} onValueChange={setResourceType}>
            <SelectTrigger><SelectValue placeholder="Resource Type" /></SelectTrigger>
            <SelectContent>
              {RESOURCE_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>

          {/* Conditional Inputs */}
          {resourceType === "file" && (
            <Input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          )}
          {resourceType === "url" && (
            <Input placeholder="External URL" value={url} onChange={(e) => setUrl(e.target.value)} />
          )}

          <Button type="submit" disabled={isPending}>Upload</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
