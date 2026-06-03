'use client';

import { useState } from 'react';
import { Hammer, Plus, LogOut, Bell } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { NewProjectModal } from './NewProjectModal';
import { ProjectCard } from './ProjectCard';
import { useEffect } from 'react';

interface Project {
  id: string;
  name: string;
  description?: string;
  updated_at: string;
}

export function DashboardClient({ initialProjects }: { initialProjects: Project[] }) {
  const [projects, setProjects] = useState(initialProjects);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  async function handleProjectCreated() {
    const res = await fetch('/api/projects');
    const updated = await res.json();
    setProjects(updated);
    setShowModal(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white border-b border-gray-200 h-14 flex items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-900 rounded flex items-center justify-center">
            <Hammer className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-gray-900">Forge</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition">
            <Bell className="w-5 h-5 text-gray-500" />
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </nav>

      <main className="flex-1 px-6 py-8 max-w-6xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
            <p className="text-gray-500 text-sm mt-1">Build apps with AI</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-gray-800 transition"
          >
            <Plus className="w-4 h-4" />
            New project
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-3">
                <Hammer className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-gray-700 font-medium">No projects yet</p>
              <p className="text-gray-500 text-sm mt-1">Create your first project to get started</p>
            </div>
          ) : (
            projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))
          )}
        </div>
      </main>

      {showModal && <NewProjectModal onClose={() => setShowModal(false)} onCreated={handleProjectCreated} />}
    </div>
  );
}
