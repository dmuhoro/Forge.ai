import { create } from 'zustand';
import type { ParsedFile } from './fileParser';

type GenerationState = 'idle' | 'generating' | 'error';

interface BuilderStore {
  files: ParsedFile[];
  generationState: GenerationState;
  steps: string[];
  setFiles: (files: ParsedFile[]) => void;
  mergeFiles: (incoming: ParsedFile[]) => void;
  setGenerationState: (s: GenerationState) => void;
  addStep: (step: string) => void;
  clearSteps: () => void;
}

export const useBuilderStore = create<BuilderStore>((set) => ({
  files: [],
  generationState: 'idle',
  steps: [],
  setFiles: (files) => set({ files }),
  mergeFiles: (incoming) =>
    set((state) => {
      const map = new Map(state.files.map((f) => [f.path, f]));
      incoming.forEach((f) => map.set(f.path, f));
      return { files: Array.from(map.values()) };
    }),
  setGenerationState: (generationState) => set({ generationState }),
  addStep: (step) => set((state) => ({ steps: [...state.steps, step] })),
  clearSteps: () => set({ steps: [] }),
}));
