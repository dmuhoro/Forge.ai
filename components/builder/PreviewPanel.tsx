'use client';

import {
  SandpackProvider,
  SandpackPreview,
  SandpackCodeEditor,
  SandpackFileExplorer,
} from '@codesandbox/sandpack-react';
import { useBuilderStore } from '@/lib/store';
import { toSandpackFiles } from '@/lib/fileParser';
import { useState } from 'react';
import { Monitor, Code2, FolderOpen } from 'lucide-react';

type Tab = 'preview' | 'code' | 'files';

const TABS = [
  { id: 'preview' as Tab, label: 'Preview', icon: Monitor },
  { id: 'code' as Tab, label: 'Code', icon: Code2 },
  { id: 'files' as Tab, label: 'Files', icon: FolderOpen },
];

export function PreviewPanel() {
  const files = useBuilderStore((s) => s.files);
  const [tab, setTab] = useState<Tab>('preview');

  const sandpackFiles = toSandpackFiles(files);
  const hasFiles = Object.keys(sandpackFiles).length > 0;

  return (
    <div className="flex flex-col h-full bg-gray-100">
      <div className="flex items-center gap-1 px-3 h-10 bg-white border-b border-gray-200 shrink-0">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-sm font-medium transition-colors ${
              tab === id
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-hidden">
        {hasFiles ? (
          <SandpackProvider
            template="react"
            files={sandpackFiles}
            options={{ recompileMode: 'delayed', recompileDelay: 500 }}
            customSetup={{
              dependencies: {
                'lucide-react': 'latest',
                recharts: 'latest',
              },
            }}
          >
            {tab === 'preview' && (
              <SandpackPreview
                style={{ height: '100%' }}
                showOpenInCodeSandbox={false}
                showRefreshButton
              />
            )}
            {tab === 'code' && (
              <SandpackCodeEditor style={{ height: '100%' }} showTabs />
            )}
            {tab === 'files' && (
              <SandpackFileExplorer style={{ height: '100%' }} />
            )}
          </SandpackProvider>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-200 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <Monitor className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500">Start chatting to see your app here</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
