import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { withAuth } from '@/lib/with-auth';
import { uploadToBunny } from '@/lib/bunny';

/**
 * GET /api/sound-healing/upcoming
 * Public: List all upcoming sound healing sessions.
 */
export async function GET(req: Request) {
  try {
    const { data: sessions, error } = await supabaseAdmin
      .from('upcoming_sessions')
      .select('*')
      .order('date', { ascending: true }); // Order by event date

    if (error) {
      console.error('[Upcoming List Error]:', error);
      throw error;
    }

    return NextResponse.json({ success: true, data: sessions });
  } catch (err: any) {
    console.error('Upcoming sessions list error:', err);
    return NextResponse.json({ error: 'Failed to fetch upcoming sessions', details: err.message }, { status: 500 });
  }
}

/**
 * POST /api/sound-healing/upcoming
 * Protected: Admin only to create a new upcoming session.
 */
async function postHandler(req: NextRequest, { admin }: any) {
  try {
    const contentType = req.headers.get('content-type') || '';
    
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const title = formData.get('title') as string;
      const description = formData.get('description') as string;
      const date = formData.get('date') as string;
      const time = formData.get('time') as string;
      const location = formData.get('location') as string;
      const availability = formData.get('availability') as string;
      const price = formData.get('price') as string;
      const imageFile = formData.get('image') as File;

      let imageUrl = formData.get('image_url') as string;

      if (imageFile && typeof imageFile !== 'string') {
        const buffer = Buffer.from(await imageFile.arrayBuffer());
        imageUrl = await uploadToBunny(buffer, `${Date.now()}-upcoming-${imageFile.name}`, 'images');
      }

      const { data: session, error } = await supabaseAdmin
        .from('upcoming_sessions')
        .insert({
          title,
          description,
          date,
          time,
          location,
          availability: parseInt(availability) || 0,
          price: parseFloat(price) || 0,
          image_url: imageUrl,
        })
        .select()
        .single();

      if (error) {
        console.error('[Upcoming Create Error]:', error);
        throw error;
      }

      return NextResponse.json({ success: true, data: session });
    } else {
      const body = await req.json();
      const { data: session, error } = await supabaseAdmin
        .from('upcoming_sessions')
        .insert(body)
        .select()
        .single();

      if (error) {
        console.error('[Upcoming Create JSON Error]:', error);
        throw error;
      }
      return NextResponse.json({ success: true, data: session });
    }
  } catch (err: any) {
    console.error('Upcoming session creation error:', err);
    return NextResponse.json({ error: 'Failed to create upcoming session', details: err.message }, { status: 500 });
  }
}

export const POST = withAuth(postHandler);
