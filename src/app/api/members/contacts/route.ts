// import { ContactListDO } from "@/lib/types/custom";
import { ContactListDO, SupabaseContactListResponse } from "@/lib/types/custom";
import logger from "@/utils/logger";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {

    if (request.method !== 'GET') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }

    const supabase = await createSupabaseServerClient();
  
    const { data: contactData, error: contactError } = await supabase
        .from('members')
        .select(`
            id,
            profiles!inner(
                given_name,
                surname
            )
        `) as unknown as SupabaseContactListResponse;
        // ;

    if (contactError) {
        logger.error(contactError)
        return NextResponse.json({ message: contactError.message }, { status: 500 });
    }

    if (!contactData) {
        return NextResponse.json({ message: 'No contacts found' }, { status: 404 });
    }

    const contactList: ContactListDO[] = contactData.map((contact) => ({
        id: contact.id,
        given_name: contact.profiles.given_name!,
        surname: contact.profiles.surname!,
    }));

    contactList.sort((a, b) => a.surname.localeCompare(b.surname));
  // logger.log('Contact list:', contactList);

    return NextResponse.json(contactList, { status: 200 });
  }