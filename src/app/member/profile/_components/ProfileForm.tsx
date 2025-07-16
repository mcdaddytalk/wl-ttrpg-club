'use client'

import { useEffect } from 'react'
import { type User } from '@supabase/supabase-js'
import Avatar from './Avatar'
import { ProfileCompletion } from './ProfileCompletion'
import { Controller } from "react-hook-form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { redirect } from 'next/navigation';
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { profileSchema, ProfileFormValues } from "@/lib/validation/profileSchema"
import logger from '@/utils/logger';
import { useMyProfile, useUpdateMyProfile } from '@/hooks/member/useMyProfile'
import { getExperienceLabel, EXPERIENCE_LEVEL_SELECTOR } from '@/lib/constants'

type ProfileFormProps = {
  user: User
}

export default function ProfileForm({ user }: ProfileFormProps): React.ReactElement {
  const { data: profile, isLoading: isProfileLoading, isError, error } = useMyProfile(user.id)
  const { mutate: updateProfile } = useUpdateMyProfile(user.id)
      
  const {
    control,
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      given_name: "",
      surname: "",
      phone: "",
      birthday: "",
      experience_level: 'new',
      bio: "",
      avatar: ""
    },
  })

  useEffect(() => {
    if (profile) {
      reset({
        given_name: profile.given_name ?? "",
        surname: profile.surname ?? "",
        phone: profile.phone ?? "",
        birthday: profile.birthday ?? "",
        experience_level: profile.experience_level || '',
        bio: profile.bio ?? "",
        avatar: profile.avatar ?? "",
      })
    }
  }, [profile, reset])

  if (isProfileLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (isError) {
    logger.error(error);
    redirect('/error');
  }

  logger.debug('Profile:', profile)
  logger.debug('EXPERIENCE_LEVEL:', profile?.experience_level)

  return (
    <form onSubmit={handleSubmit((values) => updateProfile(values))} className="space-y-8">
      {profile && <ProfileCompletion profile={profile} />}

      <div>
        <Label htmlFor="email" className="mb-2 block">
          Email
        </Label>
        <Input id="email" value={user.email || ""} disabled />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="given_name">Given Name<span className="text-red-500">*</span></Label>
          <Input id="given_name" {...register("given_name")} />
          {errors.given_name && <p className="text-sm text-red-500">{errors.given_name.message}</p>}
        </div>
        <div>
          <Label htmlFor="surname">Surname<span className="text-red-500">*</span></Label>
          <Input id="surname" {...register("surname")} />
          {errors.surname && <p className="text-sm text-red-500">{errors.surname.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" {...register("phone")} />
        </div>
        <div>
          <Label htmlFor="birthday">Birthday</Label>
          <Input id="birthday" type="date" {...register("birthday")} />
        </div>
        <div>
          <Label htmlFor="experience_level">Experience Level</Label>
          <Controller
            control={control}
            name="experience_level"
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Experience Level">
                    {getExperienceLabel(field.value)}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {EXPERIENCE_LEVEL_SELECTOR.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-6">
      {isProfileLoading ? (
          <Card className="p-4 flex flex-col items-center justify-center">
            <CardHeader className="p-0 mb-2">
              <CardTitle className="text-lg">Avatar</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Skeleton className="h-[150px] w-[150px] rounded-full" />
            </CardContent>
          </Card>
        ) : (
          <Card className="p-4 flex flex-col items-center justify-center">
            <CardHeader className="p-0 mb-2">
              <CardTitle className="text-lg">Avatar</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Avatar
                uid={user.id ?? null}
                url={user.user_metadata?.avatar_url ? user.user_metadata.avatar_url : profile?.avatar}
                size={150}
                onUpload={(url) => setValue("avatar", url, { shouldDirty: true })}
              />
            </CardContent>
          </Card>
        )}

        <div className="flex-1">
          <Label htmlFor="bio">Bio</Label>
          <Textarea id="bio" className="resize-none min-h-[150px]" {...register("bio")} />
        </div>
      </div>

      <CardFooter className="flex justify-center">
        <Button type="submit" disabled={!isDirty || isSubmitting}>
          {isSubmitting ? "Saving..." : "Update Profile"}
        </Button>
      </CardFooter>

      <p className="text-center text-sm text-slate-500">
        <span className="text-red-500">*</span> Required fields
      </p>
    </form>
  )
}