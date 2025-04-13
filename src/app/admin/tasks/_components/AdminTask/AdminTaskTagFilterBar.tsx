'use client';

import { useQuery } from '@tanstack/react-query';
import { useTaskFilters } from '@/hooks/useTaskFilters';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { TagDO } from '@/lib/types/custom';

export function AdminTaskTagFilterSidebar() {
  const { filters, setFilters } = useTaskFilters();

  const selectedTags = Array.isArray(filters.tags) ? filters.tags : [];

  const { data = [] } = useQuery<TagDO[]>({
    queryKey: ['admin-tags'],
    queryFn: async () => {
      const res = await fetch('/api/admin/tags');
      return res.json() as Promise<TagDO[]>;
    },
  });

  const toggleTag = (tag: string) => {
    const updated = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    setFilters({ tags: updated });
  };

  return (
    <div className="w-48 p-4 border-r space-y-2">
      <h3 className="font-semibold text-sm uppercase text-muted-foreground mb-2">Tags</h3>
      <div className="flex flex-wrap gap-2">
        {data.map((tag) => (
          <Badge
            key={tag.id}
            onClick={() => toggleTag(tag.name)}
            className={cn(
              'cursor-pointer select-none',
              selectedTags.includes(tag.name) ? 'bg-secondary text-white' : 'bg-primary text-primary-foreground'
            )}
          >
            {tag.name}
            {tag.task_count !== undefined && (
              <span className="ml-1 text-xs text-muted-foreground">({tag.task_count})</span>
            )}
          </Badge>
        ))}
      </div>

      {selectedTags && selectedTags.length > 0 && (
        <Button
          size="sm"
          variant="ghost"
          className="mt-2 text-xs"
          onClick={() => setFilters({ tags: [] })}
        >
          Clear filters
        </Button>
      )}
    </div>
  );
}
