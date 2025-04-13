'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MemberDO } from "@/lib/types/custom"
import { formatDate, toSentenceCase } from "@/lib/utils";
import { useEffect, useState } from "react";

import { useToggleConsent } from "@/hooks/admin/useToggleConsent";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAllRoles, useUpdateRoles } from "@/hooks/admin/useAdminRoles";


interface AdminMemberDetailProps {
    memberId: string;
}

import { useQuery } from "@tanstack/react-query";
import { getMemberByIdQueryOptions } from "@/queries/admin";
import { Checkbox } from "@/components/ui/checkbox";
import { useAddUpdateAdminNote } from "@/hooks/admin/useAdminNotes";
import useSession from "@/utils/supabase/use-session";


const AdminMemberDetail = ({memberId}: AdminMemberDetailProps) => {
    const user = useSession()?.user;
    const { data: member, isLoading, error } = useQuery<MemberDO>(getMemberByIdQueryOptions(memberId));
    const [newNote, setNote] = useState("");
    const { mutate: addNote, isPending } = useAddUpdateAdminNote();
    const { mutate: toggleConsent, isPending: isToggling } = useToggleConsent();
    const { data: allRoles = [] } = useAllRoles();
    const { mutate: updateRoles, isPending: isUpdatingRoles } = useUpdateRoles(memberId);
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

    useEffect(() => {
        if (!member) return;
        if (member.roles) {
            setSelectedRoles(member.roles.map((r) => r.id));
        }
    }, [member]);

    const handleAddNote = () => {
        if (!user || !member) return;
        if (newNote.trim().length === 0) return;
        addNote({
          note: newNote,
          target_type: "member",
          target_id: member.id,
          author_id: user.id,
        }, {
          onSuccess: () => setNote(""),
        });
    };
    
    const toggleRole = (id: string) => {
        setSelectedRoles((prev) =>
          prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
        );
    };   

    if (isLoading) return <p>Loading...</p>;
    if (error || !member) return <p>Error loading member details.</p>;

    const handleToggleConsent = () => {
        toggleConsent({ memberId: member.id, newConsent: !member.consent }, {
          onSuccess: () => {
            toast.success(member.consent ? "Consent revoked" : "Consent granted");
          },
          onError: () => {
            toast.error(member.consent ? "Failed to revoke consent" : "Failed to grant consent");
          },
        });
    };

    return (
        <div className="space-y-6">
          {/* Member Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                {member.given_name} {member.surname}
              </CardTitle>
              <CardDescription>{member.email}</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div><strong>Status:</strong> <Badge variant="outline">{member.status}</Badge></div>
                <div><strong>Consent:</strong> <Badge variant={member.consent ? "default" : "destructive"}>{member.consent ? 'Yes' : 'No'}</Badge></div>
                <Button
                    onClick={handleToggleConsent}
                    variant={member.consent ? "destructive" : "default"}
                    disabled={isToggling}
                    >
                    {member.consent ? "Revoke Consent" : "Grant Consent"}
                </Button>
                <div><strong>Roles:</strong> {member?.roles?.map((r) => (
                  <Badge key={r.id} className="mr-1">{r.name}</Badge>
                ))}</div>
                <div className="space-y-2">
                    {allRoles.map((role) => (
                        <div key={role.id} className="flex items-center space-x-2">
                        <Checkbox
                            id={`role-${role.id}`}
                            checked={selectedRoles.includes(role.id)}
                            onCheckedChange={() => toggleRole(role.id)}
                        />
                        <label htmlFor={`role-${role.id}`} className="text-sm">
                            {toSentenceCase(role.name)}
                        </label>
                        </div>
                    ))}
                    <Button onClick={() => updateRoles(selectedRoles)} disabled={isUpdatingRoles}>
                        Save Roles
                    </Button>
                </div>
              </div>
              <div>
                <p><strong>Joined:</strong> {formatDate(member.created_at)}</p>
                <p><strong>Last Login:</strong> {member.last_login_at ? formatDate(member.last_login_at) : "Never"}</p>
                <p><strong>Minor:</strong> {member.isMinor ? "Yes" : "No"}</p>
                <p><strong>Phone:</strong> {member.phone || "—"}</p>
              </div>
            </CardContent>
          </Card>
    
          {/* Admin Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Admin Notes</CardTitle>
            </CardHeader>
            <CardContent>
              {member.admin_notes?.length === 0 && (
                <p className="text-muted-foreground text-sm">No notes yet.</p>
              )}
              <ul className="space-y-3">
                {member.admin_notes?.map((note) => (
                  <li key={note.id} className="border-l-4 border-blue-500 pl-3">
                    <p className="text-sm">{note.note}</p>
                    <p className="text-xs text-muted-foreground">By {note.author_id}, {formatDate(note.created_at)}</p>
                  </li>
                ))}
              </ul>
              <div className="mt-4 space-y-2">
                <Textarea
                    placeholder="Write a note about this member..."
                    value={newNote}
                    onChange={(e) => setNote(e.target.value)}
                    disabled={isPending}
                />
                <Button onClick={handleAddNote} disabled={isPending || newNote.trim() === ""}>
                    Add Note
                </Button>
              </div>
            </CardContent>
          </Card>
    
          {/* Audit Trail */}
          <Card>
            <CardHeader>
              <CardTitle>Audit Info</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-1">
              <p><strong>Created:</strong> {formatDate(member.created_at)}</p>
              <p><strong>Updated:</strong> {member.updated_at ? formatDate(member.updated_at) : "—"} by {member.updated_by || "—"}</p>
              <p><strong>Deleted:</strong> {member.deleted_at ? formatDate(member.deleted_at) : "—"} by {member.deleted_by || "—"}</p>
            </CardContent>
          </Card>
        </div>
      );   
}

export default AdminMemberDetail