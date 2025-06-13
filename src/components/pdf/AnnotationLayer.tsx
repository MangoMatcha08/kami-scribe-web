import React, { useRef, useEffect, useState } from 'react';
import { Canvas as FabricCanvas, Rect, IText, Path, Object as FabricObject } from 'fabric';
import { useAnnotationStore } from '@/stores/annotationStore';
import { 
  PDFCoordinates, 
  ViewportCoordinates, 
  CanvasCoordinates,
  viewportToCanvasCoords,
  canvasToPDFCoords,
  pdfToCanvasCoords,
  getViewportCoords
} from '@/lib/coordinates';

// Extend FabricObject to include our custom data property
interface HighlightObject extends FabricObject {
  data?: {
    id: string;
  };
}

interface AnnotationLayerProps {
  pageNumber: number;
  scale: number;
  pageWidth: number;
  pageHeight: number;
}

export const AnnotationLayer: React.FC<AnnotationLayerProps> = ({
  pageNumber,
  scale,
  pageWidth,
  pageHeight
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = React.useRef<FabricCanvas | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const currentTool = useAnnotationStore(state => state.currentTool);
  const addAnnotation = useAnnotationStore(state => state.addAnnotation);
  const annotations = useAnnotationStore(state => state.annotations);
  
  // Track drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [startCoords, setStartCoords] = useState<CanvasCoordinates | null>(null);
  const [currentRect, setCurrentRect] = useState<Rect | null>(null);

  // Debug: Log all annotations and currentTool on every render
  console.log('[AnnotationLayer] annotations:', annotations);
  console.log('[AnnotationLayer] currentTool:', currentTool);

  // Initialize canvas only when dimensions are available
  React.useEffect(() => {
    if (!pageWidth || !pageHeight) return;

    let disposed = false;
    const initCanvas = async () => {
      try {
        const fabric = await import('fabric');
        
        // Dispose of previous canvas if it exists
        if (fabricCanvasRef.current) {
          fabricCanvasRef.current.dispose();
        }

        if (!canvasRef.current) return;

        // Create new canvas with proper dimensions
        fabricCanvasRef.current = new fabric.Canvas(canvasRef.current, {
          backgroundColor: 'transparent',
          width: pageWidth,
          height: pageHeight,
          selection: false,
          renderOnAddRemove: true,
          preserveObjectStacking: true,
        });

        // Clear any existing objects
        fabricCanvasRef.current.clear();
        
        // Set initial zoom level
        fabricCanvasRef.current.setZoom(scale);
        
        // Render existing highlights
        const pageHighlights = annotations.filter(
          a => a.type === 'highlight' && a.pageNumber === pageNumber
        );
        // Debug: Log page highlights
        console.log(`[AnnotationLayer] pageHighlights for page ${pageNumber}:`, pageHighlights);

        pageHighlights.forEach(highlight => {
          const canvasCoords = pdfToCanvasCoords(
            {
              x: highlight.coordinates.x,
              y: highlight.coordinates.y,
              width: highlight.coordinates.width || 0,
              height: highlight.coordinates.height || 0,
              pageNumber: highlight.pageNumber
            },
            fabricCanvasRef.current!,
            scale
          );

          const rect = new fabric.Rect({
            left: canvasCoords.x,
            top: canvasCoords.y,
            width: canvasCoords.width || 0,
            height: canvasCoords.height || 0,
            fill: `rgba(255, 255, 0, ${highlight.styles.opacity})`,
            stroke: 'rgba(255, 255, 0, 0.8)',
            strokeWidth: 1,
            selectable: false,
            data: { id: highlight.id }
          });

          fabricCanvasRef.current!.add(rect);
        });

        fabricCanvasRef.current.renderAll();
      } catch (error) {
        console.error('Error initializing canvas:', error);
      }
    };

    initCanvas();

    return () => {
      if (fabricCanvasRef.current && !disposed) {
        fabricCanvasRef.current.dispose();
        disposed = true;
      }
    };
  }, [pageWidth, pageHeight, pageNumber, annotations, scale]);

  // Handle scale changes
  React.useEffect(() => {
    if (!fabricCanvasRef.current) return;

    // Update zoom level
    fabricCanvasRef.current.setZoom(scale);
    
    // Update all object positions and sizes
    fabricCanvasRef.current.getObjects().forEach(obj => {
      const highlightObj = obj as HighlightObject;
      if (highlightObj.data?.id) {
        const highlight = annotations.find(a => a.id === highlightObj.data.id);
        if (highlight) {
          const canvasCoords = pdfToCanvasCoords(
            {
              x: highlight.coordinates.x,
              y: highlight.coordinates.y,
              width: highlight.coordinates.width || 0,
              height: highlight.coordinates.height || 0,
              pageNumber: highlight.pageNumber
            },
            fabricCanvasRef.current!,
            scale
          );

          highlightObj.set({
            left: canvasCoords.x,
            top: canvasCoords.y,
            width: canvasCoords.width || 0,
            height: canvasCoords.height || 0,
          });
        }
      }
    });

    fabricCanvasRef.current.renderAll();
  }, [scale, annotations]);

  // Mouse event handlers
  const handleMouseDown = (event: React.MouseEvent) => {
    console.log('[AnnotationLayer] handleMouseDown fired');
    if (currentTool !== 'highlight' || !fabricCanvasRef.current || !containerRef.current) return;

    const viewportCoords = getViewportCoords(event.nativeEvent);
    const canvasCoords = viewportToCanvasCoords(viewportCoords, containerRef.current, scale);
    
    setIsDrawing(true);
    setStartCoords(canvasCoords);

    // Create a new rectangle at the start position
    const rect = new Rect({
      left: canvasCoords.x,
      top: canvasCoords.y,
      width: 0,
      height: 0,
      fill: 'rgba(255, 255, 0, 0.3)',
      stroke: 'rgba(255, 255, 0, 0.8)',
      strokeWidth: 1,
      selectable: false,
    });

    fabricCanvasRef.current.add(rect);
    setCurrentRect(rect);
    fabricCanvasRef.current.renderAll();
    console.log('[AnnotationLayer] Rectangle added to canvas');
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isDrawing || !fabricCanvasRef.current || !containerRef.current || !startCoords || !currentRect) return;
    console.log('[AnnotationLayer] handleMouseMove fired');
    const viewportCoords = getViewportCoords(event.nativeEvent);
    const canvasCoords = viewportToCanvasCoords(viewportCoords, containerRef.current, scale);

    // Calculate rectangle dimensions
    const width = canvasCoords.x - startCoords.x;
    const height = canvasCoords.y - startCoords.y;

    // Update rectangle position and size
    currentRect.set({
      left: width < 0 ? canvasCoords.x : startCoords.x,
      top: height < 0 ? canvasCoords.y : startCoords.y,
      width: Math.abs(width),
      height: Math.abs(height),
    });

    fabricCanvasRef.current.renderAll();
  };

  const handleMouseUp = (event: React.MouseEvent) => {
    console.log('[AnnotationLayer] handleMouseUp fired');
    if (!isDrawing || !fabricCanvasRef.current || !containerRef.current || !startCoords || !currentRect) return;
    console.log('[AnnotationLayer] handleMouseUp conditions passed');

    const viewportCoords = getViewportCoords(event.nativeEvent);
    const canvasCoords = viewportToCanvasCoords(viewportCoords, containerRef.current, scale);

    // Calculate final dimensions
    const width = canvasCoords.x - startCoords.x;
    const height = canvasCoords.y - startCoords.y;

    // Only create annotation if the rectangle has a minimum size
    if (Math.abs(width) > 5 && Math.abs(height) > 5) {
      // Convert to PDF coordinates for storage
      const pdfCoords = canvasToPDFCoords(
        {
          x: width < 0 ? canvasCoords.x : startCoords.x,
          y: height < 0 ? canvasCoords.y : startCoords.y,
          width: Math.abs(width),
          height: Math.abs(height),
        },
        fabricCanvasRef.current,
        scale,
        pageNumber
      );
      // Debug: Log annotation being added
      console.log('[AnnotationLayer] addAnnotation', {
        type: 'highlight',
        pageNumber,
        coordinates: {
          x: pdfCoords.x,
          y: pdfCoords.y,
          width: pdfCoords.width,
          height: pdfCoords.height,
        },
        styles: {
          color: 'yellow',
          opacity: 0.3,
        },
      });
      // Add to annotation store
      addAnnotation({
        type: 'highlight',
        pageNumber,
        coordinates: {
          x: pdfCoords.x,
          y: pdfCoords.y,
          width: pdfCoords.width,
          height: pdfCoords.height,
        },
        styles: {
          color: 'yellow',
          opacity: 0.3,
        },
      });
    } else {
      // Remove the rectangle if it's too small
      fabricCanvasRef.current.remove(currentRect);
    }

    // Always reset local drawing state after mouse up
    setIsDrawing(false);
    setStartCoords(null);
    setCurrentRect(null);
    fabricCanvasRef.current.renderAll();
  };

  return (
    <div
      ref={containerRef}
      className="absolute inset-0"
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      <canvas
        id={`annotation-layer-canvas-${pageNumber}`}
        ref={canvasRef}
        width={pageWidth || 300}
        height={pageHeight || 300}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 10,
          pointerEvents: currentTool === 'highlight' ? 'auto' : 'none',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    </div>
  );
};
