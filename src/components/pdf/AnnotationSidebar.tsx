import React from 'react';
import { 
  ArrowUp,
  Image,
  Text,
  Circle,
  BookOpen
} from 'lucide-react';
import { useAnnotationStore } from '@/stores/annotationStore';
import { Button } from '@/components/ui/button';

export const AnnotationSidebar = () => {
  const { currentTool, setCurrentTool } = useAnnotationStore();

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
    </div>
  );
};
