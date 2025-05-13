import { redirect } from "next/navigation";
import ProfileForm from './_components/ProfileForm';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getUser } from "@/server/authActions";
import { Card } from "@/components/ui/card";
import { getQueryClient } from "@/server/getQueryClient";

const ProfilePage = async () => {
    const queryClient = getQueryClient()
    const user = await getUser();
    if (!user) {
        redirect('/unauthorized');
    }

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <section className="p-6">
                <Card className="p-6 max-w-5xl mx-auto">
                    <ProfileForm user={user} />
                </Card>
            </section>
        </HydrationBoundary>
    );
};

export default ProfilePage;
