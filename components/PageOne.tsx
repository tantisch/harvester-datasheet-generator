import React, { useState, useRef, useEffect } from 'react';
import { Editable } from './Editable';
import { ImageUpload } from './ImageUpload';
import { ThemeType, HeroImageState, PageOneText } from '../types';

interface PageProps {
  theme: ThemeType;
  heroImage: HeroImageState;
  onUpdateHeroImage: (updates: Partial<HeroImageState>) => void;
  textContent: PageOneText;
  onUpdateText: (field: keyof PageOneText, value: string) => void;
}

export const PageOne: React.FC<PageProps> = ({ theme, heroImage, onUpdateHeroImage, textContent, onUpdateText }) => {
  // --- Resizing Logic ---
  const [isResizing, setIsResizing] = useState(false);
  const startResizePos = useRef({ x: 0, y: 0, w: 0, h: 0 });

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    startResizePos.current = {
        x: e.clientX,
        y: e.clientY,
        w: heroImage.width,
        h: heroImage.height
    };
  };

  // --- Panning & Zooming Logic for Hero Image ---
  const [isPanning, setIsPanning] = useState(false);
  const startPanPos = useRef({ x: 0, y: 0, posX: 0, posY: 0 });

  const handlePanStart = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).tagName === 'INPUT') return;
    e.preventDefault();
    setIsPanning(true);
    startPanPos.current = {
        x: e.clientX,
        y: e.clientY,
        posX: heroImage.posX,
        posY: heroImage.posY
    };
  };

  const handleWheel = (e: React.WheelEvent) => {
      e.stopPropagation();
      const delta = e.deltaY * -0.001;
      const newScale = Math.min(Math.max(heroImage.scale + delta, 1), 3);
      onUpdateHeroImage({ scale: newScale });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
        if (isResizing) {
            const dx = e.clientX - startResizePos.current.x;
            const dy = e.clientY - startResizePos.current.y;
            
            // Calculate new percentage width
            const contentWidthPx = 650; // approx safe width for hero
            const widthDeltaPercent = (dx / contentWidthPx) * 100;

            const newWidth = Math.min(Math.max(startResizePos.current.w + widthDeltaPercent, 50), 100);
            const newHeight = Math.min(Math.max(startResizePos.current.h + dy, 200), 600);

            onUpdateHeroImage({ width: newWidth, height: newHeight });
        }

        if (isPanning) {
            const dx = e.clientX - startPanPos.current.x;
            const dy = e.clientY - startPanPos.current.y;
            const sensitivity = 0.2;
            const newPosX = Math.min(Math.max(startPanPos.current.posX - (dx * sensitivity), 0), 100);
            const newPosY = Math.min(Math.max(startPanPos.current.posY - (dy * sensitivity), 0), 100);
            onUpdateHeroImage({ posX: newPosX, posY: newPosY });
        }
    };

    const handleMouseUp = () => {
        setIsResizing(false);
        setIsPanning(false);
    };

    if (isResizing || isPanning) {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, isPanning, onUpdateHeroImage]);


  return (
    <div className={`a4-page relative flex flex-col theme-${theme}`}>
      {/* Top Header - Minimal & Clean */}
      <div className="px-12 pt-12 pb-6 flex justify-between items-end border-b border-gray-100">
         <div>
            <Editable 
              initialValue={textContent.seriesTitle}
              onChange={(val) => onUpdateText('seriesTitle', val)}
              className="text-sm font-mono tracking-[0.3em] text-gray-400 uppercase mb-1"
            />
            <Editable 
              initialValue={textContent.mainTitle}
              onChange={(val) => onUpdateText('mainTitle', val)}
              tag="h1" 
              className="text-4xl font-black tracking-tight uppercase font-sans leading-none text-gray-900"
            />
         </div>
         <div className="flex flex-col items-end">
             <div className="h-2 w-12 bg-brand mb-2"></div>
             <Editable 
               initialValue={textContent.modelYear}
               onChange={(val) => onUpdateText('modelYear', val)}
               className="text-xs font-bold text-gray-900"
             />
         </div>
      </div>

      {/* Main Content Area - Centered Vertically */}
      <div className="flex-1 flex flex-col justify-center px-12 py-8 gap-8">
        
        {/* Cinematic Hero Image (Resizable) */}
        <div 
            className="relative mx-auto"
            style={{ width: `${heroImage.width}%` }}
        >
          <div 
            className={`relative shadow-sm group overflow-hidden ${isPanning ? 'cursor-grabbing' : 'cursor-default'}`}
            style={{ height: `${heroImage.height}px` }}
            onMouseDown={handlePanStart}
            onWheel={handleWheel}
          >
            <ImageUpload 
                image={heroImage.image}
                className="w-full h-full bg-gray-50 border-none" 
                placeholder="Завантажити фото (Широкий формат)" 
                posX={heroImage.posX}
                posY={heroImage.posY}
                scale={heroImage.scale}
                onImageChange={(imageData) => onUpdateHeroImage({ image: imageData })}
            />
            
            {/* Hint Overlay */}
            <div className="absolute top-2 left-2 pointer-events-none opacity-0 group-hover:opacity-60 text-[9px] font-mono bg-white px-1 text-black z-20">
                 DRAG TO PAN | SCROLL TO ZOOM | DRAG CORNER TO RESIZE
            </div>

            {/* Resize Handle */}
            <div 
                className="absolute bottom-0 right-0 w-4 h-4 bg-brand/80 cursor-nwse-resize opacity-0 group-hover:opacity-100 transition-opacity z-30 no-print flex items-center justify-center"
                onMouseDown={handleResizeStart}
                title="Drag to Resize"
            >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 0L10 10L0 10" stroke="white" strokeWidth="1.5"/>
                </svg>
            </div>

            {/* Technical decoration lines */}
            <div className="absolute -left-2 top-0 bottom-0 border-l border-gray-200 flex flex-col justify-between py-2 pl-1 pointer-events-none">
                <span className="w-1 h-px bg-gray-300"></span>
                <span className="w-1 h-px bg-gray-300"></span>
            </div>
            <div className="absolute -right-2 top-0 bottom-0 border-r border-gray-200 flex flex-col justify-between py-2 pr-1 pointer-events-none">
                <span className="w-1 h-px bg-gray-300"></span>
                <span className="w-1 h-px bg-gray-300"></span>
            </div>
          </div>
        </div>

        {/* Introduction Text */}
        <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide border-b-2 border-brand inline-block pb-1">
                <Editable 
                  initialValue={textContent.introHeading}
                  onChange={(val) => onUpdateText('introHeading', val)}
                />
            </h2>
            <Editable 
                initialValue={textContent.introText}
                onChange={(val) => onUpdateText('introText', val)}
                className="text-lg text-gray-600 leading-relaxed font-light"
            />
            
            {/* Highlights / Bullets */}
            <div className="grid grid-cols-3 gap-8 mt-10 text-left border-t border-gray-100 pt-6">
                <div>
                     <Editable 
                       initialValue={textContent.feature1Title}
                       onChange={(val) => onUpdateText('feature1Title', val)}
                       className="font-bold text-xs text-brand mb-2 uppercase"
                     />
                     <Editable 
                       initialValue={textContent.feature1Text}
                       onChange={(val) => onUpdateText('feature1Text', val)}
                       className="text-sm text-gray-500"
                     />
                </div>
                <div>
                     <Editable 
                       initialValue={textContent.feature2Title}
                       onChange={(val) => onUpdateText('feature2Title', val)}
                       className="font-bold text-xs text-brand mb-2 uppercase"
                     />
                     <Editable 
                       initialValue={textContent.feature2Text}
                       onChange={(val) => onUpdateText('feature2Text', val)}
                       className="text-sm text-gray-500"
                     />
                </div>
                <div>
                     <Editable 
                       initialValue={textContent.feature3Title}
                       onChange={(val) => onUpdateText('feature3Title', val)}
                       className="font-bold text-xs text-brand mb-2 uppercase"
                     />
                     <Editable 
                       initialValue={textContent.feature3Text}
                       onChange={(val) => onUpdateText('feature3Text', val)}
                       className="text-sm text-gray-500"
                     />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};