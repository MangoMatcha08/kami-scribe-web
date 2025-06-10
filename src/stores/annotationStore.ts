
import { create } from 'zustand';

export type AnnotationTool = 'select' | 'image' | 'text' | 'highlight' | 'bookmark' | 'drawing';

export interface Annotation {
  id: string;
  type: AnnotationTool;
  pageNumber: number;
  coordinates: {
    x: number;
    y: number;
    width?: number;
    height?: number;
  };
  content?: string;
  styles: {
    color: string;
    opacity: number;
    fontSize?: number;
  };
  createdAt: Date;
}

interface AnnotationStore {
  annotations: Annotation[];
  currentTool: AnnotationTool;
  selectedAnnotation: Annotation | null;
  setCurrentTool: (tool: AnnotationTool) => void;
  addAnnotation: (annotation: Omit<Annotation, 'id' | 'createdAt'>) => void;
  selectAnnotation: (annotation: Annotation | null) => void;
  deleteAnnotation: (id: string) => void;
}

export const useAnnotationStore = create<AnnotationStore>((set, get) => ({
  annotations: [],
  currentTool: 'select',
  selectedAnnotation: null,

  setCurrentTool: (tool) => set({ currentTool: tool }),

  addAnnotation: (annotationData) => {
    const newAnnotation: Annotation = {
      id: crypto.randomUUID(),
      createdAt: new Date(),
      ...annotationData,
    };
    
    set(state => ({
      annotations: [...state.annotations, newAnnotation]
    }));
  },

  selectAnnotation: (annotation) => set({ selectedAnnotation: annotation }),

  deleteAnnotation: (id) => set(state => ({
    annotations: state.annotations.filter(a => a.id !== id),
    selectedAnnotation: state.selectedAnnotation?.id === id ? null : state.selectedAnnotation
  })),
}));
