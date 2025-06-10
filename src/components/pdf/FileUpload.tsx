
import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      onFileUpload(file);
    }
  }, [onFileUpload]);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      onFileUpload(file);
    }
  }, [onFileUpload]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  return (
    <div 
      className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <Upload className="w-12 h-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Upload PDF Document</h3>
      <p className="text-sm text-gray-500 mb-4">Drag and drop a PDF file here, or click to select</p>
      
      <Button asChild className="bg-purple-600 hover:bg-purple-700">
        <label className="cursor-pointer">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          Choose PDF File
        </label>
      </Button>
    </div>
  );
};
