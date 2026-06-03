'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useBuilderStore } from '@/lib/store';
import { parseFileBlocks } from '@/lib/fileParser';
import { StepLog } from './StepLog';
import { Send, Hammer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  files?: string[];
}

interface ChatPanelProps {
  projectId: string;
  initialMessages?: Message[];
}

export function ChatPanel({ projectId, initialMessages = [] }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const store = useBuilderStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isGenerating = store.generationState === 'generating';

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, store.steps]);

  const autoResize = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${Math.min(ta.scrollHeight, 160)}px`;
  };

  const handleSend = useCallback(async (prompt: string) => {
    if (!prompt.trim() || isGenerating) return;

    const userMsg: Message = { role: 'user', content: prompt };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    store.setGenerationState('generating');
    store.clearSteps();
    store.addStep('Reading project files...');

    let response: Response;
    try {
      response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, projectId, files: store.files }),
      });
    } catch {
      store.setGenerationState('error');
      store.addStep('Connection failed. Please try again.');
      return;
    }

    if (!response.ok || !response.body) {
      store.setGenerationState('error');
      store.addStep('Generation failed. Please try again.');
      return;
    }

    store.addStep('Generating code...');
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const partialFiles = parseFileBlocks(buffer);
      if (partialFiles.length > 0) {
        store.mergeFiles(partialFiles);
        store.addStep(`Applying ${partialFiles.length} file(s)...`);
      }
    }

    const finalFiles = parseFileBlocks(buffer);

    store.addStep('Saving project...');
    await fetch(`/api/projects/${projectId}/files`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ files: store.files }),
    });

    const changedPaths = finalFiles.map((f) => f.path);
    const assistantMsg: Message = {
      role: 'assistant',
      content: changedPaths.length > 0
        ? `Updated ${changedPaths.length} file${changedPaths.length > 1 ? 's' : ''}`
        : 'Done',
      files: changedPaths,
    };
    setMessages((prev) => [...prev, assistantMsg]);
    store.setGenerationState('idle');
  }, [isGenerating, projectId, store]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSend(input);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      <div className="flex items-center gap-2 h-10 px-4 border-b border-gray-100 shrink-0">
        <Hammer className="w-4 h-4 text-gray-400" />
        <span className="text-sm font-medium text-gray-600">Chat</span>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-3">
              <Hammer className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-700 mb-1">What would you like to build?</p>
            <p className="text-xs text-gray-400">Describe your app and Forge will generate it instantly.</p>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'user' ? (
                <div className="max-w-[85%] bg-gray-900 text-white rounded-2xl rounded-br-sm px-4 py-2.5 text-sm">
                  {msg.content}
                </div>
              ) : (
                <div className="max-w-[90%]">
                  <div className="bg-gray-100 text-gray-800 rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm">
                    {msg.content}
                  </div>
                  {msg.files && msg.files.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1.5 pl-1">
                      {msg.files.map((path) => (
                        <span
                          key={path}
                          className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md font-mono"
                        >
                          {path.split('/').pop()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isGenerating && store.steps.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-50 rounded-2xl rounded-bl-sm"
          >
            <StepLog steps={store.steps} isGenerating={isGenerating} />
          </motion.div>
        )}
      </div>

      <div className="p-3 border-t border-gray-100 shrink-0">
        <div className="flex items-end gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-gray-900 focus-within:border-transparent transition">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              autoResize();
            }}
            onKeyDown={handleKeyDown}
            placeholder="Describe what you want to build..."
            disabled={isGenerating}
            className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 resize-none focus:outline-none disabled:opacity-50 leading-relaxed"
            style={{ minHeight: '24px', maxHeight: '160px' }}
          />
          <button
            onClick={() => handleSend(input)}
            disabled={isGenerating || !input.trim()}
            className="shrink-0 w-7 h-7 bg-gray-900 rounded-lg flex items-center justify-center hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <Send className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
        <p className="text-center text-xs text-gray-400 mt-1.5">
          {isGenerating ? 'Generating...' : '⌘ Enter to send'}
        </p>
      </div>
    </div>
  );
}
