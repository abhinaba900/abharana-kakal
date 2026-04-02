import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { withAuth } from '@/lib/with-auth';

/**
 * GET /api/yoga/bookings
 * Protected: Admin only to list all user bookings.
 */
async function getHandler() {
  try {
    const { data, error } = await supabaseAdmin
      .from('yoga_bookings')
      .select('*, yoga_sessions(*, yoga_offerings(*))')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('Yoga bookings fetch error:', err);
    return NextResponse.json({ error: 'Failed to fetch bookings', details: err.message }, { status: 500 });
  }
}

/**
 * POST /api/yoga/bookings
 * Public: User submission for booking a session.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { session_id, user_name, user_email, booking_type, package_size, total_amount, payment_id } = body;

    // 1. Create the booking record
    const { data: booking, error: bookingErr } = await supabaseAdmin
      .from('yoga_bookings')
      .insert({ session_id, user_name, user_email, booking_type, package_size, total_amount, payment_id, status: 'confirmed', payment_status: 'paid' })
      .select()
      .single();

    if (bookingErr) throw bookingErr;

    // 2. Increment the booked_count for the session
    if (session_id) {
       const { error: updateErr } = await supabaseAdmin.rpc('increment_session_booking', { session_id });
       // Note: To use RPC, you'd need the corresponding SQL function.
       // Alternatively, just a standard update:
       const { data: session } = await supabaseAdmin.from('yoga_sessions').select('booked_count').eq('id', session_id).single();
       if (session) {
         await supabaseAdmin.from('yoga_sessions').update({ booked_count: (session.booked_count || 0) + 1 }).eq('id', session_id);
       }
    }

    return NextResponse.json({ success: true, data: booking });
  } catch (err: any) {
    console.error('Yoga booking creation error:', err);
    return NextResponse.json({ error: 'Failed to process booking', details: err.message }, { status: 500 });
  }
}

export const GET = withAuth(getHandler);
