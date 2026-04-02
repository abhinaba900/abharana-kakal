import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { withAuth } from '@/lib/with-auth';
import { uploadToBunny, purgeImages } from '@/lib/bunny';

/**
 * PATCH /api/retreats/[id]
 * Protected: Admin only to update retreat details or images.
 */
async function patchHandler(req: NextRequest, { params, admin }: any) {
  try {
    const { id } = params;
    const contentType = req.headers.get('content-type') || '';
    
    // 1. Fetch current retreat for image cleanup comparison
    const { data: oldRetreat } = await supabaseAdmin.from('retreats').select('image_urls').eq('id', id).single();
    
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const keys = Array.from(formData.keys());
      console.log(`[DEBUG_PATCH] Incoming FormData keys: ${keys.join(', ')}`);
      
      const updates: any = {};

      // Handle simple text fields
      for (const [key, value] of formData.entries()) {
        if (typeof value === 'string' && key !== 'images' && key !== 'existing_images') {
          updates[key] = value;
          if (key === 'price') updates[key] = parseFloat(value) || 0;
        }
      }

      // Handle the "image_urls" logic
      const existingImages = formData.get('existing_images') as string;
      let imageUrls: string[] = existingImages ? JSON.parse(existingImages) : [];
      
      const newImageFiles = formData.getAll('images') as File[];
      console.log(`[DEBUG_PATCH] Processing ${newImageFiles.length} new images`);
      
      for (const file of newImageFiles) {
        console.log(`[FILE_DEBUG] name=${file.name} size=${file.size} type=${file.type}`);
        if (typeof file !== 'string') {
          const buffer = Buffer.from(await file.arrayBuffer());
          const fileName = file.name || `image-${Date.now()}`;
          console.log(`[DEBUG_PATCH] Buffer length for ${fileName}: ${buffer.length}`);
          const url = await uploadToBunny(buffer, `${Date.now()}-${fileName}`, 'images');
          imageUrls.push(url);
        }
      }
      console.log(`[DEBUG_PATCH] Final imageUrls after uploads: ${JSON.stringify(imageUrls)}`);
      
      updates.image_urls = imageUrls;

      const { data: retreat, error } = await supabaseAdmin
        .from('retreats')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // 2. Performance image cleanup (find removed images)
      if (oldRetreat?.image_urls) {
        const removedImages = oldRetreat.image_urls.filter((url: string) => !imageUrls.includes(url));
        console.log(`[DEBUG_PATCH] Images to purge: ${JSON.stringify(removedImages)}`);
        try {
          await purgeImages(removedImages);
        } catch (e: any) {
          console.error(`[DEBUG_PATCH] Purge failed (non-critical): ${e.message}`);
        }
      }

      return NextResponse.json({ success: true, data: retreat });
    } else {
      // Standard JSON update
      const jsonBody = await req.json();
      const { existing_images, images, ...body } = jsonBody;

      // Handle the "image_urls" logic if provided in JSON
      if (existing_images) {
        body.image_urls = typeof existing_images === 'string' ? JSON.parse(existing_images) : existing_images;
      }

      // Ensure price is numeric if provided
      if (body.price !== undefined) {
        body.price = parseFloat(body.price) || 0;
      }

      const { data: retreat, error } = await supabaseAdmin
        .from('retreats')
        .update(body)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // 2. Performance image cleanup (find removed images)
      if (oldRetreat?.image_urls) {
        const removedImages = oldRetreat.image_urls.filter((url: string) => !body.image_urls?.includes(url));
        await purgeImages(removedImages);
      }

      return NextResponse.json({ success: true, data: retreat });
    }
  } catch (err: any) {
    console.error('Retreat update error:', err);
    return NextResponse.json({ error: 'Failed to update retreat', details: err.message }, { status: 500 });
  }
}

/**
 * DELETE /api/retreats/[id]
 * Protected: Admin only to remove a retreat.
 */
async function deleteHandler(req: NextRequest, { params, admin }: any) {
  try {
    const { id } = params;

    // 1. Fetch retreat to find images to purge
    const { data: retreat } = await supabaseAdmin.from('retreats').select('image_urls').eq('id', id).single();

    if (retreat?.image_urls) {
      await purgeImages(retreat.image_urls);
    }

    const { error } = await supabaseAdmin
      .from('retreats')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Retreat deleted successfully' });
  } catch (err: any) {
    console.error('Retreat deletion error:', err);
    return NextResponse.json({ error: 'Failed to delete retreat', details: err.message }, { status: 500 });
  }
}

export const PATCH = withAuth(patchHandler);
export const DELETE = withAuth(deleteHandler);
