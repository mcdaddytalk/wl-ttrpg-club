'use client'

import { useCallback, useEffect, useState } from 'react'
import { createSupabaseBrowserClient } from '@/utils/supabase/client'
import { type User } from '@supabase/supabase-js'
import Avatar from './Avatar'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner'

// ...

export default function AccountForm({ user }: { user: User | null }) {
  const supabase = createSupabaseBrowserClient()
  const [loading, setLoading] = useState(true)
  const [givenName, setGivenName] = useState<string | null>(null)
  const [surname, setSurname] = useState<string | null>(null)
  const [birthday, setBirthday] = useState<string | null>(null)
  const [phone, setPhone] = useState<string | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [bio, setBio] = useState<string | null>(null)
  const [hasChanges, setHasChanges] = useState(false)
  const [initialData, setInitialData] = useState({
    givenName: '',
    surname: '',
    phone: '',
    birthday: '',
    bio: '',
    avatarUrl: '',
  });


  const getProfile = useCallback(async () => {
    try {
        setLoading(true)
        if (!user) return
        const { data, error, status } = await supabase
            .from('profiles')
            .select(`given_name, surname, phone, birthday, avatar, bio`)
            .eq('id', user?.id)
            .single()

      if (error && status !== 406) {
        console.log(error)
        throw error
      }

      if (data) {
        setGivenName(data.given_name)
        setSurname(data.surname)
        setPhone(data.phone)
        setBirthday(data.birthday)
        setAvatarUrl(data.avatar)
        setBio(data.bio)
        setInitialData({
          givenName: data.given_name,
          surname: data.surname,
          phone: data.phone,
          birthday: data.birthday,
          bio: data.bio,
          avatarUrl: data.avatar,
        });
      }
    } catch (error) {
      toast.error('Error loading user data! ' + error)
    } finally {
      setLoading(false)
    }
  }, [user, supabase])

  useEffect(() => {
    getProfile()
  }, [user, getProfile])

  const handleFieldChange = (
    setter: React.Dispatch<React.SetStateAction<string | null>>,
    value: string | null,
    fieldName: keyof typeof initialData
  ) => {
    setter(value);
    setHasChanges(
      value !== initialData[fieldName] ||
      givenName !== initialData.givenName ||
      surname !== initialData.surname ||
      phone !== initialData.phone ||
      birthday !== initialData.birthday ||
      bio !== initialData.bio ||
      avatarUrl !== initialData.avatarUrl
    );
  };

  type ProfileUpdate = {
    givenName: string | null
    surname: string | null
    phone: string | null
    birthday: string | null
    bio: string | null
    avatarUrl?: string | null    
  }
  async function updateProfile({
    givenName,
    surname,
    phone,
    birthday,
    bio,
    avatarUrl,
  }: ProfileUpdate) {
    try {
      setLoading(true)

      const { error } = await supabase.from('profiles').upsert({
        id: user?.id as string,
        given_name: givenName,
        surname,
        phone,
        birthday,
        bio,
        avatar: avatarUrl,
        updated_at: new Date().toISOString(),
      })
      if (error) throw error
      toast.success('Profile updated successfully!')
      setHasChanges(false)
    } catch (error) {
      console.error(error)
      toast.error(`Error updating the data!`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">Profile Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">Email</label>
            <Input id="email" type="text" value={user?.email || ''} disabled />
          </div>
          <div>
            <label htmlFor="givenName" className="block text-sm font-medium">Given Name <span className="text-red-500">*</span></label>
            <Input
              id="givenName"
              type="text"
              value={givenName || ''}
              onChange={(e) => handleFieldChange(setGivenName, e.target.value, 'givenName')}
            />
          </div>
          <div>
            <label htmlFor="surname" className="block text-sm font-medium">Surname <span className="text-red-500">*</span></label>
            <Input
              id="surname"
              type="text"
              value={surname || ''}
              onChange={(e) => handleFieldChange(setSurname, e.target.value, 'surname')}
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium">Phone</label>
            <Input
              id="phone"
              type="text"
              value={phone || ''}
              onChange={(e) => handleFieldChange(setPhone, e.target.value, 'phone')}
            />
          </div>
          <div>
            <label htmlFor="birthday" className="block text-sm font-medium">Birthday <span className="text-red-500">*</span></label>
            <Input
              id="birthday"
              type="date"
              value={birthday || ''}
              onChange={(e) => handleFieldChange(setBirthday, e.target.value, 'birthday')}
            />
          </div>
          <div>
            <label htmlFor="bio" className="block text-sm font-medium">Bio</label>
            <Input
              id="bio"
              type="text"
              value={bio || ''}
              onChange={(e) => handleFieldChange(setBio, e.target.value, 'bio')}
            />
          </div>
          <div>
          <p className="mt-2 text-sm text-gray-500">
            <span className="text-red-500">*</span> Required fields
          </p>
          </div>
          <Avatar
            uid={user?.id ?? null}
            url={avatarUrl}
            size={150}
            onUpload={(url) => {
              setAvatarUrl(url);
              setHasChanges(true);
              // updateProfile({ givenName, surname, phone, birthday, bio, avatarUrl: url });
            }}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button
          onClick={() => updateProfile({ givenName, surname, phone, birthday, bio, avatarUrl })}
          disabled={!hasChanges || loading}
        >
          {loading ? 'Loading...' : 'Update Profile'}
        </Button>
      </CardFooter>
    </Card>
  )
}