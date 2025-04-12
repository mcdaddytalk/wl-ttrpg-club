'use client';

import { useAnnouncements } from '@/hooks/useAnnouncements';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Card, CardContent, CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label'; 
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
    Select, SelectTrigger, SelectValue,
  SelectContent, SelectItem,
} from '@/components/ui/select';
import {
  Textarea
} from '@/components/ui/textarea';
import { useState } from 'react';
import { toast } from 'sonner';
import { AnnouncementDO, DataTableFilterField } from '@/lib/types/custom';
import { useDataTable } from '@/hooks/use-data-table';
import { getColumns } from './columns';
import { DataTable } from '@/components/DataTable/data-table';
import { DataTableToolbar } from '@/components/DataTable/data-table-toolbar';
import { DataTableSkeleton } from '@/components/DataTable/data-table-skeleton';
import { useAuth } from '@/hooks/useAuth';
import { toSentenceCase } from '@/lib/utils';
import { AnnouncementPreviewModal } from '@/components/Modal/AnnouncementPreviewModal';

const formSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  body: z.string().min(1, 'Body is required'),
  audience: z.enum(['public', 'members', 'gamemasters', 'admins']),
  pinned: z.boolean().optional(),
  published: z.boolean().optional(),
  notify_on_publish: z.boolean().optional(),
  published_at: z.string().optional().nullable(),
  approved_by: z.string().optional().nullable()
});

type FormValues = z.infer<typeof formSchema>;

const DEFAULT_VALUES: FormValues = {
    title: '',
    body: '',
    audience: 'public',
    pinned: false,
    published: false,
    notify_on_publish: false,
    published_at: null,
  };

