import { AdminLocationDO } from "@/lib/types/custom"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuLabel, 
    DropdownMenuSeparator, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"


interface ColumnOptions {
    onOpenModal: (modalName: string, data: AdminLocationDO) => void
}

export const getColumns = ({ onOpenModal }: ColumnOptions): ColumnDef<AdminLocationDO>[] => [
    {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
            className="translate-y-0.5"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            className="translate-y-0.5"
          />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 80,
    },
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => {
            return (<span className="text-sm font-medium ">{row.original.name}</span>)
        },
        enableSorting: true,
        enableHiding: false
    },
    {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => {
            return (<span className="text-sm font-medium ">{row.original.type}</span>)
        },
        enableSorting: true,
        enableHiding: false
    },
    {
        accessorKey: "url",
        header: "URL",
        cell: ({ row }) => {
            return (<span className="text-sm font-medium ">{row.original.url}</span>)
        },
        enableSorting: true,
        enableHiding: false
    },
    {
        accessorKey: "address",
        header: "Address",
        cell: ({ row }) => {
            return (<span className="text-sm font-medium ">{row.original.address}</span>)
        },
        enableSorting: true,
        enableHiding: false
    },
    {
        accessorKey: "authorized_gamemasters",
        header: "Authorized Gamemasters",
        cell: ({ row }) => {
            const gmList = row.original.authorized_gamemasters;            
            return (
                <div className="flex flex-wrap space-x-1 gap-1">
                    {gmList
                        .sort((a, b) => a.surname.localeCompare(b.given_name))
                        .map((gm) => (
                            <span 
                                key={gm.id} 
                                className="px-2 py-1 text-sm font-medium text-white bg-blue-500 rounded-full"
                            >
                                {gm.given_name} {gm.surname}
                            </span>
                        ))}
                </div>
            )            
        }
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const location = row.original;
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
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onOpenModal('editLocation', location)}>
                            <Button
                                variant="outline"
                                size="sm"                                
                            >
                                Edit Location
                            </Button>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onOpenModal('manageGMs', location)}>
                            <Button
                                variant="outline"
                                size="sm"                                    
                            >
                                Manage Authorized GMs
                            </Button>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onOpenModal('removeLocation', location)}>
                            <Button
                                variant="outline"
                                size="sm"                                
                            >
                                Remove Location
                            </Button>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
        enableSorting: false,
        enableHiding: false
    },
]