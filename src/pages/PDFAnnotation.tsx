
import React, { useState } from 'react';
import { Sidebar, SidebarContent, SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AnnotationSidebar } from '@/components/pdf/AnnotationSidebar';
import { PDFViewer } from '@/components/pdf/PDFViewer';
import { TopBar } from '@/components/pdf/TopBar';
import { FileUpload } from '@/components/pdf/FileUpload';

const PDFAnnotation = () => {
  const [currentPDF, setCurrentPDF] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string>('');

  const handleFileUpload = (file: File) => {
    setCurrentPDF(file);
    const url = URL.createObjectURL(file);
    setPdfUrl(url);
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background">
        <Sidebar side="left" className="w-16 bg-slate-800">
          <SidebarContent>
            <AnnotationSidebar />
          </SidebarContent>
        </Sidebar>
        
        <SidebarInset className="flex-1 flex flex-col">
          <TopBar fileName={currentPDF?.name || 'No document'} />
          
          <div className="flex-1 flex items-center justify-center p-4">
            {!pdfUrl ? (
              <FileUpload onFileUpload={handleFileUpload} />
            ) : (
              <PDFViewer pdfUrl={pdfUrl} />
            )}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default PDFAnnotation;
