import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { DashboardClient } from '@/components/dashboard/DashboardClient';

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: projects } = await supabase
    .from('projects')
    .select('id, name, description, updated_at')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  return <DashboardClient initialProjects={projects || []} />;
}
