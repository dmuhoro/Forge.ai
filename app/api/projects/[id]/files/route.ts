import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: project } = await supabase
    .from('projects')
    .select('id')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .maybeSingle();
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const { data, error } = await supabase
    .from('files')
    .select('path, content')
    .eq('project_id', params.id)
    .order('path');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: project } = await supabase
    .from('projects')
    .select('id')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .maybeSingle();
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const { files } = await req.json();
  if (!Array.isArray(files)) {
    return NextResponse.json({ error: 'files must be an array' }, { status: 400 });
  }

  const rows = files.map((f: { path: string; content: string }) => ({
    project_id: params.id,
    path: f.path,
    content: f.content,
    updated_at: new Date().toISOString(),
  }));

  const { error } = await supabase
    .from('files')
    .upsert(rows, { onConflict: 'project_id,path' });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabase
    .from('projects')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', params.id);

  return NextResponse.json({ ok: true });
}
