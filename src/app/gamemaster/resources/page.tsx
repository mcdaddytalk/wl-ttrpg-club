"use client";

import { GameResourceFilters } from "@/components/GameResources/GameResourceFilters";
import { usePublishedGameResources } from "@/hooks/usePublishedGameResources";
import { GameResourceList } from "@/components/GameResources/GameResourceList";
import { useState } from "react";
import { GameResourceFilterParams } from "@/lib/validation/gameResources";
import { GameResourcePreviewModal } from "@/components/modals/GameResourceModal";
import { GameResourceDO } from "@/lib/types/data-objects";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AddGameResourceModal } from "@/components/modals/AddGameResourceModal";
import { useGamemasterGamesFull } from "@/hooks/gamemaster/useGamemasterGames";

export default function GamemasterResourcesPage() {
    const [filters, setFilters] = useState<GameResourceFilterParams>({});
    const { data: resources = [], isLoading, refetch } = usePublishedGameResources("gamemasters", filters);
    const { games = [] } = useGamemasterGamesFull();
    const [selectedResource, setSelectedResource] = useState<GameResourceDO | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);

    const handleOpenPreview = (resource: GameResourceDO) => setSelectedResource(resource);
    const handleClosePreview = () => setSelectedResource(null);

    const handleOpenAddModal = () => setShowAddModal(true);
    const handleCloseAddModal = () => setShowAddModal(false);

    const pinned = resources.filter((r) => r.pinned);
    const rest = resources.filter((r) => !r.pinned);

    return (
        <section>
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl font-bold">Game Resources</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-between items-center mb-2">
                        <Button onClick={handleOpenAddModal} className="bg-green-400 hover:bg-green-600 text-slate-700 rounded-md px-4 py-2">+ Add Resource</Button>
                        <GameResourceFilters filters={filters} onChange={setFilters} />
                    </div>
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
                    <AddGameResourceModal
                        isOpen={showAddModal}
                        games={games}
                        onClose={handleCloseAddModal}
                        onResourceAdded={refetch}
                    />
                </CardContent>
            </Card>
        </section>
    );
}