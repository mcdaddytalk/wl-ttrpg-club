'use client'

import { useState } from 'react'
import useSupabaseBrowserClient from '@/utils/supabase/client'
import { type User } from '@supabase/supabase-js'
import { useMutation,  useQuery } from '@tanstack/react-query'
// import { useQuery, useUpdateMutation, useUpsertMutation } from '@supabase-cache-helpers/postgrest-react-query'
import Avatar from './Avatar'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button';
import { toast } from 'sonner'
import { ProfileData, ExperienceLevel } from '@/lib/types/custom'
import { redirect } from 'next/navigation'
import { Label } from '@/components/ui/label'
import { useQueryClient } from '@/hooks/useQueryClient'
// import { fetchUserProfile } from '@/queries/fetchProfile'
// import { fetchProfile } from '@/queries/fetchProfile'

type ProfileFormProps = {
  user: User
}

export default function ProfileForm({ user }: ProfileFormProps): React.ReactElement {
  const supabase = useSupabaseBrowserClient()
  const queryClient = useQueryClient()

  const { data: profile, isLoading: profileLoading, isError, error } = useQuery({
    queryKey: ["members", "profile", user.id],
    queryFn: async () => {
      const userId = user.id;
      const response =  await fetch(`/api/members/${userId}/profile`);
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      const data = await response.json();
    // console.log('Profile Response: ', data);
      return data;
    },
    enabled: !!user.id,
  });
  
  // const profile = profileData.data as ProfileData;
  if (error) console.error(error)
  
  // Mutation to update profile
  const updateProfile = useMutation({
    mutationFn: async (updatedProfile: ProfileData) => {
      const { data, error } = await supabase
        .from("profiles")
        .upsert({
          ...updatedProfile,
          id: user?.id,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user?.id);
      if (error) throw error;
      return data;
    },
    onSuccess: (data, updatedProfile, context) => {
      console.debug('Updated profile:', data);
      console.debug('Updated profile:', updatedProfile);
      console.debug('Context: ', context);
      queryClient.setQueryData(["members", "profile", user?.id], updatedProfile);
      toast.success("Profile updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update profile.");
    },
  })
  
  // Local state for detecting changes
  const [localProfile, setLocalProfile] = useState<ProfileData | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  
  const handleFieldChange = <T extends keyof ProfileData>(
    field: T,
    value: ProfileData[T]
  ) => {
    if (!profile) return;

    const updatedProfile = { ...profile, [field]: value };
    setLocalProfile(updatedProfile);
    
    setHasChanges(
      Object.keys(updatedProfile).some((key) => updatedProfile[key as keyof ProfileData] !== profile[key as keyof ProfileData])
    )

    // queryClient.setQueryData(["profile", user?.id], updatedProfile); // Optimistic local update
  };

  const handleBlur = () => {
    if (!localProfile || !profile) return;
    
    // Only trigger the mutation if there's a difference
    if (hasChanges) {
      updateProfile.mutate(localProfile);
      setHasChanges(false); // Reset changes after a successful update
    }

  };

  if (profileLoading) return <div>Loading...</div>;
  if (isError) redirect('/error');

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">Profile Details</CardTitle>
      </CardHeader>
      <CardContent>
      <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Label htmlFor="email" className="block text-sm font-medium text-slate-700">Email</Label>
            <Input 
              id="email" 
              type="email" 
              value={user.email || ''} 
              disabled
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-6">
            <div>
              <Label htmlFor="given_name" className="block text-sm font-medium text-slate-700">Given Name <span className="text-red-500">*</span></Label>
              <Input
                id="given_name"
                type="text"
                value={localProfile?.given_name || profile?.given_name || ''}
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder='Given Name'
                onChange={(e) => handleFieldChange('given_name', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="surname" className="block text-sm font-medium text-slate-700">Surname <span className="text-red-500">*</span></Label>
              <Input
                id="surname"
                type="text"
                value={localProfile?.surname || profile?.surname || ''}
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder='Surname'
                onChange={(e) => handleFieldChange('surname', e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-6">
            <div>
              <Label htmlFor="phone" className="block text-sm font-medium text-slate-700">Phone</Label>
              <Input
                id="phone"
                type="text"
                value={ localProfile?.phone || profile?.phone || ''}
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder='000-867-5309'
                onChange={(e) => handleFieldChange('phone', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="birthday" className="block text-sm font-medium text-slate-700">Birthday <span className="text-red-500">*</span></Label>
              <Input
                id="birthday"
                type="date"
                value={ localProfile?.birthday || profile?.birthday || ''}
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                onChange={(e) => handleFieldChange('birthday', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="experienceLevel" className="block text-sm font-medium text-slate-700">Experience Level</Label>
              <select
                id="experienceLevel"
                defaultValue={localProfile?.experience_level || profile?.experience_level || 'new'}
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm "
                onChange={(field) => handleFieldChange('experience_level', field.target.value as ExperienceLevel)}
              >
                <option value="">Select Experience Level</option>
                <option value="new">New</option>
                <option value="novice">Novice</option>
                <option value="seasoned">Seasoned</option>
                <option value="player-gm">Player-Gamemaster</option>
                <option value="forever-gm">Forever GM</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <Avatar
              uid={user.id ?? null}
              url={user.user_metadata?.avatar_url ? user.user_metadata.avatar_url : profile?.avatar}
              size={150}
              onUpload={(url) => {
                handleFieldChange('avatar', url);
                // updateProfile({ given_name, surname, phone, birthday, bio, avatarUrl: url });
              }}
            />
            <div className="flex-1">
              <Label htmlFor="bio" className="block text-sm font-medium text-slate-700">Bio</Label>
              <Textarea
                id="bio"
                value={localProfile?.bio || profile?.bio|| ''}
                className="mt-1 min-h-[150px] w-full resize-none rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder='Write something about yourself...'
                onChange={(e) => handleFieldChange('bio', e.target.value)}
                onBlur={handleBlur} // Trigger mutation on blur
              />
            </div>
          </div>
          <div>
            <p className="mt-2 text-sm text-slate-500">
              <span className="text-red-500">*</span> Required fields
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button
          onClick={() => {
            if (!localProfile) return;
            updateProfile.mutate(localProfile)
          }}
          disabled={
            profileLoading || 
            updateProfile.isPending || 
            !hasChanges
          }
        >
          {updateProfile.isPending ? 'Saving...' : 'Update Profile'}
        </Button>
      </CardFooter>
    </Card>
  )
}