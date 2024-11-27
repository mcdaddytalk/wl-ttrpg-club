"use client"

import useSupabaseBrowserClient from "@/utils/supabase/client";
import useSession from "@/utils/supabase/use-session";
import { User } from "@supabase/supabase-js";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { fetchMembersFull, fetchRoles } from "@/queries/fetchMembers";
import { redirect } from "next/navigation";
import { AdminDrawer } from "@/components/AdminDrawer";
import { AdminMembersTable } from "@/components/AdminMembersTable";
import { MemberData, RoleDO } from "@/lib/types/custom";

export default function AdminDashboardClient(): React.ReactElement {
  const supabase = useSupabaseBrowserClient();
  const session = useSession();
  const user: User = (session?.user as User) ?? null;
  
  const { data: members, isLoading, isError, error } = useQuery(fetchMembersFull(supabase), {
    enabled: !!user,
  });

  const { data: allRoles } = useQuery(fetchRoles(supabase),  {
    enabled: !!user,
  });
  
  if (error) console.log('error', error);
  
  if (!user) return <div>Please log in to access the dashboard.</div>;
  if (isLoading) return <p>Loading...</p>;
  if (isError) redirect('/error');
    
  return (
      <div className="flex flex-col">
        {/* Navbar */}
        <header className="flex justify-between items-center p-4 shadow">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <AdminDrawer />
        </header>
  
        {/* Main Content */}
        <main className="p-4 overflow-y-auto">
          <h2 className="text-2xl font-semibold mb-4">Manage Members</h2>
          {/* Members Table */}
          { !members
            ? <p>No members found.</p> 
            : <AdminMembersTable members={members as MemberData[]} allRoles={allRoles ?? []} />
          }
        </main>
      </div>
    );
}