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
  pageWidth,
  pageHeight
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = React.useRef<any>(null);

  React.useEffect(() => {
    if (!pageWidth || !pageHeight) return;
    let disposed = false;
    import('fabric').then(mod => {
      const fabric = mod;
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
      }
      if (canvasRef.current) {
        fabricCanvasRef.current = new fabric.Canvas(canvasRef.current, {
          backgroundColor: 'transparent',
          width: pageWidth,
          height: pageHeight,
        });
        // Clear all objects before adding the rectangle
        fabricCanvasRef.current.clear();
        // Add a visible rectangle for confirmation
        const rect = new fabric.Rect({
          left: 50,
          top: 50,
          width: 100,
          height: 50,
          fill: 'rgba(0,255,0,0.5)',
          stroke: 'green',
          strokeWidth: 2,
        });
        fabricCanvasRef.current.add(rect);
        console.log('Fabric.js initialized on annotation layer, rectangle added');
      }
    });
    return () => {
      if (fabricCanvasRef.current && !disposed) {
        fabricCanvasRef.current.dispose();
        disposed = true;
      }
    };
  }, [pageWidth, pageHeight]);

  return (
    <canvas
      id="annotation-layer-canvas"
      ref={canvasRef}
      width={pageWidth || 300}
      height={pageHeight || 300}
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 9999,
        border: '2px solid green',
        background: 'rgba(0,255,0,0.1)'
      }}
    />
  );
};
