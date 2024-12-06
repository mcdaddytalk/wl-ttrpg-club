import { redirect } from "next/navigation";
import ProfileForm from './ProfileForm';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getUser } from "@/server/authActions";
import { useQueryClient } from "@/hooks/useQueryClient";
// import { fetchUserProfile } from "@/queries/fetchProfile";

const ProfilePage = async () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const queryClient = useQueryClient();
    // const supabase = await createSupabaseServerClient();
    const user = await getUser();
    if (!user) {
        redirect('/unauthorized');
    }
    
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <section className="flex flex-col items-center justify-between pt-4">
                <ProfileForm user={user} />
            </section>
        </HydrationBoundary>
    )
}

export default ProfilePage;