import React from 'react';
import { 
  ArrowUp,
  Image,
  Text,
  Circle,
  BookOpen,
  Trash2,
  Undo2
} from 'lucide-react';
import { useAnnotationStore } from '@/stores/annotationStore';
import { Button } from '@/components/ui/button';

export const AnnotationSidebar = () => {
  // Use Zustand selectors for all store values/actions
  const currentTool = useAnnotationStore(state => state.currentTool);
  const setCurrentTool = useAnnotationStore(state => state.setCurrentTool);
  const clearAnnotations = useAnnotationStore(state => state.clearAnnotations);
  const undoAnnotation = useAnnotationStore(state => state.undoAnnotation);

  const tools = [
    { id: 'text', icon: Text, label: 'Text' },
    { id: 'highlight', icon: Circle, label: 'Highlight' },
  ];

  return (
    <div className="flex flex-col items-center py-4 space-y-2">
      {tools.map(({ id, icon: Icon, label }) => (
        <Button
          key={id}
          variant={currentTool === id ? 'default' : 'ghost'}
          size="icon"
          className={`w-12 h-12 border-2 flex flex-col items-center justify-center transition-colors duration-150
            ${currentTool === id 
              ? 'bg-purple-600 text-white border-purple-700' 
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:border-purple-400'}
          `}
          onClick={() => setCurrentTool(id as any)}
          title={label}
        >
          <Icon className="w-5 h-5 mb-1" />
          <span className="text-xs font-medium leading-tight">{label}</span>
        </Button>
      ))}
      <div className="h-4" />
      <Button
        variant="ghost"
        size="icon"
        className="w-12 h-12 border-2 flex flex-col items-center justify-center text-red-600 border-gray-300 hover:bg-red-50 hover:border-red-400"
        onClick={clearAnnotations}
        title="Clear all annotations"
      >
        <Trash2 className="w-5 h-5 mb-1" />
        <span className="text-xs font-medium leading-tight">Clear</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="w-12 h-12 border-2 flex flex-col items-center justify-center text-yellow-600 border-gray-300 hover:bg-yellow-50 hover:border-yellow-400"
        onClick={undoAnnotation}
        title="Undo last annotation"
      >
        <Undo2 className="w-5 h-5 mb-1" />
        <span className="text-xs font-medium leading-tight">Undo</span>
      </Button>
    </div>
  );
};
