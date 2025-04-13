import { Badge } from '@/components/ui/badge';

export function AdminTaskStatusBadge({ status }: { status: string }) {
  const colorMap: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    pending: 'secondary',
    in_progress: 'default',
    complete: 'outline',
    archived: 'destructive',
  };

  return <Badge variant={colorMap[status] ?? 'default'}>{status.replace('_', ' ')}</Badge>;
}