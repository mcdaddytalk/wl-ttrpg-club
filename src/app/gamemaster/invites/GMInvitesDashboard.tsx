"use client"

import { DataTableSkeleton } from "@/components/DataTable/data-table-skeleton";
import { useQueryClient } from "@/hooks/useQueryClient";
import { InviteData } from "@/lib/types/custom";
import useSession from "@/utils/supabase/use-session";
import { User } from "@supabase/supabase-js";
import { useMutation, useQuery } from "@tanstack/react-query";
import React from "react";
import { toast } from "sonner";
import GMInvitesCard from "../_components/GMInvitesCard/GMInvitesCard";

const fetchInvites = async (gamemasterId: string): Promise<InviteData[]> => {
    const response = await fetch(`/api/gamemaster/${gamemasterId}/invites`, {
        method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    switch (response.status) {
        case 500:
          toast.error("Error fetching invites");
          return [];   
        case 404:
          toast.error("Invites not found");
          return [];
        case 200:
          const invites = await response.json();
          return invites;
        default:
          toast.error("Error fetching invites");
          return [];
    }
}


export default function GamemasterInvites(): React.ReactElement {
    const queryClient = useQueryClient();
    const session = useSession();
    const user: User = (session?.user as User) ?? null;
    
    const { data: gmInvites, isLoading } = useQuery<InviteData[], Error>({
        queryKey: ['invites', 'full', user?.id],
        queryFn: () => fetchInvites(user?.id),
        enabled: !!user?.id,
    });

    const inviteMutation = useMutation({
        mutationFn: () => fetchInvites(user?.id),
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['invites', 'full', user?.id] });
          },
          onError: () => {
            toast.error("Failed to send invites.");
          },
    });

    const onInviteAdded = () => {
        inviteMutation.mutate();
    }

    const onInviteEdit = () => {
        inviteMutation.mutate();
    }

    const onInviteDelete = (id: string) => {
        const response = fetch(`/api/gamemaster/${user?.id}/invites`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ invite_id: id }),
        })

        response.then((res) => {
            if (res.status === 200) {
                toast.success("Invite deleted successfully");
                inviteMutation.mutate();
            } else {
                toast.error("Failed to delete invite");
            }
        });
    }

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