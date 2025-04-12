"use client";

import { usePublishedGameResources } from "@/hooks/usePublishedGameResources";
import { GameResourceList } from "@/components/GameResources/GameResourceList";
import { GameResourceFilters } from "@/components/GameResources/GameResourceFilters";
import { useState } from "react";
import { GameResourceFilterParams } from "@/lib/validation/gameResources";
import { GameResourcePreviewModal } from "@/components/Modal/GameResourceModal";
import { GameResourceDO } from "@/lib/types/custom";

export default function MemberResourcesPage() {
    const [filters, setFilters] = useState<GameResourceFilterParams>({});
    const { data: resources = [], isLoading } = usePublishedGameResources("members", filters);
    const [selectedResource, setSelectedResource] = useState<GameResourceDO | null>(null);

    const handleOpenPreview = (resource: GameResourceDO) => setSelectedResource(resource);
    const handleClosePreview = () => setSelectedResource(null);

    const pinned = resources.filter((r) => r.pinned);
    const rest = resources.filter((r) => !r.pinned);

    return (
        <section className="p-6">
            <h1 className="text-2xl font-bold mb-4">Member Resources</h1>
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
        </section>
    );
}