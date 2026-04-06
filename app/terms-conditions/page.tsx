import { supabaseAdmin } from "@/lib/supabase-admin";
import DynamicPageClient from "@/app/components/DynamicPageClient";

export async function generateMetadata() {
  return { title: 'Terms & Conditions | Abharana Kakal' };
}

export default async function TermsConditionsPage() {
  const { data } = await supabaseAdmin
    .from('pages')
    .select('title, content')
    .eq('slug', 'terms-conditions')
    .single();

  if (!data) {
    return (
      <DynamicPageClient 
        title="Terms & Conditions" 
        content="This page is being updated. Please check back later." 
      />
    );
  }

  return <DynamicPageClient title={data.title} content={data.content} />;
}
