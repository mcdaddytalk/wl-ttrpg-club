'use client';

import { useState } from 'react';
import { TaskPriorityEnum, TaskStatusEnum } from '@/lib/validation/tasks';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { SelectValue } from '@radix-ui/react-select';
import { useTaskFilters } from '@/hooks/useTaskFilters';
import { useAdminMembers } from '@/hooks/admin/useAdminMembers';
import { TaskPriority, TaskStatus } from '@/lib/types/custom';
import { Switch } from '@/components/ui/switch';
import clsx from 'clsx';

export function AdminTaskFilterBar() {
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const { filters, setFilters } = useTaskFilters();
  const { data: members = [] } = useAdminMembers();

  return (
    <div className="flex flex-col gap-4">
      {/* Mobile Toggle */}
      <div className="md:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowMobileFilters((prev) => !prev)}
        >
          {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
        </Button>
      </div>

      {/* Animated Container */}
      <div
        className={clsx(
          'overflow-hidden transition-all duration-300 md:transition-none',
          showMobileFilters ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0',
          'md:max-h-none md:opacity-100 md:flex md:flex-col gap-4'
        )}
      >
        {/* Row 1 */}
        <div className="flex flex-col md:flex-row flex-wrap gap-3 items-start md:items-end">
          <Select
            value={(filters.status ?? '') as TaskStatus | ''}
            onValueChange={(val: TaskStatus | '') =>
              setFilters({ status: val === '' ? undefined : val })
            }
          >
            <SelectTrigger className="w-full md:w-auto">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {TaskStatusEnum.options.map((s) => (
                <SelectItem key={s} value={s}>
                  {s.replace('_', ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={(filters.priority ?? '') as TaskPriority | ''}
            onValueChange={(val: TaskPriority | '') =>
              setFilters({ priority: val === '' ? undefined : val })
            }
          >
            <SelectTrigger className="w-full md:w-auto">
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              {TaskPriorityEnum.options.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.assigned_to ?? ''}
            onValueChange={(val) => setFilters({ assigned_to: val || undefined })}
          >
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Assigned to" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unassigned">Unassigned</SelectItem>
              {members.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.displayName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Row 2 */}
        <div className="flex flex-col md:flex-row flex-wrap gap-3 items-start md:items-end">
          <Input
            type="date"
            className="w-full md:w-44"
            value={filters.due_before ?? ''}
            onChange={(e) =>
              setFilters({ due_before: e.target.value || undefined })
            }
          />

          <div className="flex items-center gap-3">
            <Switch
              id="include_archived"
              checked={filters.include_archived ?? false}
              onCheckedChange={(checked) => setFilters({ include_archived: checked })}
            />
            <label htmlFor="include_archived" className="text-sm text-muted-foreground">
              Include archived
            </label>
          </div>

          <Input
            value={filters.search ?? ''}
            onChange={(e) => setFilters({ search: e.target.value || undefined })}
            placeholder="Search title/description"
            className="w-full md:w-60"
          />
        </div>
      </div>
    </div>
  );
}
