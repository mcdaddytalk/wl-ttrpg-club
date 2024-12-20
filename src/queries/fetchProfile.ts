import { TypedSupabaseClient } from "@/lib/types/custom";
import { queryOptions } from "@tanstack/react-query";

export const fetchProfile = async (supabase: TypedSupabaseClient, userId: string) => {
    return await supabase.from('profiles').select('*').eq('id', userId).single();
    // return profile;
}

export const fetchUserProfile = (userId: string) => {
    return queryOptions({
        queryKey: ['profile', userId],
        queryFn: async () => {
            const response =  await fetch(`/api/members/${userId}/profile`);
            if (!response.ok) {
                throw new Error('Failed to fetch profile');
            }
            const { data: profileData } = await response.json();
          // console.log('Profile Response: ', profileData);
            return profileData;
        },
        // enabled: !!userId,
        initialData: {}
    });
}