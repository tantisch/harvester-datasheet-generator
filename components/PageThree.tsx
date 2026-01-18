import React, { useRef, useState, useEffect } from 'react';
import { ImageUpload } from './ImageUpload';
import { ThemeType, GalleryImage } from '../types';
import { Move, GripHorizontal } from 'lucide-react';

interface GalleryPageProps {
  theme: ThemeType;
  pageIndex: number;
  images: GalleryImage[];
  onUpdateImage: (id: string, updates: Partial<GalleryImage>) => void;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDragOver: (e: React.DragEvent, id: string) => void;
  onDrop: (e: React.DragEvent, id: string) => void;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({ 
  theme, 
  pageIndex, 
  images, 
  onUpdateImage,
  onDragStart,
  onDragOver,
  onDrop
}) => {
  // --- Resizing Logic ---
  const [resizingId, setResizingId] = useState<string | null>(null);
  const startResizePos = useRef({ x: 0, y: 0, w: 0, h: 0 });

  const handleResizeStart = (e: React.MouseEvent, img: GalleryImage) => {
    e.preventDefault();
    e.stopPropagation();
    setResizingId(img.id);
    startResizePos.current = {
        x: e.clientX,
        y: e.clientY,
        w: img.width,
        h: img.height
    };
  };

  // --- Panning Logic ---
  const [panningId, setPanningId] = useState<string | null>(null);
  const startPanPos = useRef({ x: 0, y: 0, posX: 0, posY: 0 });

  const handlePanStart = (e: React.MouseEvent, img: GalleryImage) => {
    // Only pan if we aren't clicking the upload/change input (which is z-index 10)
    if ((e.target as HTMLElement).tagName === 'INPUT') return;
    
    e.preventDefault();
    setPanningId(img.id);
    startPanPos.current = {
        x: e.clientX,
        y: e.clientY,
        posX: img.posX,
        posY: img.posY
    };
  };

  // --- Zoom Logic ---
  const handleWheel = (e: React.WheelEvent, img: GalleryImage) => {
      e.stopPropagation();
      const delta = e.deltaY * -0.001;
      const newScale = Math.min(Math.max(img.scale + delta, 1), 3); // Limit scale 1x to 3x
      onUpdateImage(img.id, { scale: newScale });
  };

  // --- Global Mouse Events for Dragging ---
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
        if (resizingId) {
            const dx = e.clientX - startResizePos.current.x;
            const dy = e.clientY - startResizePos.current.y;
            
            // Calculate new percentage width
            const contentWidthPx = 700; // approx safe width
            const widthDeltaPercent = (dx / contentWidthPx) * 100;

            const newWidth = Math.min(Math.max(startResizePos.current.w + widthDeltaPercent, 20), 100);
            const newHeight = Math.min(Math.max(startResizePos.current.h + dy, 150), 800);

            onUpdateImage(resizingId, { width: newWidth, height: newHeight });
        }

        if (panningId) {
            const dx = e.clientX - startPanPos.current.x;
            const dy = e.clientY - startPanPos.current.y;
            const sensitivity = 0.2;

            const newPosX = Math.min(Math.max(startPanPos.current.posX - (dx * sensitivity), 0), 100);
            const newPosY = Math.min(Math.max(startPanPos.current.posY - (dy * sensitivity), 0), 100);

            onUpdateImage(panningId, { posX: newPosX, posY: newPosY });
        }
    };

    const handleMouseUp = () => {
        setResizingId(null);
        setPanningId(null);
    };

    if (resizingId || panningId) {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizingId, panningId, onUpdateImage]);


  return (
    <div className={`a4-page relative flex flex-col theme-${theme}`}>
       {/* Header - Matching Technical Specs Style */}
      <div className="px-8 pt-10 pb-6 flex items-center justify-between">
        <div>
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-1">Галерея</h2>
            <div className="w-16 h-1 bg-brand"></div>
        </div>
        <div className="text-right">
             <span className="text-xs font-mono text-gray-400">PAGE {0 + 3 + pageIndex}</span>
        </div>
      </div>

      {/* Dynamic Gallery Content - Fill remaining space completely */}
      <div className="flex flex-wrap content-start gap-y-4 px-6 py-4 flex-1">
        {images.map((img) => {
            return (
                 <div 
                    key={img.id} 
                    className="relative px-2 transition-all duration-75"
                    style={{ width: `${img.width}%`, height: `${img.height}px` }}
                    onDragOver={(e) => onDragOver(e, img.id)}
                    onDrop={(e) => onDrop(e, img.id)}
                 >
                    <div 
                        className={`w-full h-full relative group bg-gray-50 border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow ${panningId === img.id ? 'cursor-grabbing' : ''}`}
                        onMouseDown={(e) => handlePanStart(e, img)}
                        onWheel={(e) => handleWheel(e, img)}
                    >
                        <ImageUpload 
                            className="w-full h-full border-none" 
                            placeholder="Фото" 
                            aspectRatioClass="h-full w-full object-cover"
                            posX={img.posX}
                            posY={img.posY}
                            scale={img.scale}
                        />

                        {/* Drag Handle (Top Right) */}
                        <div 
                            className="absolute top-0 right-0 p-2 bg-white/80 cursor-move opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:bg-brand hover:text-white rounded-bl-lg no-print"
                            draggable
                            onMouseDown={(e) => e.stopPropagation()}
                            onDragStart={(e) => onDragStart(e, img.id)}
                            title="Drag to Reorder"
                        >
                            <Move size={16} />
                        </div>
                        
                        {/* Resize Handle (Bottom Right) */}
                        <div 
                            className="absolute bottom-0 right-0 w-6 h-6 bg-brand cursor-nwse opacity-0 group-hover:opacity-100 transition-opacity z-20 flex items-center justify-center text-white rounded-tl-lg no-print"
                            onMouseDown={(e) => handleResizeStart(e, img)}
                            title="Drag to Resize"
                        >
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 10L0 10L10 0V10Z" fill="white"/>
                            </svg>
                        </div>
                    </div>
                 </div>
            );
        })}
      </div>
    </div>
  );
};