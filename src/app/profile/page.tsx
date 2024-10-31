"use client"

import { useAuth } from '@/hooks/useAuth'
import ProfileForm from './ProfileForm'

const ProfilePage = () => {
    const auth = useAuth()
    
    return (
        <>
            <ProfileForm user={auth.user} />
        </>
    )
}

export default ProfilePage;