// app/api/contacts/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/client';

export async function POST(request: Request) {
  const { email, ...contactData } = await request.json();

  const supabase = createClient();
  // Check if email is already in use in contacts table
  const { data: existingContact, error: contactError } = await supabase
    .from('contacts')
    .select('email')
    .eq('email', email)
    .single();

  if (contactError) {
    return NextResponse.json({ error: 'Error checking email' }, { status: 500 });
  }

  if (existingContact) {
    return NextResponse.json({ error: 'Email is already in use' }, { status: 409 });
  }

  // Insert new contact
  const { error: insertError } = await supabase.from('contacts').insert(contactData);

  if (insertError) {
    return NextResponse.json({ error: 'Error adding contact' }, { status: 500 });
  }

  return NextResponse.json({ message: 'Contact added successfully' }, { status: 200 });
}
