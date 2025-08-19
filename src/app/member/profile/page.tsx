import { redirect } from "next/navigation";
import ProfileForm from './_components/ProfileForm';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getUser } from "@/server/authActions";
import { getQueryClient } from "@/server/getQueryClient";

const ProfilePage = async () => {
    const queryClient = getQueryClient()
    const user = await getUser();
    if (!user) {
        redirect('/unauthorized');
    }

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <section className="space-y-6 p-4 max-w-3xl">
                <ProfileForm user={user} />
            </section>
        </HydrationBoundary>
    );
};

export default ProfilePage;
