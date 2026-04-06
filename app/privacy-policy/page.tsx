import { supabaseAdmin } from "@/lib/supabase-admin";
import DynamicPageClient from "@/app/components/DynamicPageClient";

export async function generateMetadata() {
  return { title: 'Privacy Policy | Abharana Kakal' };
}

export default async function PrivacyPolicyPage() {
  const { data } = await supabaseAdmin
    .from('pages')
    .select('title, content')
    .eq('slug', 'privacy-policy')
    .single();

  if (!data) {
    return (
      <DynamicPageClient 
        title="Privacy Policy" 
        content="This page is being updated. Please check back later." 
      />
    );
  }

  return <DynamicPageClient title={data.title} content={data.content} />;
}
