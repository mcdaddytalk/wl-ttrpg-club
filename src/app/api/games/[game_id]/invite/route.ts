import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/utils/supabase/server";

import logger from "@/utils/logger";
import { sendEmail, sendSMS } from "@/utils/messaging";
import { getURL } from "@/utils/helpers";
import { v4 as uuidv4 } from "uuid"; // For generating unique invite IDs
import { InvitedPlayer } from "@/lib/types/data-objects";
import { normalizeEmail, normalizePhoneE164 } from "@/utils/normalize";

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

  if (!Array.isArray(invitees) || invitees.length === 0) {
    return NextResponse.json({ error: "No invitees provided." }, { status: 400 });
  }

  // compute expires_at + normalize contacts
  const today = new Date();
  const allInviteesWithExpiry = invitees.map((inv) => {
    const expiresIn = inv.expires_in_days ?? 7;
    const expiresAt = new Date(today);
    expiresAt.setDate(today.getDate() + expiresIn);
    return {
      ...inv,
      email: normalizeEmail(inv.email),
      phone: normalizePhoneE164(inv.phone),
      expires_at: expiresAt.toISOString(),
    };
  });

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

  const { data: requester, error: requesterError } = await supabase
    .from("members")
    .select("is_admin")
    .eq("id", gamemasterId)
    .single();

  if (requesterError || (!requester?.is_admin && gameData.gamemaster_id !== gamemasterId)) {
    return NextResponse.json({ message: 'Not authorized to invite for this game' }, { status: 403 });
  }
  
  logger.debug('GM Games', gamemasterId, game_id, gameData);

  // --- Lookup existing members by any email/phone (single query) ---
  const emails = allInviteesWithExpiry.map(i => i.email).filter(Boolean) as string[];
  const phones = allInviteesWithExpiry.map(i => i.phone).filter(Boolean) as string[];

  const orFilters: string[] = [];
  if (emails.length) orFilters.push(`email.in.(${emails.map(e => `"${e}"`).join(",")})`);
  if (phones.length) orFilters.push(`phone.in.(${phones.map(p => `"${p}"`).join(",")})`);


  let existingMembers: Array<{
    id: string;
    email: string | null;
    phone: string | null;
    consent: boolean;
    profiles: { given_name: string | null; surname: string | null } | null;
  }> = [];

  if (orFilters.length) {
    const { data: membersData, error: membersError } = await supabase
      .from("members")
      .select(`
        id,
        email,
        phone,
        consent,
        profiles ( given_name, surname )
      `)
      .or(orFilters.join(","));
    if (membersError) {
      logger.error(membersError);
      return NextResponse.json({ message: "Error looking up members" }, { status: 500 });
    }
    existingMembers = membersData ?? [];
  }

  // --- Batch registration check for all existing members (single query) ---
  const existingMemberIds = existingMembers.map(m => m.id);
  let alreadyRegistered = new Set<string>();
  if (existingMemberIds.length) {
    const { data: regsData, error: regsError } = await supabase
      .from("game_registrations")
      .select("member_id")
      .eq("game_id", game_id)
      .in("member_id", existingMemberIds);

    if (regsError) {
      logger.error(regsError);
      return NextResponse.json({ message: "Error checking registrations" }, { status: 500 });
    }
    alreadyRegistered = new Set((regsData ?? []).map(r => r.member_id));
  }

  const inviteRecords: InternalInvite[] = [];
  const externalInvites: ExternalInvite[] = [];

  for (const invitee of allInviteesWithExpiry) {
    const invite_id = uuidv4();
    const existingMember = existingMembers.find(
      (m) => (invitee.email && m.email === invitee.email) || (invitee.phone && m.phone === invitee.phone)
    );

    if (existingMember) {
    // skip if already registered
    if (alreadyRegistered.has(existingMember.id)) {
      continue;
    }

    if (!existingMember.consent) {
      await supabase.from("messages").insert([{
        recipient_id: existingMember.id,
        sender_id: gamemasterId,
        content: `You have been invited to join a private game. Visit your dashboard to accept.`,
        category: "invite",
      }]);
    } else {
      inviteRecords.push({
        id: invite_id,
        game_id,
        gamemaster_id: gamemasterId,
        invitee: existingMember.id,
        display_name: invitee.displayName,
        expires_at: invitee.expires_at,
        notified: true,
      });

      const given_name = existingMember.profiles?.given_name ?? "Friend";
      if (existingMember.email) await sendEmailInvite(given_name, existingMember.email, game_id, false, invitee.expires_in_days);
      if (existingMember.phone) await sendSMSInvite(existingMember.phone, game_id, invitee.expires_in_days);
    }
  } else {
    // external: must sign up to claim
    externalInvites.push({
      id: invite_id,
      game_id,
      gamemaster_id: gamemasterId,
      external_email: invitee.email,
      external_phone: invitee.phone,
      display_name: invitee.displayName,
      expires_at: invitee.expires_at,
      notified: true,
    });

    if (invitee.email) await sendEmailInvite(invitee.given_name, invitee.email, invite_id, true, invitee.expires_in_days);
    if (invitee.phone) await sendSMSInvite(invitee.phone, invite_id, invitee.expires_in_days);
  }
}

  if (inviteRecords.length) {
    const { error } = await supabase.from("game_invites").insert(inviteRecords);
    if (error) throw new Error(error.message);
  }
  if (externalInvites.length) {
    const { error } = await supabase.from("game_invites").insert(externalInvites);
    if (error) throw new Error(error.message);
  }

  return NextResponse.json({ message: "Players invited successfully", inviteRecords, externalInvites }, { status: 200 });
}

async function sendEmailInvite(given_name: string, email: string, invite_id: string, requireSignup = false, expires_in_days = 7) {
  // Send email invite
  const inviteUrl = requireSignup
  ? getURL(`/signup?invite=${invite_id}&email=${encodeURIComponent(email)}`)
  : getURL(`/accept-invite?invite=${invite_id}`);

  const subject = requireSignup
  ? '[WL-TTRPG] You have been invited to a game - Please sign up'
  : '[WL-TTRPG] You have been invited to a game';

  const body = requireSignup
  ? `${given_name},\n\n<p>You have been invited to a private game.\nTo accept, please sign up first: <a href="${inviteUrl}" style="color:blue" >Click here to sign up and accept</a></p><p>This invite will expire in ${expires_in_days} days.</p><p>Happy Gaming!<br/>WL-TTRPG Gamemasters</p>`
  : `${given_name},\n\n<p>You have been invited to a private game.\nTo accept, please click the link below:\n<a href="${inviteUrl}" style="color:blue">Accept Invite</a></p><p>This invite will expire in ${expires_in_days} days.</p><p>Happy Gaming!<br/>WL-TTRPG Gamemasters</p>`;

  await sendEmail({
    to: email,
    subject,
    body      
  })
}

async function sendSMSInvite(phone: string, invite_id: string, expires_in_days = 7) {
  // Send SMS invite
  const inviteUrl = getURL(`/accept-invite?invite=${invite_id}`);
  const body = `You have been invited to a private game. Click here to accept: ${inviteUrl} - This invite will expire in ${expires_in_days} days. Happy Gaming! WL-TTRPG Gamemasters`;

  await sendSMS({
    to: phone,
    body
  })
}