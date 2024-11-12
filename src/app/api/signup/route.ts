// app/api/signup/route.ts
import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  const { email, password, firstName, surname, phoneNumber } = await request.json();

  const supabase = await createSupabaseServerClient()
  // Check if email is already in use in auth.users
  const { data: existingUser, error: userError } = await supabase
    .from('auth.users')
    .select('email')
    .eq('email', email)
    .single();

  if (userError && userError.message !== 'No rows found') {
    return NextResponse.json({ error: 'Error checking email' }, { status: 500 });
  }

  if (existingUser) {
    return NextResponse.json({ error: 'Email is already in use' }, { status: 409 });
  }

  // Create user in Supabase auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    return NextResponse.json({ error: 'Error creating user' }, { status: 500 });
  }

  const userId = authData.user?.id;
  if (userId) {
    // Insert into members table
    const { error: memberError } = await supabase.from('members').upsert({
      id: userId,
      email: email,
      provider: 'email',
    });

    if (memberError) {
      return NextResponse.json({ error: 'Error adding member' }, { status: 500 });
    }

    // Insert into profiles table
    const { error: profileError } = await supabase.from('profiles').insert({
      id: userId,
      first_name: firstName,
      surname: surname,
      phone: phoneNumber,
    });

    if (profileError) {
      return NextResponse.json({ error: 'Error creating profile' }, { status: 500 });
    }
  }

  return NextResponse.json({ message: 'Account created successfully' }, { status: 200 });
}
