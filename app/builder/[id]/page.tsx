import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { BuilderShell } from '@/components/builder/BuilderShell';

export default async function BuilderPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .maybeSingle();

  if (!project) {
    redirect('/dashboard');
  }

  const { data: files } = await supabase
    .from('files')
    .select('path, content')
    .eq('project_id', params.id)
    .order('path');

  return (
    <BuilderShell
      projectId={project.id}
      projectName={project.name}
      initialFiles={files || []}
    />
  );
}
