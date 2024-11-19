import { getUser } from '@/server/authActions';
import { redirect } from "next/navigation";
import ProfileForm from './ProfileForm'

const ProfilePage = async () => {
    const user = await getUser();
    if (!user) {
        redirect('/unauthorized');
    }
    
    return (
        <section className="flex flex-col items-center justify-between pt-4">
            <ProfileForm user={user} />
        </section>
    )
}

export default ProfilePage;