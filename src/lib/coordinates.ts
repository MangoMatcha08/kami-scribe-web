import { Canvas as FabricCanvas } from 'fabric';

// Standard coordinate system for PDF annotations
export interface PDFCoordinates {
  x: number;      // 0 to pageWidth in PDF units
  y: number;      // 0 to pageHeight in PDF units
  width: number;  // in PDF units
  height: number; // in PDF units
  pageNumber: number;
}

// Viewport coordinates (from mouse events)
export interface ViewportCoordinates {
  x: number;  // relative to viewport
  y: number;  // relative to viewport
}

// Canvas coordinates (Fabric.js)
export interface CanvasCoordinates {
  x: number;
  y: number;
  width?: number;
  height?: number;
}

/**
 * Transforms viewport coordinates to canvas coordinates
 * @param viewportCoords Mouse event coordinates relative to viewport
 * @param pageElement The PDF page container element
 * @param scale Current PDF scale
 * @returns Coordinates in canvas space
 */
export function viewportToCanvasCoords(
  viewportCoords: ViewportCoordinates,
  pageElement: HTMLElement,
  scale: number
): CanvasCoordinates {
  const rect = pageElement.getBoundingClientRect();
  
  // Calculate position relative to the page element
  const x = (viewportCoords.x - rect.left) / scale;
  const y = (viewportCoords.y - rect.top) / scale;
  
  return { x, y };
}

/**
 * Transforms canvas coordinates to PDF coordinates
 * @param canvasCoords Coordinates in canvas space
 * @param canvas Fabric.js canvas instance
 * @param scale Current PDF scale
 * @param pageNumber Current page number
 * @returns Coordinates in PDF space
 */
export function canvasToPDFCoords(
  canvasCoords: CanvasCoordinates,
  canvas: FabricCanvas,
  scale: number,
  pageNumber: number
): PDFCoordinates {
  // Get the canvas zoom level
  const zoom = canvas.getZoom();
  // Only use zoom, not scale
  const x = canvasCoords.x / zoom;
  const y = canvasCoords.y / zoom;
  const width = (canvasCoords.width || 0) / zoom;
  const height = (canvasCoords.height || 0) / zoom;
  return {
    x,
    y,
    width,
    height,
    pageNumber
  };
}

/**
 * Transforms PDF coordinates to canvas coordinates
 * @param pdfCoords Coordinates in PDF space
 * @param canvas Fabric.js canvas instance
 * @param scale Current PDF scale
 * @returns Coordinates in canvas space
 */
export function pdfToCanvasCoords(
  pdfCoords: PDFCoordinates,
  canvas: FabricCanvas,
  scale: number
): CanvasCoordinates {
  const zoom = canvas.getZoom();
  // Only use zoom, not scale
  const x = pdfCoords.x * zoom;
  const y = pdfCoords.y * zoom;
  const width = pdfCoords.width * zoom;
  const height = pdfCoords.height * zoom;
  return { x, y, width, height };
}

/**
 * Gets the current mouse position relative to the viewport
 * @param event Mouse event
 * @returns Viewport coordinates
 */
export function getViewportCoords(event: MouseEvent): ViewportCoordinates {
  return {
    x: event.clientX,
    y: event.clientY
  };
}

/**
 * Gets the current mouse position relative to the PDF page
 * @param event Mouse event
 * @param pageElement The PDF page container element
 * @param scale Current PDF scale
 * @returns PDF coordinates
 */
export function getPDFCoords(
  event: MouseEvent,
  pageElement: HTMLElement,
  scale: number
): PDFCoordinates {
  const viewportCoords = getViewportCoords(event);
  const canvasCoords = viewportToCanvasCoords(viewportCoords, pageElement, scale);
  // Note: This is a simplified version that assumes the canvas is at 1:1 scale
  // In practice, you'd need to pass the canvas instance and page number
  return {
    x: canvasCoords.x,
    y: canvasCoords.y,
    width: 0,
    height: 0,
    pageNumber: 0 // This should be set by the caller
  };
} 