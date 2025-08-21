// app/api/contacts/exists/route.ts
import { createSupabaseServerClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const email = (searchParams.get('email') || '').trim().toLowerCase()

  if (!email) {
    return NextResponse.json({ exists: false }, { status: 200 })
  }

  const supabase = await createSupabaseServerClient();
  // Check if email is already in use in contacts table
  const { data, count, error } = await supabase
    .from('contacts')
    .select('id', { count: 'exact', head: true })
    .eq('email', email)

  if (error) {
    return NextResponse.json({ exists: false }, { status: 200 })
  }

  // Using count via head: true above would be ideal; if you fetch rows instead, check length
  const exists = (data?.length ?? 0) > 0 || (data === null && (count ?? 0) > 0)

  // const exists = false // ← stub for now; wire to Supabase as above
  return NextResponse.json({ exists }, { status: 200 })
}
