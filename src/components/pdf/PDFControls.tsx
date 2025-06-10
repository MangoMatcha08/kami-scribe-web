
import React from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PDFControlsProps {
  pageNumber: number;
  numPages: number;
  scale: number;
  onPageChange: (page: number) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export const PDFControls: React.FC<PDFControlsProps> = ({
  pageNumber,
  numPages,
  scale,
  onPageChange,
  onZoomIn,
  onZoomOut
}) => {
  return (
    <div className="flex items-center justify-center p-4 bg-gray-800 text-white">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(pageNumber - 1)}
          disabled={pageNumber <= 1}
          className="text-white hover:bg-gray-700"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        
        <span className="text-sm">
          {pageNumber} / {numPages}
        </span>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(pageNumber + 1)}
          disabled={pageNumber >= numPages}
          className="text-white hover:bg-gray-700"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
        
        <div className="w-px h-6 bg-gray-600 mx-2" />
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onZoomOut}
          className="text-white hover:bg-gray-700"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        
        <span className="text-sm min-w-[4rem] text-center">
          {Math.round(scale * 100)}%
        </span>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onZoomIn}
          className="text-white hover:bg-gray-700"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
