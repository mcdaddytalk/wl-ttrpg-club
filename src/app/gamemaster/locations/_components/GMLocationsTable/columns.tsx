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
import { GMLocationDO } from "@/lib/types/custom"
import { MapPin, Monitor, MessageCircle } from "lucide-react"; // Adjust icon set if needed


interface ColumnOptions {
    onOpenModal: (modalName: string, data: GMLocationDO) => void
}

export const getColumns = ({ onOpenModal }: ColumnOptions): ColumnDef<GMLocationDO>[] => [
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
            const type = row.original.type;
            const iconMap: Record<string, React.ReactElement> = {
              discord: <MessageCircle className="w-4 h-4 text-indigo-500" />,
              vtt: <Monitor className="w-4 h-4 text-blue-500" />,
              physical: <MapPin className="w-4 h-4 text-green-500" />,
            };
        
            return (
              <div className="flex items-center gap-2">
                {iconMap[type]}
                <span className="capitalize">{type}</span>
              </div>
            );
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
          const address = row.original.address;
          return (
            <span
              className="text-sm font-medium truncate max-w-[250px] block"
              title={address}
            >
              {address}
            </span>
          );
        },
        enableSorting: true,
        enableHiding: false
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const location = row.original;
            const { scope } = location;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={scope !== 'gm'}>
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