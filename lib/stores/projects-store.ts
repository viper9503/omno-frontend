import { create } from 'zustand';
import type { Project } from '@/features/types';
import { PROJECT_COLORS } from '@/features/types';

type ProjectsState = {
  projects: Project[];
  addProject: (name: string, color?: string) => Project;
  updateProject: (id: string, updates: Partial<Pick<Project, 'name' | 'color'>>) => void;
  deleteProject: (id: string) => void;
  getProject: (id: string) => Project | undefined;
};

export const useProjectsStore = create<ProjectsState>((set, get) => ({
  projects: [],

  addProject: (name, color) => {
    const project: Project = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      name,
      color: color ?? PROJECT_COLORS[get().projects.length % PROJECT_COLORS.length],
      createdAt: Date.now(),
    };
    set((state) => ({ projects: [...state.projects, project] }));
    return project;
  },

  updateProject: (id, updates) => {
    set((state) => ({
      projects: state.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    }));
  },

  deleteProject: (id) => {
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
    }));
  },

  getProject: (id) => get().projects.find((p) => p.id === id),
}));
