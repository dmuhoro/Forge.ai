'use client';

import Link from 'next/link';
import { ArrowRight, FileText, MoreVertical } from 'lucide-react';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface Project {
  id: string;
  name: string;
  description?: string;
  updated_at: string;
}

export function ProjectCard({ project }: { project: Project }) {
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const updated = new Date(project.updated_at);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  let timeStr = '';
  if (updated.toDateString() === today.toDateString()) {
    timeStr = 'Today at ' + updated.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  } else if (updated.toDateString() === yesterday.toDateString()) {
    timeStr = 'Yesterday';
  } else {
    timeStr = updated.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  async function handleDelete() {
    if (!confirm('Delete this project?')) return;
    await fetch(`/api/projects/${project.id}`, { method: 'DELETE' });
    router.refresh();
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-shadow group relative">
      <div className="flex items-start justify-between mb-3">
        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
          <FileText className="w-4 h-4 text-gray-400" />
        </div>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 opacity-0 group-hover:opacity-100 hover:bg-gray-100 rounded transition"
          >
            <MoreVertical className="w-4 h-4 text-gray-400" />
          </button>
          {showMenu && (
            <div className="absolute top-8 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <button
                onClick={handleDelete}
                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
      <h3 className="font-semibold text-gray-900 mb-1 truncate">{project.name}</h3>
      {project.description && <p className="text-xs text-gray-500 line-clamp-2 mb-3">{project.description}</p>}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <span className="text-xs text-gray-400">{timeStr}</span>
        <Link
          href={`/builder/${project.id}`}
          className="flex items-center gap-1 text-xs font-medium text-gray-700 hover:text-gray-900 group/link"
        >
          Open
          <ArrowRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
