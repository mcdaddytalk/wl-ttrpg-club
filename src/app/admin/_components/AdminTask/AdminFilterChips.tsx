import { useTaskFilters } from '@/hooks/useTaskFilters';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

export function AdminTaskFilterChips() {
  const { filters, setFilters } = useTaskFilters();
  const chips: { label: string; key: keyof typeof filters }[] = [];

  if (filters.status) chips.push({ label: `Status: ${filters.status}`, key: 'status' });
  if (filters.priority) chips.push({ label: `Priority: ${filters.priority}`, key: 'priority' });
  if (filters.assigned_to) chips.push({ label: `Assigned`, key: 'assigned_to' });
  if (filters.due_before) chips.push({ label: `Due before: ${filters.due_before}`, key: 'due_before' });
  if (filters.search) chips.push({ label: `Search: ${filters.search}`, key: 'search' });
  if (filters.include_archived) chips.push({ label: `Showing Archived`, key: 'include_archived' });
  if (Array.isArray(filters.tags)) {
    for (const tag of filters.tags) {
      chips.push({ label: `Tag: ${tag}`, key: 'tags' });
    }
  }

  const clearFilter = (key: keyof typeof filters) => {
    if (key === 'tags') {
      setFilters({ tags: [] });
    } else {
      setFilters({ [key]: undefined });
    }
  };

  const clearAllFilters = () => 
    setFilters({
      status: undefined,
      priority: undefined,
      search: undefined,
      assigned_to: undefined,
      due_before: undefined,
      include_archived: undefined,
      tags: [],
    });

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {chips.map((chip, index) => (
        <Badge
          key={index}
          className="gap-1 pr-2"
          variant="outline"
        >
          {chip.label}
          <X
            className="w-3 h-3 cursor-pointer"
            onClick={() => clearFilter(chip.key)}
          />
        </Badge>
      ))}
      <Badge
        className="gap-1 pr-2 text-destructive border-destructive/50"
        variant="outline"
        onClick={clearAllFilters}
      >
        Clear All Filters
        <X className="w-3 h-3 cursor-pointer" />
      </Badge>
    </div>
  );
}
