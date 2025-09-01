import logger from "@/utils/logger";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { SERVER_ENVS as ENVS } from "@/utils/constants/envs"

type GameParams = {
    game_id: string
}

export async function PUT(request: NextRequest, { params }: { params: Promise<GameParams> }): Promise<NextResponse> {

    if (request.method !== 'PUT') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }

    const { game_id } = await params;

    const body = await request.json();
    logger.log(body)
    const { game_title, updated_by: old_gamemaster_id, updated_by_name, gamemaster_id: new_gamemaster_id } = body;

    if (!game_id || !game_title || !old_gamemaster_id || !new_gamemaster_id) {
        return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }
    
    const supabase = await createSupabaseServerClient();

    const variables = {
        game_id,
        new_gamemaster_id,
        old_gamemaster_id
    }

    const { error: gameError } = await supabase.rpc('transfer_game_ownership', variables);

    if (gameError) {
        logger.error('Error updating game:', gameError);
        return NextResponse.json({ message: gameError.message }, { status: 500 });
    }

    logger.debug(`Game ${game_title} with id ${game_id} transfered to ${new_gamemaster_id} from ${old_gamemaster_id}`);

    let message = `Game '${game_title}' was transfered to you by ${updated_by_name}\n\n`;
    message += `Game Link: ${ENVS.NEXT_PUBLIC_SITE_URL}/games/${game_id}\n\n`;
    message += `If this was done in error, please send a message to the originating gamemaster or contact an admin`;

    const { error: messageError } = await supabase
        .from('messages')
        .insert({
            sender_id: old_gamemaster_id,
            recipient_id: new_gamemaster_id,
            subject: `Game Ownership Transferred: ${game_title}`,
            content: message,
        })

    if (messageError) {
        logger.error('Error sending game transfer message:', messageError);
        return NextResponse.json({ message: messageError.message }, { status: 500 });
    }

    return NextResponse.json({ message: `Game updated` }, { status: 200 })
}
