"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Player } from "@/lib/types/custom"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent,
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"

interface PlayerColumnProps {
    onOpenModal: (modalName: string, player: Player) => void;
}

export const getColumns = ({ onOpenModal }: PlayerColumnProps): ColumnDef<Player>[] => [
    {
        accessorKey: "given_name",
        header: "Given Name",
        cell: ({ row }) => {
          return row.getValue("given_name")
        }
    },
    {
        accessorKey: "surname",
        header: "Surname",
        cell: ({ row }) => {
          return row.getValue("surname")
        }
    },
    {
        accessorKey: "experienceLevel",
        header: "Experience",
        cell: ({ row }) => {
          return row.getValue("experienceLevel")
        }
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
        accessorKey: "status_icon",
        header: "Player Status (Icon)",
        cell: ({ row }) => {
            const status = row.original.status_icon;
            return (
                <div className={`inline-flex items-center justify-center w-8 h-8 rounded border`}>
                    {status}
                </div>
            )
        }
    },
    {
      accessorKey: "status",
      header: "Player Status",
      cell: ({ row }) => {
          return  row.getValue("status")
      }
    },
    {
      accessorKey: "statusNotes",
      header: "Status Notes",
      cell: ({ row }) => {
          return  row.getValue("statusNotes")
      }
    },
    {
      id: 'actions', // A custom column for the button
      header: 'Actions',
      cell: ({ row }) => {
        const player = row.original; 
        return (
          <DropdownMenu>
              <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                      >
                          <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                      </svg>
                  </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem key={'player-view'} onClick={() => onOpenModal('viewPlayer', player)}>
                    <Button variant="secondary" size="sm" className="h-8 w-full p-0">
                        <span className="">View</span>
                    </Button>
                </DropdownMenuItem>
                <DropdownMenuItem key={'player-message'} onClick={() => onOpenModal('sendMessage', player)}>
                    <Button variant="secondary" size="sm" className="h-8 w-full p-0">
                        <span className="">Message Player</span>
                    </Button>
                </DropdownMenuItem>
                <DropdownMenuItem key={'player-approve'} onClick={() => onOpenModal('approvePlayer', player)}>
                    <Button variant="secondary" size="sm" className="h-8 w-full p-0">
                        <span className="">{player.status === 'approved' ? 'Unapprove' : 'Approve'}</span>
                    </Button>
                </DropdownMenuItem>
                <DropdownMenuItem key={'player-kick'} onClick={() => onOpenModal('kickPlayer', player)}>
                    <Button variant="secondary" size="sm" className="h-8 w-full p-0">
                        <span className="">Kick</span>
                    </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
];