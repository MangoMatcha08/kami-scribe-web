
import React, { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { AnnotationLayer } from './AnnotationLayer';
import { PDFControls } from './PDFControls';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PDFViewerProps {
  pdfUrl: string;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({ pdfUrl }) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [pageWidth, setPageWidth] = useState<number>(0);
  const [pageHeight, setPageHeight] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const onPageLoadSuccess = (page: any) => {
    setPageWidth(page.width);
    setPageHeight(page.height);
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= numPages) {
      setPageNumber(page);
    }
  };

  const zoomIn = () => setScale(prev => Math.min(prev + 0.2, 3.0));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.5));

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex-1 overflow-auto bg-gray-100" ref={containerRef}>
        <div className="flex justify-center p-4">
          <div className="relative bg-white shadow-lg">
            <Document
              file={pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={
                <div className="flex items-center justify-center h-96 w-96 bg-gray-50">
                  <div className="text-gray-500">Loading PDF...</div>
                </div>
              }
              error={
                <div className="flex items-center justify-center h-96 w-96 bg-red-50">
                  <div className="text-red-500">Error loading PDF</div>
                </div>
              }
            >
              <Page
                pageNumber={pageNumber}
                scale={scale}
                onLoadSuccess={onPageLoadSuccess}
                loading={
                  <div className="flex items-center justify-center h-96 w-96 bg-gray-50">
                    <div className="text-gray-500">Loading page...</div>
                  </div>
                }
                renderAnnotationLayer={false}
                renderTextLayer={true}
              />
              <AnnotationLayer
                pageNumber={pageNumber}
                scale={scale}
                pageWidth={pageWidth}
                pageHeight={pageHeight}
              />
            </Document>
          </div>
        </div>
      </div>
      
      <PDFControls
        pageNumber={pageNumber}
        numPages={numPages}
        scale={scale}
        onPageChange={goToPage}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
      />
    </div>
  );
};
