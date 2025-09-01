import { SupabaseContactSubmissionListResponse } from '@/lib/types/custom';
import { createSupabaseServerClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest): Promise<NextResponse> {
    if (req.method !== 'GET') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false }) as unknown as SupabaseContactSubmissionListResponse;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}
