import { createClient } from '@/lib/supabase/server';
import { TEMPLATES } from '@/lib/templates';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { name, description, template = 'blank' } = await req.json();
  if (!name?.trim()) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }

  const { data: project, error: projectError } = await supabase
    .from('projects')
    .insert({ user_id: user.id, name: name.trim(), description, template })
    .select()
    .single();

  if (projectError) return NextResponse.json({ error: projectError.message }, { status: 500 });

  const starterFiles = TEMPLATES[template] ?? TEMPLATES.blank;
  const fileRows = starterFiles.map((f) => ({
    project_id: project.id,
    path: f.path,
    content: f.content,
  }));

  const { error: filesError } = await supabase.from('files').insert(fileRows);
  if (filesError) return NextResponse.json({ error: filesError.message }, { status: 500 });

  return NextResponse.json(project, { status: 201 });
}
