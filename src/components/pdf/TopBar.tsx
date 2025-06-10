
import React from 'react';
import { Share } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TopBarProps {
  fileName: string;
}

export const TopBar: React.FC<TopBarProps> = ({ fileName }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
      <div className="flex items-center space-x-4">
        <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center text-white font-bold text-sm">
          K
        </div>
        <span className="text-sm text-gray-600">{fileName}</span>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm">
          <Share className="w-4 h-4 mr-1" />
          Share
        </Button>
        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
          U
        </div>
      </div>
    </div>
  );
};
