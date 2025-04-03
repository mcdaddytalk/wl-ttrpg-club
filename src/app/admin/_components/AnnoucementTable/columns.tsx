import { AnnouncementDO } from "@/lib/types/custom"
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
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { BooleanCellWithTooltip, DateCell } from "@/components/DataTable/data-table-cell-helpers"


interface ColumnOptions {
    onHandleEdit: (announcement: AnnouncementDO) => void
}

export const getColumns = ({ onHandleEdit }: ColumnOptions): ColumnDef<AnnouncementDO>[] => [
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
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => {
            const { title, body } = row.original;
            return (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span className="text-sm font-medium ">{row.original.title}</span>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{title}</p>
                        <p>{body}</p>
                    </TooltipContent>
                </Tooltip>
            )
        },
        enableSorting: true,
        enableHiding: false
    },
    {
        accessorKey: "audience",
        header: "Audience",
        cell: ({ row }) => {
            return (<span className="text-sm font-medium ">{row.original.audience}</span>)
        },
        enableSorting: true,
        enableHiding: false
    },
    {
        accessorKey: "pinned",
        header: "Pinned",
        cell: ({ row }) => {
            const { pinned } = row.original;
            return (
                <BooleanCellWithTooltip
                    value={pinned} 
                    label="Pinned"
                />
            );
        },
        enableSorting: true,
        enableHiding: false
    },
    {
        accessorKey: "published",
        header: "Published",
        cell: ({ row }) => {
            const { published } = row.original;
            return (
                <BooleanCellWithTooltip
                    value={published} 
                    label="Published"
                />
            );
        },
        enableSorting: true,
        enableHiding: false
    },
    {
        accessorKey: "published_at",
        header: "Published At",
        cell: ({ row }) => {
            return (
                <DateCell 
                    date={row.original.published_at}
                    label="Published At"
                />
            )
        },
        enableSorting: true,
        enableHiding: false
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const announcement = row.original;
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
                        <DropdownMenuItem onClick={() => onHandleEdit(announcement)}>
                            <Button
                                variant="outline"
                                size="sm"                                
                            >
                                Edit Announcement
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