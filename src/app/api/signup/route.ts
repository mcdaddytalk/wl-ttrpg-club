// app/api/signup/route.ts
import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/utils/supabase/server';

const calculateIsMinor = (birthday: string): boolean => {
  const birthDate = new Date(birthday);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();
  return age < 18 || (age === 18 && (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)));
};

export async function POST(request: Request) {
  const { email, password, firstName, surname, birthday } = await request.json();

  const supabase = await createSupabaseServerClient()
  // Check if email is already in use in auth.
  
  const { data: existingUser, error: userError } = await supabase
    .from('members')
    .select('id')
    .eq('email', email)
    .maybeSingle();

  if (userError) {
    return NextResponse.json({ error: 'Error checking email' }, { status: 500 });
  }

  if (existingUser) {
    return NextResponse.json({ error: 'Email is already in use' }, { status: 409 });
  }

  console.log(`No existing user, creating user for ${email}...`)

  const isMinor = calculateIsMinor(birthday);
  // Create user in Supabase auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        displayName: `${firstName} ${surname}`,
        given_name: firstName,
        surname: surname,
        birthday: birthday,
        is_minor: isMinor
      },
    },
  });

  if (authError) {
    console.error(authError)
    return NextResponse.json({ error: 'Error creating user' }, { status: 500 });
  }

  const userId = authData.user?.id;
  if (userId) {
    // Insert into members table
    const { error: memberError } = await supabase.from('members').upsert({
      id: userId,
      email: email,
      provider: 'email',
      is_minor: isMinor
    });

    if (memberError) {
      console.error(memberError)
      return NextResponse.json({ error: 'Error adding member' }, { status: 500 });
    }

    // Insert into profiles table
    const { error: profileError } = await supabase.from('profiles').upsert({
      id: userId,
      given_name: firstName,
      surname: surname,
      birthday: birthday,
    });

    if (profileError) {
      console.error(profileError)
      return NextResponse.json({ error: 'Error creating profile' }, { status: 500 });
    }
  }

  return NextResponse.json({ message: 'Account created successfully' }, { status: 200 });
}
