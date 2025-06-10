
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
    { id: 'select', icon: ArrowUp, label: 'Select' },
    { id: 'image', icon: Image, label: 'Image' },
    { id: 'text', icon: Text, label: 'Text' },
    { id: 'highlight', icon: Circle, label: 'Highlight' },
    { id: 'bookmark', icon: BookOpen, label: 'Bookmark' },
  ];

  return (
    <div className="flex flex-col items-center py-4 space-y-2">
      {tools.map(({ id, icon: Icon, label }) => (
        <Button
          key={id}
          variant={currentTool === id ? 'default' : 'ghost'}
          size="icon"
          className={`w-12 h-12 ${
            currentTool === id 
              ? 'bg-purple-600 text-white' 
              : 'text-white hover:bg-slate-700'
          }`}
          onClick={() => setCurrentTool(id as any)}
          title={label}
        >
          <Icon className="w-5 h-5" />
        </Button>
      ))}
    </div>
  );
};
