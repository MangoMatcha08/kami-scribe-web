
import React, { useRef, useEffect, useState } from 'react';
import { Canvas as FabricCanvas, Rect, IText, Path } from 'fabric';
import { useAnnotationStore } from '@/stores/annotationStore';

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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<FabricCanvas>();
  const { currentTool, addAnnotation, annotations } = useAnnotationStore();
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    if (canvasRef.current && pageWidth && pageHeight) {
      const canvas = new FabricCanvas(canvasRef.current, {
        width: pageWidth * scale,
        height: pageHeight * scale,
        backgroundColor: 'transparent',
      });

      // Configure canvas based on current tool
      canvas.selection = currentTool === 'select';
      canvas.isDrawingMode = currentTool === 'drawing';

      // Configure drawing brush for drawing mode
      if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.width = 2;
        canvas.freeDrawingBrush.color = '#ff0000';
      }

      fabricCanvasRef.current = canvas;

      // Handle annotation creation based on current tool
      canvas.on('mouse:down', handleMouseDown);
      canvas.on('mouse:up', handleMouseUp);
      canvas.on('path:created', handlePathCreated);

      return () => {
        canvas.dispose();
      };
    }
  }, [pageWidth, pageHeight, scale, currentTool]);

  const handleMouseDown = (event: any) => {
    if (!event.pointer || !fabricCanvasRef.current) return;
    
    setIsDrawing(true);
    
    if (currentTool === 'highlight') {
      const rect = new Rect({
        left: event.pointer.x,
        top: event.pointer.y,
        width: 100,
        height: 20,
        fill: 'rgba(255, 255, 0, 0.3)',
        stroke: 'rgba(255, 255, 0, 0.8)',
        strokeWidth: 1,
        selectable: true,
      });
      
      fabricCanvasRef.current.add(rect);
      saveAnnotation('highlight', event.pointer.x, event.pointer.y, 100, 20);
    } else if (currentTool === 'text') {
      const text = new IText('Click to edit', {
        left: event.pointer.x,
        top: event.pointer.y,
        fontFamily: 'Arial',
        fontSize: 16,
        fill: '#000000',
        selectable: true,
      });
      
      fabricCanvasRef.current.add(text);
      saveAnnotation('text', event.pointer.x, event.pointer.y);
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handlePathCreated = (event: any) => {
    if (currentTool === 'drawing' && event.path) {
      const pathBounds = event.path.getBoundingRect();
      saveAnnotation('drawing', pathBounds.left, pathBounds.top, pathBounds.width, pathBounds.height);
    }
  };

  const saveAnnotation = (type: string, x: number, y: number, width?: number, height?: number) => {
    addAnnotation({
      type: type as any,
      pageNumber,
      coordinates: { x, y, width, height },
      styles: {
        color: type === 'highlight' ? '#ffff00' : '#000000',
        opacity: type === 'highlight' ? 0.3 : 1.0,
        fontSize: type === 'text' ? 16 : undefined,
      },
    });
  };

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 pointer-events-auto"
      style={{ zIndex: 10 }}
    />
  );
};
