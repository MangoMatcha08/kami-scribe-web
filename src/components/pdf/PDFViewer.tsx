import React, { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { AnnotationLayer } from './AnnotationLayer';
import { PDFControls } from './PDFControls';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf-worker/pdf.worker.min.js';

interface PDFViewerProps {
  pdfUrl: string;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({ pdfUrl }) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [pageSizes, setPageSizes] = useState<Record<number, { width: number; height: number }>>({});

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const onPageLoadSuccess = (page: any) => {
    setPageSizes(sizes => {
      const currentSize = sizes[page.pageNumber];
      if (currentSize?.width === page.width && currentSize?.height === page.height) {
        return sizes;
      }
      return {
        ...sizes,
        [page.pageNumber]: { width: page.width, height: page.height }
      };
    });
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= numPages) {
      setPageNumber(page);
    }
  };

  // Adjust zoom step size to be smaller
  const zoomIn = () => setScale(prev => Math.min(prev + 0.1, 2.0));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.5));

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex-1 overflow-auto bg-gray-100">
        <div className="flex justify-center py-8">
          <div className="bg-white shadow-lg">
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
              {Array.from({ length: numPages })
                .map((_, idx) => {
                  const pageNum = idx + 1;
                  const size = pageSizes[pageNum] || { width: 0, height: 0 };
                  return (
                    <div
                      key={pageNum}
                      className="relative mx-auto mb-8 last:mb-0"
                      style={{
                        width: size.width || undefined,
                        height: size.height || undefined,
                        padding: 0,
                      }}
                    >
                      <Page
                        pageNumber={pageNum}
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
                      {size.width > 0 && size.height > 0 && (
                        <AnnotationLayer
                          pageNumber={pageNum}
                          scale={scale}
                          pageWidth={size.width}
                          pageHeight={size.height}
                        />
                      )}
                    </div>
                  );
                })}
            </Document>
          </div>
        </div>
      </div>
      {/* Make PDFControls sticky at the bottom of the viewport */}
      <div className="sticky bottom-0 left-0 w-full z-50 bg-gray-800">
        <PDFControls
          pageNumber={pageNumber}
          numPages={numPages}
          scale={scale}
          onPageChange={goToPage}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
        />
      </div>
    </div>
  );
};
