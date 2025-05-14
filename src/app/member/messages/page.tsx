"use client"

import useSession from "@/utils/supabase/use-session";
import { User } from "@supabase/supabase-js";
import React, { Suspense } from "react"
import MemberMessageTable from "./_components/MemberMessageTable/MemberMessageTable";

const MessagesPage = (): React.ReactElement => {
    const session = useSession();
    const user: User = (session?.user as User) ?? null;
    

    return (
        <div className="flex flex-col">
        {/* Appbar */}
        
        {/* Main Content */}
        <main className="p-4 overflow-y-auto">
          {/* Members Table */}
          <Suspense fallback={<div>Loading...</div>}>
            <MemberMessageTable user={user} />
          </Suspense>
        </main>
      </div>
    )
}

export default MessagesPage