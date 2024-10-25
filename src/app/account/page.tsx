"use client"
import AccountForm from './account-form'
import { useAuth } from '@/hooks/useAuth'
// import { supabase } from '@/lib/supabaseClient';

export default function Account() {
  const { user } = useAuth()
  return <AccountForm user={user} />
}