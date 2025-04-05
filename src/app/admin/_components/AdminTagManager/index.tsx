'use client';

import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { TagData } from '@/lib/types/custom';

export default function AdminTagManager() {
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [newTag, setNewTag] = useState('');
    const [editingTag, setEditingTag] = useState<TagData| null>(null);
    const [deletingTagId, setDeletingTagId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');

    const { data: tags = [], refetch } = useQuery<TagData[]>({
        queryKey: ['admin-tags'],
        queryFn: async () => {
        const res = await fetch('/api/admin/tags');
        return await res.json();
        },
    });

    const handleCreateTag = async () => {
        const res = await fetch('/api/admin/tags', {
            method: 'POST',
            body: JSON.stringify({ name: newTag }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (res.ok) {
            setNewTag('');
            setDialogOpen(false);
            refetch();
        }
    };

    return (
        <>
            <div className="flex justify-end">
                <Button onClick={() => setDialogOpen(true)}>+ New Tag</Button>
            </div>

            <ul className="grid gap-2">
                {tags.map((tag) => (
                    <li
                        key={tag.id}
                        className="flex justify-between items-center border p-2 rounded"
                    >
                        <span>{tag.name}</span>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setEditName(tag.name);
                                    setEditingTag(tag);
                                }}
                            >
                                Edit
                            </Button>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => setDeletingTagId(tag.id)}
                            >
                                Delete
                            </Button>
                        </div>
                    </li>
                ))}
            </ul>

            <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create Tag</DialogTitle>
                        <DialogDescription>Enter the name of the tag</DialogDescription>
                    </DialogHeader>
                    <div className="flex gap-2">
                        <Input
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            placeholder="Tag name"
                        />
                        <Button onClick={handleCreateTag}>Create</Button>
                    </div>
                </DialogContent>
            </Dialog>
            
            <Dialog open={!!editingTag} onOpenChange={() => setEditingTag(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Tag</DialogTitle>
                        <DialogDescription>Change the name of the tag</DialogDescription>
                    </DialogHeader>
                    <div className="flex gap-2">
                        <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
                        <Button
                            onClick={async () => {
                                if (!editingTag) return;
                                await fetch(`/api/admin/tags/${editingTag.id}`, {
                                    method: 'PATCH',
                                    body: JSON.stringify({ name: editName }),
                                    headers: { 'Content-Type': 'application/json' },
                                });
                                setEditingTag(null);
                                refetch();
                            }}
                        >
                            Save
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
    
            <Dialog open={!!deletingTagId} onOpenChange={() => setDeletingTagId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Tag?</DialogTitle>
                        <DialogDescription>Are you sure you want to delete this tag?</DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setDeletingTagId(null)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={async () => {
                                if (!deletingTagId) return;
                                await fetch(`/api/admin/tags/${deletingTagId}`, { method: 'DELETE' });
                                setDeletingTagId(null);
                                refetch();
                            }}
                        >
                            Delete
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
