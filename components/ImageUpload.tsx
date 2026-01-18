import React from 'react';
import { Upload, Image as ImageIcon, RefreshCcw, X } from 'lucide-react';

interface ImageUploadProps {
  image?: string | null; // Controlled: parent provides the image
  className?: string;
  placeholder?: string;
  aspectRatioClass?: string;
  posX?: number;
  posY?: number;
  scale?: number;
  onImageChange?: (imageData: string | null) => void; // Now passes actual image data
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ 
  image = null, // Controlled component
  className = '', 
  placeholder = 'Завантажити фото',
  aspectRatioClass = 'h-full w-full',
  posX = 50,
  posY = 50,
  scale = 1,
  onImageChange
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result as string;
        onImageChange?.(imageData); // Pass the actual base64 data to parent
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    onImageChange?.(null); // Clear the image
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
            {/* Image Controls - Change and Remove */}
            <div className="absolute top-2 left-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                 {/* Change Button */}
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
                 
                 {/* Remove Button */}
                 <button
                   onClick={handleRemove}
                   className="cursor-pointer bg-red-500/90 hover:bg-red-600 text-white p-1 rounded-sm shadow-sm flex items-center gap-1 text-[9px] font-bold uppercase backdrop-blur-sm transition-colors"
                 >
                    <X size={10} />
                    <span>Remove</span>
                 </button>
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