import { supabaseAdmin } from "@/lib/supabase-admin";
import DynamicPageClient from "@/app/components/DynamicPageClient";

export async function generateMetadata() {
  return { title: 'Refund Policy | Abharana Kakal' };
}

export default async function RefundPolicyPage() {
  const { data } = await supabaseAdmin
    .from('pages')
    .select('title, content')
    .eq('slug', 'refund-policy')
    .single();

  if (!data) {
    return (
      <DynamicPageClient 
        title="Refund Policy" 
        content="This page is being updated. Please check back later." 
      />
    );
  }

  return <DynamicPageClient title={data.title} content={data.content} />;
}
