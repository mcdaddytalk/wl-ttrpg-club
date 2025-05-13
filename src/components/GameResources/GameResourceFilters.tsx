"use client"

import { RESOURCE_CATEGORIES, ResourceCategory } from "@/lib/types/custom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useDebounce } from "@/hooks/use-debounce";
import { GameResourceFilterParams } from "@/lib/validation/gameResources";
import { toSentenceCase } from "@/utils/helpers";

interface GameResourceFiltersProps {
    filters: GameResourceFilterParams;
    onChange: (filters: GameResourceFilterParams) => void;
}

export function GameResourceFilters({ filters, onChange }: GameResourceFiltersProps) {
    const [debouncedSearch, setSearch] = useDebounce(filters.search ?? "", 300, (value) =>
        onChange({ ...filters, search: value })
        );

    return (
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Input
                placeholder="Search resources..."
                value={debouncedSearch}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-64"
            />
            <Select
                value={filters.category ?? ""}
                onValueChange={(value) =>
                    onChange({
                    ...filters,
                    category: value === "all" ? undefined : (value as ResourceCategory),
                    })
                }
            >
                <SelectTrigger className="w-48">
                    <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {Object.values(RESOURCE_CATEGORIES).map((cat) => (
                        <SelectItem key={cat} value={cat}>
                            {toSentenceCase(cat)}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
                <Switch
                    checked={filters.pinned ?? false}
                    onCheckedChange={(v) => onChange({ ...filters, pinned: v })}
                />
                <Label>Pinned Only</Label>
            </div>
        </div>
    );
}