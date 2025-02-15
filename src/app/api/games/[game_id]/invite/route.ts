import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/utils/supabase/server";

import logger from "@/utils/logger";
import { sendEmail, sendSMS } from "@/utils/messaging";
import { getURL } from "@/utils/helpers";
import { InvitedPlayer } from "@/lib/types/custom";
import { v4 as uuidv4 } from "uuid"; // For generating unique invite IDs

type InviteParams = {
  game_id: string;
};

interface InviteRecord {
  id: string;
  game_id: string;
  gamemaster_id: string;
  display_name: string;
  expires_at: string;
  notified: boolean;
}

type InternalInvite = InviteRecord & {
  invitee: string;
}

type ExternalInvite = InviteRecord & {
  external_email?: string;
  external_phone?: string;  
}

export async function POST(request: NextRequest, { params }: { params: Promise<InviteParams> } ): Promise<NextResponse> {

  if (request.method !== 'POST') {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
  }

  const { game_id } = await params;
  const body = await request.json();
  if (!game_id) {
    return NextResponse.json({ message: `Game ID is required` }, { status: 403 })
  } 

  const { invitees, gamemasterId }:  { invitees: InvitedPlayer[], gamemasterId: string } = body;

  if (!invitees || invitees.length === 0) {
    return NextResponse.json({ error: "No invitees provided." }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();

  const { data: gameData, error: gameError } = await supabase
    .from('games')
    .select('gamemaster_id')
    .eq('id', game_id)
    .single();

  if (gameError) {
    logger.error(gameError);
    return NextResponse.json({ message: 'Error fetching game' }, { status: 500 });
  }

  if (gameData && gameData.gamemaster_id !== gamemasterId) {
    return NextResponse.json({ message: 'Not the gamemaster of this game' }, { status: 403 });
  }
  
  console.log('GM Games', gamemasterId, game_id, gameData);

  const { data: existingReg } = await supabase
    .from('game_registrations')
    .select('id')
    .eq('game_id', game_id)
    .eq('member_id', body.invitee)
    .single();
  
  if (existingReg)
    return NextResponse.json({ message: 'Player already registered' }, { status: 200 });

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  const { data: existingMembers } = await supabase
    .from('members')
    .select(`
        id,
        email,
        phone,
        consent,
        profiles (
          given_name,
          surname
        )    
    `)
    .or(`email.in(${invitees.map((invitee) => invitee.email)}), phone.in(${invitees.map((invitee) => invitee.phone)}))`);

    // Create invite records
    const inviteRecords: InternalInvite[] = [];
    const externalInvites: ExternalInvite[] = [];

    if (existingMembers) console.log('Existing Members', existingMembers);
    console.log('Invites', invitees);

    for (const invitee of invitees) {
        const invite_id = uuidv4(); // Generate a unique invite ID
        const existingMember = existingMembers?.find(m => m.email === invitee.email || m.phone === invitee.phone);
        if (existingMember) {
            if (!existingMember.consent) {
                await supabase.from("messages").insert([
                    {
                      recipient_id: existingMember.id,
                      sender_id: gamemasterId,
                      content: `You have been invited to join a private game. Visit your dashboard to accept.`,
                      message_type: "invite",
                    },
                  ]);    
            } else {
                inviteRecords.push({
                    id: invite_id,
                    game_id,
                    gamemaster_id: gamemasterId,
                    invitee: existingMember.id,
                    display_name: invitee.displayName,
                    expires_at: expiresAt.toISOString(),
                    notified: true
                })
                // If consent is TRUE, send invite via email/SMS
                // const { data: inviteData } = await supabase.from("game_invites").insert([{ game_id: game_id, member_id: existingMember.id }]);
                // Send email and SMS notifications
                const { email, phone, profiles } = existingMember;
                const given_name = profiles ? `${profiles.given_name}` : 'Unknown';
                if (email) await sendEmailInvite(given_name, email, game_id);
                if (phone) await sendSMSInvite(phone, game_id);
            }
        } else {
            externalInvites.push({
                id: invite_id,
                game_id,
                gamemaster_id: gamemasterId,
                external_email: invitee.email,
                external_phone: invitee.phone,
                display_name: invitee.displayName,
                expires_at: expiresAt.toISOString(),
                notified: true
            })
            if (invitee.email) {
                await sendEmailInvite(invitee.given_name, invitee.email, invite_id);
            }
            if (invitee.phone) {
                await sendSMSInvite(invitee.phone, invite_id);
            }
        }        
    }
   
    if (inviteRecords.length > 0) {
      console.log('Invite Records', inviteRecords);
      const { error } = await supabase.from("game_invites").insert(inviteRecords);
      if (error) throw new Error(error.message)
    }

    if (externalInvites.length > 0) {
      console.log('External Invites', externalInvites);
      const { error } = await supabase.from("game_invites").insert(externalInvites);
      if (error) throw new Error(error.message)
    }
  // const { data: inviteData } = await supabase
  //   .from('game_invites')
  //   .insert([{
  //     game_id: game_id,
  //     external_email: body.external_email,
  //     external_phone: body.external_phone,
  //     expires_at: expiresAt.toISOString(),
  //     notified: true
  //   }])
  //   .select('*')
  //   .single();
    
  return NextResponse.json({ message: 'Players invited successfully', inviteRecords, externalInvites }, { status: 200 });
}

async function sendEmailInvite(given_name: string, email: string, invite_id: string, requireSignup = false) {
  // Send email invite
  const inviteUrl = requireSignup
  ? getURL(`/signup?invite=${invite_id}&email=${encodeURIComponent(email)}`)
  : getURL(`/accept-invite?invite=${invite_id}`);

  const subject = requireSignup
  ? '[WL-TTRPG] You have been invited to a game - Please sign up'
  : '[WL-TTRPG] You have been invited to a game';

  const body = requireSignup
  ? `${given_name},\n\n<p>You have been invited to a private game.\nTo accept, please sign up first: <a href="${inviteUrl}" style="color:blue" >Click here to sign up and accept</a></p><p>This invite will expire in 7 days.</p><p>Happy Gaming!<br/>WL-TTRPG Gamemasters</p>`
  : `${given_name},\n\n<p>You have been invited to a private game.\nTo accept, please click the link below:\n<a href="${inviteUrl}" style="color:blue">Accept Invite</a></p><p>This invite will expire in 7 days.</p><p>Happy Gaming!<br/>WL-TTRPG Gamemasters</p>`;

  await sendEmail({
    to: email,
    subject,
    body      
  })
}

async function sendSMSInvite(phone: string, invite_id: string) {
  // Send SMS invite
  const inviteUrl = getURL(`/accept-invite?invite=${invite_id}`);
  const body = 'You have been invited to a private game. Click here to accept: ' + inviteUrl + '. This invite will expire in 7 days. Happy Gaming! WL-TTRPG Gamemasters';

  await sendSMS({
    to: phone,
    body
  })
}