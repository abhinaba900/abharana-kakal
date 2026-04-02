import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { withAuth } from '@/lib/with-auth';

/**
 * GET /api/yoga/sessions
 * Public: List available yoga sessions (optionally filtered by offering_id).
 */
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const offeringId = url.searchParams.get('offering_id');

    let query = supabaseAdmin
      .from('yoga_sessions')
      .select('*, yoga_offerings(*)')
      .eq('is_active', true)
      .gte('session_date', new Date().toISOString().split('T')[0])
      .order('session_date', { ascending: true })
      .order('start_time', { ascending: true });

    if (offeringId) {
      query = query.eq('offering_id', offeringId);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('Yoga sessions fetch error:', err);
    return NextResponse.json({ error: 'Failed to fetch sessions', details: err.message }, { status: 500 });
  }
}

/**
 * POST /api/yoga/sessions
 * Protected: Admin only to create a new session slot.
 */
async function postHandler(req: NextRequest) {
  try {
    const body = await req.json();
    const { offering_id, session_date, start_time, capacity, meeting_link } = body;

    const { data, error } = await supabaseAdmin
      .from('yoga_sessions')
      .insert({ offering_id, session_date, start_time, capacity, meeting_link })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('Yoga session creation error:', err);
    return NextResponse.json({ error: 'Failed to create session', details: err.message }, { status: 500 });
  }
}

export const POST = withAuth(postHandler);
