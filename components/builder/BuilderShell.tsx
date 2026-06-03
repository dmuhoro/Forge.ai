'use client';

import { useEffect, useState } from 'react';
import { useBuilderStore } from '@/lib/store';
import { ChatPanel } from './ChatPanel';
import { PreviewPanel } from './PreviewPanel';
import type { ParsedFile } from '@/lib/fileParser';
import { Hammer, ExternalLink, Check, PencilLine } from 'lucide-react';
import Link from 'next/link';

interface BuilderShellProps {
  projectId: string;
  projectName: string;
  initialFiles: ParsedFile[];
}

export function BuilderShell({ projectId, projectName, initialFiles }: BuilderShellProps) {
  const setFiles = useBuilderStore((s) => s.setFiles);
  const [name, setName] = useState(projectName);
  const [editingName, setEditingName] = useState(false);
  const [savedName, setSavedName] = useState(false);

  useEffect(() => {
    setFiles(initialFiles);
  }, [initialFiles, setFiles]);

  async function saveName(newName: string) {
    if (!newName.trim() || newName === projectName) {
      setName(projectName);
      setEditingName(false);
      return;
    }
    await fetch(`/api/projects/${projectId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName }),
    });
    setSavedName(true);
    setEditingName(false);
    setTimeout(() => setSavedName(false), 2000);
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-900">
      {/* Toolbar */}
      <div className="h-12 bg-gray-900 border-b border-gray-800 flex items-center px-4 gap-3 shrink-0">
        <Link href="/dashboard" className="flex items-center gap-1.5 group">
          <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
            <Hammer className="w-3.5 h-3.5 text-gray-900" />
          </div>
          <span className="text-white font-semibold text-sm hidden sm:block">Forge</span>
        </Link>

        <div className="h-4 w-px bg-gray-700" />

        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          {editingName ? (
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => saveName(name)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveName(name);
                if (e.key === 'Escape') { setName(projectName); setEditingName(false); }
              }}
              className="bg-gray-800 text-white text-sm px-2 py-0.5 rounded border border-gray-600 focus:outline-none focus:border-gray-400 w-48"
            />
          ) : (
            <button
              onClick={() => setEditingName(true)}
              className="flex items-center gap-1.5 text-gray-300 hover:text-white text-sm group"
            >
              <span className="truncate max-w-[200px]">{name}</span>
              <PencilLine className="w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity" />
            </button>
          )}
          {savedName && (
            <span className="flex items-center gap-1 text-green-400 text-xs">
              <Check className="w-3 h-3" /> Saved
            </span>
          )}
        </div>

        <button className="flex items-center gap-1.5 text-xs font-medium bg-white text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition shrink-0">
          <ExternalLink className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Deploy</span>
        </button>
      </div>

      {/* Main area */}
      <div className="flex flex-1 overflow-hidden">
        <div className="w-[42%] min-w-[320px] max-w-[560px] flex flex-col overflow-hidden">
          <ChatPanel projectId={projectId} />
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
          <PreviewPanel />
        </div>
      </div>
    </div>
  );
}
