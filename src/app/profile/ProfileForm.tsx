'use client'
import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { type User } from '@supabase/supabase-js'
import Avatar from './Avatar'

// ...

export default function AccountForm({ user }: { user: User | null }) {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [givenName, setGivenName] = useState<string | null>(null)
  const [surname, setSurname] = useState<string | null>(null)
  const [birthday, setBirthday] = useState<string | null>(null)
  const [phone, setPhone] = useState<string | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [bio, setBio] = useState<string | null>(null)

  const getProfile = useCallback(async () => {
    try {
        setLoading(true)
        console.log('USER:  ', user)
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
      }
    } catch (error) {
      alert('Error loading user data! ' + error)
    } finally {
      setLoading(false)
    }
  }, [user, supabase])

  useEffect(() => {
    getProfile()
  }, [user, getProfile])

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
      alert('Profile updated!')
    } catch (error) {
        console.error(error)
      alert(`Error updating the data!`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-widget">

      {/* ... */}

      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="text" value={user?.email} disabled />
      </div>
      <div>
        <label htmlFor="fullName">Full Name</label>
        <input
          id="givenName"
          type="text"
          value={givenName || ''}
          onChange={(e) => setGivenName(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="surname">surname</label>
        <input
          id="surname"
          type="text"
          value={surname || ''}
          onChange={(e) => setSurname(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="phone">Phone</label>
        <input
          id="phone"
          type="text"
          value={phone || ''}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="birthday">Birthday</label>
        <input
          id="birthday"
          type="text"
          value={birthday || ''}
          onChange={(e) => setBirthday(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="bio">Bio</label>
        <input
          id="bio"
          type="text"
          value={bio || ''}
          onChange={(e) => setBio(e.target.value)}
        />
      </div>
      <Avatar
        uid={user?.id ?? null}
        url={avatarUrl}
        size={150}
        onUpload={(url) => {
          setAvatarUrl(url)
          updateProfile({ givenName, surname, phone, birthday, bio, avatarUrl: url })
        }}
      />

      <div>
        <button
          className="button primary block"
          onClick={() => updateProfile({ givenName, surname, phone, birthday, bio, avatarUrl })}
          disabled={loading}
        >
          {loading ? 'Loading ...' : 'Update'}
        </button>
      </div>

    </div>
  )
}