export default function AnnouncementsDashboard() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    
    const { announcements = [], isLoading } = useAnnouncements({ published: false }, 3600000);
    
    const [previewing, setPreviewing] = useState(false);
    const [previewModalOpen, setPreviewModalOpen] = useState(false);
    const [previewAnnouncement, setPreviewAnnouncement] = useState<AnnouncementDO | null>(null);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            body: '',
            audience: 'public',
            pinned: false,
            published: false,
            notify_on_publish: false,
            published_at: null,
            approved_by: null
        },
    });

    const { mutate: saveAnnouncement, isPending: isSaving } = useMutation({
        mutationFn: async (values: FormValues) => {
        const method = values.id ? 'PATCH' : 'POST';
        const endpoint = values.id ? `/api/announcements/${values.id}` : '/api/announcements';
        const res = await fetch(endpoint, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
        });
        if (!res.ok) throw new Error('Failed to save announcement');
        return res.json();
        },
        onSuccess: (updated) => {
            queryClient.invalidateQueries({ queryKey: ['announcements'] });
            form.reset(DEFAULT_VALUES);
            toast.success(`${updated.title} saved successfully`);
        },
        onError: () => {
            toast.error('Failed to save announcement');
        },
    });

    const bulkDelete = useMutation({
        mutationFn: async () => {
            const selectedIds = table.getSelectedRowModel().rows.map(row => row.original.id);
            const res = await Promise.all(
                selectedIds.map(id => fetch(`/api/announcements/${id}`, {
                method: 'DELETE',
            }))
        );
        if (res.some(r => !r.ok)) throw new Error('Some deletions failed');
        },
        onSuccess: () => {
            toast.success('Deleted selected announcements');
            table.resetRowSelection();
            queryClient.invalidateQueries({ queryKey: ['announcements'] });
        },
        onError: () => {
            toast.error('Failed to delete one or more announcements');
        }
    });

    const handleSubmit = form.handleSubmit((values) => {
        if (!values.published_at && values.published) {
            values.published_at = new Date().toISOString();
        }
        if (values.published_at) {
            values.published_at = new Date(values.published_at).toISOString();
        }
        values.approved_by = user?.id;
        saveAnnouncement(values);
    });

    const handleEdit = (announcement: FormValues) => {
        form.reset(announcement);
        setPreviewing(false);
    };

    const handlePreview = (announcement: AnnouncementDO) => {
        setPreviewAnnouncement(announcement);
        setPreviewModalOpen(true);
    };

    const filterFields: DataTableFilterField<AnnouncementDO>[] = [
        {
            id: "title",
            label: "Title",
            placeholder: "Search title..."
          },
          {
            id: "audience",
            label: "Audience",
            options: ["public", "members", "gamemasters", "admins"].map(v => ({ value: v, label: toSentenceCase(v) })),
          },
          {
            id: "pinned",
            label: "Pinned",
            options: [
              { value: "true", label: "Yes" },
              { value: "false", label: "No" },
            ]
          },
          {
            id: "published",
            label: "Published",
            options: [
              { value: "true", label: "Yes" },
              { value: "false", label: "No" },
            ]
          },
    ];
    const pageSize = 5;
    const pageCount = Math.ceil((announcements?.length || 0) / pageSize);

    const { table } = useDataTable<AnnouncementDO>({
        data: announcements || [],
        columns: getColumns({ onHandleEdit: handleEdit, onHandlePreview: handlePreview }),
        pageCount: pageCount || -1,
        filterFields,
        enableAdvancedFilter: false,
        initialState: {
            pagination: {
                pageSize,
                pageIndex: 0
            },
        },
        getRowId: (row) => row.id,
        shallow: false,
        clearOnDefault: true
    })


    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
                <Card>
                    <CardHeader>
                        <CardTitle className='text-2xl bold'>{form.watch('id') ? 'Edit' : 'Create'} Announcement</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label>Title</Label>
                                <Input {...form.register('title')} />
                                {form.formState.errors.title && (
                                    <p className="text-sm text-red-600">{form.formState.errors.title.message}</p>
                                )}
                            </div>
                            <div>
                                <Label>Body</Label>
                                <Textarea rows={6} {...form.register('body')} />
                                {form.formState.errors.body && (
                                    <p className="text-sm text-red-600">{form.formState.errors.body.message}</p>
                                )}
                                <Button variant="link" type="button" onClick={() => setPreviewing(!previewing)}>
                                    {previewing ? 'Hide Preview' : 'Show Preview'}
                                </Button>
                                {previewing && (
                                    <div className="prose mt-2">
                                        <Markdown remarkPlugins={[remarkGfm]}>{form.watch('body')}</Markdown>
                                    </div>
                                )}
                            </div>
                            <div>
                                <Controller
                                    control={form.control}
                                    name="audience"
                                    render={({ field }) => (
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger>
                                        <SelectValue placeholder="Select audience" />
                                        </SelectTrigger>
                                        <SelectContent>
                                        {['public', 'members', 'gamemasters', 'admins'].map((opt) => (
                                            <SelectItem key={opt} value={opt}>
                                            {opt}
                                            </SelectItem>
                                        ))}
                                        </SelectContent>
                                    </Select>
                                    )}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label>Pinned</Label>
                                <Switch checked={form.watch('pinned')} onCheckedChange={(val) => form.setValue('pinned', val)} />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label>Published</Label>
                                <Switch checked={form.watch('published')} onCheckedChange={(val) => form.setValue('published', val)} />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label>Notify on Publish</Label>
                                <Switch checked={form.watch('notify_on_publish')} onCheckedChange={(val) => form.setValue('notify_on_publish', val)} />
                            </div>
                            <div>
                                <Label>Publish At</Label>
                                <Input
                                    type="datetime-local"
                                    value={form.watch("published_at") ?? ""}
                                    onChange={(e) => form.setValue("published_at", e.target.value || null)}
                                />
                            </div>
                            <Button type="submit" disabled={isSaving}>
                                {form.watch('id') ? 'Update' : 'Create'} Announcement
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>

            <div className="lg:col-span-2">
                <Card>
                    <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <CardTitle className='text-2xl bold'>Existing Announcements</CardTitle>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() => queryClient.invalidateQueries({ queryKey: ["announcements"] })}
                            >
                                Refresh
                            </Button>
                            <Button 
                                variant="destructive" 
                                disabled={table.getSelectedRowModel().rows.length === 0}
                                onClick={() => bulkDelete.mutate()}
                            >
                                Delete Selected
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                    {isSaving || isLoading ? (
                        <DataTableSkeleton 
                            rowCount={6}
                            columnCount={7}
                            searchableColumnCount={3}
                            filterableColumnCount={5}
                            cellWidths={["10rem", "40rem", "12rem", "12rem", "8rem", "8rem"]}
                            shrinkZero
                            />
                    ) : (
                        <DataTable
                            table={table}
                        >
                            <DataTableToolbar table={table} filterFields={filterFields}>
                                
                            </DataTableToolbar>
                        </DataTable>
                    )}
                    <AnnouncementPreviewModal
                        isOpen={previewModalOpen}
                        onClose={() => setPreviewModalOpen(false)}
                        announcement={previewAnnouncement}
                    />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}