import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@/lib/supabase/server';
import { CODE_GENERATION_SYSTEM_PROMPT } from '@/lib/prompts';
import { NextRequest } from 'next/server';

const anthropic = new Anthropic();

function formatProjectFiles(files: Array<{ path: string; content: string }>): string {
  if (!files.length) return '(no files yet — start from scratch)';
  return files
    .map((f) => `<path>${f.path}</path>\n<content>\n${f.content}\n</content>`)
    .join('\n\n');
}

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new Response('Unauthorized', { status: 401 });

  const { prompt, projectId, files = [] } = await req.json();

  const userMessage = `<project_files>\n${formatProjectFiles(files)}\n</project_files>\n\n${prompt}`;

  const stream = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8000,
    stream: true,
    system: CODE_GENERATION_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMessage }],
  });

  const readable = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      for await (const event of stream) {
        if (
          event.type === 'content_block_delta' &&
          event.delta.type === 'text_delta'
        ) {
          controller.enqueue(encoder.encode(event.delta.text));
        }
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
      'X-Accel-Buffering': 'no',
    },
  });
}
