"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Player } from "@/lib/types/custom"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react";

const handlePlayerRemove = (id: string) => {
    // Here, filter another table or perform any action using the `id`
    console.log('Remove from game [ID]:', id);
    // Example: You could call a function to fetch or filter details
};

const handleSendMessage = (id: string) => {
    // Here, filter another table or perform any action using the `id`
    console.log('Send message to [ID]:', id);
    // Example: You could call a function to fetch or filter details
};

export const columns: ColumnDef<Player>[] = [
    {
        accessorKey: "givenName",
        header: "Given Name",
    },
    {
        accessorKey: "surname",
        header: "Surname",
    },
    {
        accessorKey: "experienceLevel",
        header: "Experience",
    },
    {
        accessorKey: "isMinor",
        header: "Is Minor?",
        cell: ({ row }) => {
            const isMinor = row.original.isMinor;
            return (
                <div
                    className={`inline-flex items-center justify-center w-8 h-8 rounded border ${
                        isMinor
                        ? 'border-green-500 text-green-500'
                        : 'border-gray-400 text-gray-400'
                    }`}
                    >
                    <CheckCircle size={20} />
                </div>
            )
        }
    },
    {
        id: 'message', // A custom column for the button
        header: 'Send Message',
        cell: ({ row }) => {
          const id = row.original.id; // Access the hidden `id` field
          return (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSendMessage(id)}
            >
              Send Message
            </Button>
          );
        },
      },
    {
        id: 'kick', // A custom column for the button
        header: 'Kick From Game',
        cell: ({ row }) => {
          const id = row.original.id; // Access the hidden `id` field
          return (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePlayerRemove(id)}
            >
              Kick
            </Button>
          );
        },
      },
];