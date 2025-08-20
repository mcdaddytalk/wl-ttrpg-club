"use client";

import { usePublishedGameResources } from "@/hooks/usePublishedGameResources";
import { GameResourceList } from "@/components/GameResources/GameResourceList";
import { GameResourceFilters } from "@/components/GameResources/GameResourceFilters";
import { useRef, useState } from "react";
import { GameResourceFilterParams } from "@/lib/validation/gameResources";
import { GameResourcePreviewModal } from "@/components/modals/GameResourceModal";
import { GameResourceDO } from "@/lib/types/data-objects";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function MemberResourcesPage() {
    const [filters, setFilters] = useState<GameResourceFilterParams>({});
    const { data: resources = [], isLoading } = usePublishedGameResources("members", filters);
    const [selectedResource, setSelectedResource] = useState<GameResourceDO | null>(null);

    const handleOpenPreview = (resource: GameResourceDO) => setSelectedResource(resource);
    const handleClosePreview = () => setSelectedResource(null);

    const allResourcesRef = useRef<HTMLDivElement>(null);

    const pinned = resources.filter((r) => r.pinned);
    const rest = resources.filter((r) => !r.pinned);

    const handleScrollToAllResources = () => {
        if (allResourcesRef.current) {
          allResourcesRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      };

      return (
        <section className="p-6">
          <Card className="p-6 space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-6">📚 Member Resources</h1>
              <GameResourceFilters filters={filters} onChange={setFilters} />
            </div>
    
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            ) : (
              <>
                {resources.length === 0 ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>No Resources Found</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">Try adjusting your filters or check back later!</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-6">
                    {pinned.length > 0 && (
                      <div>
                        <h2 className="text-2xl font-semibold mb-4">📌 Pinned Resources</h2>
                        <div className="flex overflow-x-auto space-x-4 pb-2">
                          {pinned.map((resource) => (
                            <div
                              key={resource.id}
                              className="min-w-[250px] max-w-[250px] shrink-0"
                            >
                              <Card
                                className="cursor-pointer hover:shadow-lg transition"
                                onClick={() => handleOpenPreview(resource)}
                              >
                                <CardHeader>
                                  <CardTitle className="text-base">{resource.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <p className="text-sm text-muted-foreground truncate">
                                    {resource.summary || "No description available"}
                                  </p>
                                </CardContent>
                              </Card>
                            </div>
                          ))}
                        </div>
    
                        {/* 👇 View All Button */}
                        <div className="mt-4 flex justify-center">
                          <Button variant="outline" onClick={handleScrollToAllResources}>
                            View All Resources
                          </Button>
                        </div>
                      </div>
                    )}
    
                    {/* All Resources Section */}
                    <div ref={allResourcesRef}>
                      <h2 className="text-2xl font-semibold mb-4">All Resources</h2>
                      <GameResourceList member onSelect={handleOpenPreview} resources={rest} />
                    </div>
                  </div>
                )}
              </>
            )}
    
            <GameResourcePreviewModal
              resource={selectedResource}
              isOpen={!!selectedResource}
              onClose={handleClosePreview}
            />
          </Card>
        </section>
      );
}