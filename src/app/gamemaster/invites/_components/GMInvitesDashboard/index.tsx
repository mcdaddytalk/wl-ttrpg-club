"use client"

import { DataTableSkeleton } from "@/components/DataTable/data-table-skeleton";
import useSession from "@/utils/supabase/use-session";
import { User } from "@supabase/supabase-js";
import React from "react";
import { toast } from "sonner";
import GMInvitesCard from "../GMInvitesCard/GMInvitesCard";
import { useDeleteInvite, useGamemasterInvites, useRefreshInvites } from "@/hooks/gamemaster/useGamemasterInvites";

export default function GamemasterInvites(): React.ReactElement {
    const session = useSession();
    const user: User = (session?.user as User) ?? null;
    
    const { data: gmInvites, isLoading } = useGamemasterInvites(user?.id);
    const { mutate: refreshInvites } = useRefreshInvites(user?.id);
    const { mutate: deleteInvite } = useDeleteInvite(user?.id);

    const onInviteAdded = () => {
        refreshInvites();
      };
      
      const onInviteEdit = () => {
        refreshInvites();
      };
      
      const onInviteDelete = (id: string) => {
        deleteInvite(id, {
          onSuccess: () => {
            toast.success("Invite deleted successfully");
            refreshInvites();
          },
          onError: () => {
            toast.error("Failed to delete invite");
          },
        });
      };
      

    return (
        <section className="items-center justify-center">
            <div className="space-y-2 p-2">
            {isLoading 
                ? (
                    <DataTableSkeleton 
                        columnCount={5}
                        searchableColumnCount={3}
                        filterableColumnCount={5}
                        cellWidths={["10rem", "40rem", "12rem", "12rem", "8rem"]}
                        shrinkZero
                    />
                ) 
                : (
                    <GMInvitesCard 
                        invites={gmInvites || []}
                        gamemasterId={user?.id}
                        onInviteAdded={onInviteAdded}
                        onInviteEdit={onInviteEdit}
                        onInviteDelete={onInviteDelete}
                    />    
                )
            }
            </div>
        </section>
    )
}