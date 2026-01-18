import React, { useState } from 'react';
import { Upload, Image as ImageIcon, RefreshCcw } from 'lucide-react';

interface ImageUploadProps {
  className?: string;
  placeholder?: string;
  aspectRatioClass?: string;
  posX?: number;
  posY?: number;
  scale?: number;
  onImageChange?: (hasImage: boolean) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ 
  className = '', 
  placeholder = 'Завантажити фото',
  aspectRatioClass = 'h-full w-full',
  posX = 50,
  posY = 50,
  scale = 1,
  onImageChange
}) => {
  const [image, setImage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        onImageChange?.(true);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={`relative group overflow-hidden bg-gray-50 border border-gray-100 transition-colors ${className}`}>
      {image ? (
        <>
            <img 
              src={image} 
              alt="Uploaded" 
              className={`object-cover ${aspectRatioClass} pointer-events-none select-none`}
              style={{
                objectPosition: `${posX}% ${posY}%`,
                transform: `scale(${scale})`,
                transformOrigin: 'center center'
              }} 
            />
            {/* Discrete Upload/Change Button - Minimalist */}
            <div className="absolute top-2 left-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity">
                 <label className="cursor-pointer bg-white/90 hover:bg-white hover:text-brand text-gray-500 p-1 rounded-sm shadow-sm flex items-center gap-1 text-[9px] font-bold uppercase backdrop-blur-sm transition-colors">
                    <RefreshCcw size={10} />
                    <span>Change</span>
                    <input 
                       type="file" 
                       accept="image/*" 
                       className="hidden" 
                       onChange={handleFileChange}
                       title="" 
                     />
                 </label>
            </div>
        </>
      ) : (
        <>
            <div className="flex flex-col items-center justify-center h-full text-gray-400 pointer-events-none select-none">
              <ImageIcon className="w-8 h-8 mb-2 opacity-20" />
              <span className="text-[10px] font-medium uppercase tracking-wider text-gray-300">{placeholder}</span>
            </div>
            
            {/* Full Click Area for Initial Upload */}
            <label className="absolute inset-0 cursor-pointer flex items-center justify-center z-10 hover:bg-black/5 transition-colors">
               <input 
                 type="file" 
                 accept="image/*" 
                 className="hidden" 
                 onChange={handleFileChange}
                 title="" 
               />
            </label>
        </>
      )}
    </div>
  );
};