// app/api/contacts/route.ts
import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/utils/supabase/server';
import { Database } from '@/lib/types/supabase';

export async function POST(request: Request) {
  const { email, ...contactData } = await request.json();

  const supabase = await createSupabaseServerClient();
  // Check if email is already in use in contacts table
  const { data: existingContact, error: contactError } = await supabase
    .from('contacts')
    .select('email')
    .eq('email', email)
    .maybeSingle();

  if (contactError) {
    // console.error(contactError);
    return NextResponse.json({ error: 'Error checking email' }, { status: 500 });
  }

  if (existingContact) {
    // console.error('Email is already in use', existingContact.email);
    return NextResponse.json({ error: 'Email is already in use' }, { status: 409 });
  }

  // console.log(contactData);
  const convertedContactData: Database["public"]["Tables"]["contacts"]["Insert"] = {
    first_name: contactData.firstName,
    surname: contactData.surname,
    email,
    phone_number: contactData.phoneNumber,
    is_minor: contactData.isMinor,
    parent_first_name: contactData.parentFirstName,
    parent_surname: contactData.parentSurname,
    parent_phone: contactData.parentPhone,  
    parent_email: contactData.parentEmail,
    experience_level: contactData.experienceLevel,
    preferred_system: contactData.preferredSystem,
    gamemaster_interest: contactData.gamemasterInterest,
    availability: contactData.availability,
    agree_to_rules: contactData.agreeToRules
  };
  // Insert new contact
  const { error: insertError } = await supabase.from('contacts').insert(convertedContactData);

  if (insertError) {
    // console.error(insertError);
    return NextResponse.json({ error: 'Error adding contact' }, { status: 500 });
  }

  return NextResponse.json({ message: 'Contact added successfully' }, { status: 200 });
}
