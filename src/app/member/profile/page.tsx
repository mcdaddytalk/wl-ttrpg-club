import { redirect } from "next/navigation";
import ProfileForm from './ProfileForm';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { prefetchQuery } from '@supabase-cache-helpers/postgrest-react-query';
import { createSupabaseServerClient } from '@/utils/supabase/server';
import { getUser } from "@/server/authActions";

const ProfilePage = async () => {
    const queryClient = new QueryClient();
    const supabase = await createSupabaseServerClient();
    const user = await getUser();
    if (!user) {
        redirect('/unauthorized');
    }
    
    await prefetchQuery(queryClient, supabase.from('profiles').select('*').eq('id', user.id));
    
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <section className="flex flex-col items-center justify-between pt-4">
                <ProfileForm user={user} />
            </section>
        </HydrationBoundary>
    )
}

export default ProfilePage;