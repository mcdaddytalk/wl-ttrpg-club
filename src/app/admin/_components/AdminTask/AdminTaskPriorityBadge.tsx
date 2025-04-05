import { Badge } from '@/components/ui/badge';

export function AdminTaskPriorityBadge({ priority }: { priority: string }) {
  const colorMap: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    low: 'outline',
    medium: 'default',
    high: 'secondary',
    critical: 'destructive',
  };

  return <Badge variant={colorMap[priority] ?? 'default'}>{priority}</Badge>;
}
