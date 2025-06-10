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
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = React.useRef<any>(null);

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

        // Add a test rectangle with 2% margin on all sides
        const rectWidth = pageWidth * 0.96;
        const rectHeight = pageHeight * 0.96;
        const rect = new fabric.Rect({
          left: pageWidth * 0.02, // 2% margin left
          top: pageHeight * 0.02, // 2% margin top
          width: rectWidth,
          height: rectHeight,
          fill: 'rgba(0,255,0,0.5)',
          stroke: 'green',
          strokeWidth: 2,
        });

        fabricCanvasRef.current.add(rect);
        
        // Set zoom level
        fabricCanvasRef.current.setZoom(scale);
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
  }, [pageWidth, pageHeight]); // Remove scale from dependencies to prevent infinite updates

  // Handle scale changes separately
  React.useEffect(() => {
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.setZoom(scale);
      fabricCanvasRef.current.renderAll();
    }
  }, [scale]);

  return (
    <div
      className="absolute inset-0 pointer-events-none"
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
          pointerEvents: 'auto',
        }}
      />
    </div>
  );
};
