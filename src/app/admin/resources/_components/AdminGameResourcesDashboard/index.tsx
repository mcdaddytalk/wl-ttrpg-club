"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminGameResources } from "@/hooks/admin/useAdminGameResources";
import AdminGameResourcesTable from "../AdminGameResourcesTable";
import { useState } from "react";
import AdminGameResourceForm from "../AdminGameResourceForm";
import { GameResourceDO } from "@/lib/types/custom";
import { DataTableSkeleton } from "@/components/DataTable/data-table-skeleton";

export default function AdminGameResourcesDashboard() {
  const { data: resources = [], isLoading } = useAdminGameResources();
  const [selectedResource, setSelectedResource] = useState<GameResourceDO | undefined>();

  const handleSaved = () => {
    setSelectedResource(undefined); // Reset to create mode
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Resource Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            {selectedResource ? "Edit Resource" : "Create Resource"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AdminGameResourceForm
            defaultValues={selectedResource}
            onSaved={handleSaved}
          />
        </CardContent>
      </Card>

      {/* Resource Table */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold">Game Resources</h2>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <DataTableSkeleton rowCount={6} columnCount={6} />
          ) : (
            <AdminGameResourcesTable
              data={resources}
              isLoading={isLoading}
              onEdit={setSelectedResource}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
