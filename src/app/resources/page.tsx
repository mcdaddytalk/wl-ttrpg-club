"use client";

import { GameResourceFilters } from "@/components/GameResources/GameResourceFilters";
import { GameResourceList } from "@/components/GameResources/GameResourceList";
import { GameResourcePreviewModal } from "@/components/Modal/GameResourceModal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usePublishedGameResources } from "@/hooks/usePublishedGameResources";
import { GameResourceDO } from "@/lib/types/custom";
import { GameResourceFilterParams } from "@/lib/validation/gameResources";
import { useState } from "react";

export default function PublicResourcesPage() {
  const [filters, setFilters] = useState<GameResourceFilterParams>({});
  const { data: resources = [], isLoading } = usePublishedGameResources("public", filters);
  const [selectedResource, setSelectedResource] = useState<GameResourceDO | null>(null);

  const handleOpenPreview = (resource: GameResourceDO) => setSelectedResource(resource);
  const handleClosePreview = () => setSelectedResource(null);

  const pinned = resources.filter((r) => r.pinned);
  const rest = resources.filter((r) => !r.pinned);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold mb-4">Game Resources</CardTitle>
        <CardDescription>Public Game Resources</CardDescription>
      </CardHeader>
      <CardContent>
        <GameResourceFilters filters={filters} onChange={setFilters} />
        {isLoading 
                  ? <p>Loading...</p> 
                  : (
                      <div className="mb-8">
                      {pinned.length > 0 && (
                          <div className="mb-8">
                            <h2 className="text-lg font-semibold mb-2">📌 Pinned Resources</h2>
                            <GameResourceList onSelect={handleOpenPreview} resources={pinned} />
                          </div>
                      )}
                          <GameResourceList onSelect={handleOpenPreview} resources={rest} />
                      </div>
                  )}  
        <GameResourcePreviewModal
          resource={selectedResource}
          isOpen={!!selectedResource}
          onClose={handleClosePreview}
        />
      </CardContent>
    </Card>
  );
}