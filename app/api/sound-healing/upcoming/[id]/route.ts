import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { withAuth } from '@/lib/with-auth';
import { uploadToBunny } from '@/lib/bunny';

/**
 * PATCH /api/sound-healing/upcoming/[id]
 * Protected: Admin only to update session details.
 */
async function patchHandler(req: NextRequest, { params, admin }: any) {
  try {
    const { id } = params;
    const contentType = req.headers.get('content-type') || '';
    
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const updates: any = {};

      for (const [key, value] of formData.entries()) {
        if (typeof value === 'string' && key !== 'image') {
          updates[key] = value;
        }
      }

      const imageFile = formData.get('image') as File;
      if (imageFile && typeof imageFile !== 'string') {
        const buffer = Buffer.from(await imageFile.arrayBuffer());
        updates.image_url = await uploadToBunny(buffer, `${Date.now()}-upcoming-${imageFile.name}`, 'images');
      }

      const { data: session, error } = await supabaseAdmin
        .from('upcoming_sessions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('[Upcoming Update Error]:', error);
        throw error;
      }

      return NextResponse.json({ success: true, data: session });
    } else {
      const body = await req.json();
      const { data: session, error } = await supabaseAdmin
        .from('upcoming_sessions')
        .update(body)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('[Upcoming Update JSON Error]:', error);
        throw error;
      }
      return NextResponse.json({ success: true, data: session });
    }
  } catch (err: any) {
    console.error('Upcoming session update error:', err);
    return NextResponse.json({ error: 'Failed to update upcoming session', details: err.message }, { status: 500 });
  }
}

/**
 * DELETE /api/sound-healing/upcoming/[id]
 * Protected: Admin only to remove a session.
 */
async function deleteHandler(req: NextRequest, { params, admin }: any) {
  try {
    const { id } = params;

    const { error } = await supabaseAdmin
      .from('upcoming_sessions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[Upcoming Delete Error]:', error);
      throw error;
    }

    return NextResponse.json({ success: true, message: 'Upcoming session deleted successfully' });
  } catch (err: any) {
    console.error('Upcoming session deletion error:', err);
    return NextResponse.json({ error: 'Failed to delete upcoming session', details: err.message }, { status: 500 });
  }
}

export const PATCH = withAuth(patchHandler);
export const DELETE = withAuth(deleteHandler);
