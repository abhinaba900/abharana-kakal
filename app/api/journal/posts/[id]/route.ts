import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { withAuth } from '@/lib/with-auth';
import { uploadToBunny } from '@/lib/bunny';

/**
 * PATCH /api/journal/posts/[id]
 * Protected: Admin only to update blog post details or images.
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
          if (key === 'category_id' && value === '') updates[key] = null;
        }
      }

      const imageFile = formData.get('image') as File;
      if (imageFile && typeof imageFile !== 'string') {
        const buffer = Buffer.from(await imageFile.arrayBuffer());
        updates.image_url = await uploadToBunny(buffer, `${Date.now()}-${imageFile.name}`, 'blogs');
      }

      const { data: post, error } = await supabaseAdmin
        .from('journal_posts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({ success: true, data: post });
    } else {
      // Standard JSON update
      const body = await req.json();
      const { data: post, error } = await supabaseAdmin
        .from('journal_posts')
        .update(body)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ success: true, data: post });
    }
  } catch (err: any) {
    console.error('Post update error:', err);
    return NextResponse.json({ error: 'Failed to update post', details: err.message }, { status: 500 });
  }
}

/**
 * DELETE /api/journal/posts/[id]
 * Protected: Admin only to remove a blog post.
 */
async function deleteHandler(req: NextRequest, { params, admin }: any) {
  try {
    const { id } = params;

    const { error } = await supabaseAdmin
      .from('journal_posts')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Post deleted successfully' });
  } catch (err: any) {
    console.error('Post deletion error:', err);
    return NextResponse.json({ error: 'Failed to delete post', details: err.message }, { status: 500 });
  }
}

export const PATCH = withAuth(patchHandler);
export const DELETE = withAuth(deleteHandler);
