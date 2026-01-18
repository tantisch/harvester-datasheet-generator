import React from 'react';
import { Settings, Download, Plus, Layout, Palette, Image, Trash2 } from 'lucide-react';
import { ThemeType, BrandColor, SpecSection } from '../types';

interface SidebarProps {
  theme: ThemeType;
  setTheme: (t: ThemeType) => void;
  color: BrandColor;
  setColor: (c: BrandColor) => void;
  galleryCount: number;
  setGalleryCount: (n: number) => void;
  specs: SpecSection[];
  onAddSection: () => void;
  onRemoveSection: (id: string) => void;
  onUpdateSectionTitle: (id: string, newTitle: string) => void;
  onDownload: () => void;
  isDownloading: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  theme, setTheme,
  color, setColor,
  galleryCount, setGalleryCount,
  specs,
  onAddSection,
  onRemoveSection,
  onUpdateSectionTitle,
  onDownload,
  isDownloading
}) => {
  return (
    <aside className="fixed left-0 top-0 bottom-0 w-72 bg-white border-r border-gray-200 p-6 z-50 overflow-y-auto shadow-2xl no-print flex flex-col">
      <div className="flex items-center gap-2 mb-8 text-gray-900">
        <Settings className="w-6 h-6" />
        <h2 className="text-xl font-bold font-sans">КОНСТРУКТОР</h2>
      </div>

      <div className="flex-1 space-y-8">
        {/* Theme Selection */}
        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Layout size={14} /> Тема
          </h3>
          <div className="space-y-2">
            {[
              { id: 'sharp', label: 'Sharp Tech' },
              { id: 'angle', label: 'Angle Bold' },
              { id: 'minimal', label: 'Minimalist' }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id as ThemeType)}
                className={`w-full text-left px-4 py-2 text-sm rounded-md border transition-all ${
                  theme === t.id 
                    ? 'border-brand bg-brand/5 text-brand font-bold' 
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Color Selection */}
        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Palette size={14} /> Колір
          </h3>
          <div className="flex gap-3">
            {[
              { id: 'forest', bg: '#1b4d3e', ring: 'ring-[#1b4d3e]' },
              { id: 'yellow', bg: '#eab308', ring: 'ring-[#eab308]' },
              { id: 'steel', bg: '#475569', ring: 'ring-[#475569]' }
            ].map((c) => (
              <button
                key={c.id}
                onClick={() => setColor(c.id as BrandColor)}
                className={`w-8 h-8 rounded-full shadow-sm transition-transform hover:scale-110 ${c.bg === '#eab308' ? 'border border-gray-300' : ''} ${
                  color === c.id ? `ring-2 ring-offset-2 ${c.ring}` : ''
                }`}
                style={{ backgroundColor: c.bg }}
              />
            ))}
          </div>
        </div>

        {/* Specs Management */}
        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Layout size={14} /> Секції Таблиці
          </h3>
          <div className="space-y-2 mb-3">
            {specs.map((spec) => (
              <div key={spec.id} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded border border-gray-100 group">
                <input 
                  type="text"
                  value={spec.title}
                  onChange={(e) => onUpdateSectionTitle(spec.id, e.target.value)}
                  className="bg-transparent border-b border-transparent focus:border-brand outline-none text-gray-700 w-32 font-medium"
                />
                <button 
                  onClick={() => onRemoveSection(spec.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1"
                  title="Remove Section"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={onAddSection}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white border border-dashed border-gray-300 text-gray-500 text-sm font-medium rounded hover:border-brand hover:text-brand transition-colors"
          >
            <Plus size={14} /> Додати Секцію
          </button>
        </div>

        {/* Gallery Settings */}
        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Image size={14} /> Галерея
          </h3>
          
          <div className="mb-4">
             <label className="text-xs text-gray-500 mb-1 block">Кількість фото: <span className="font-bold text-brand">{galleryCount}</span></label>
             <input 
              type="range" 
              min="0" 
              max="10" 
              value={galleryCount} 
              onChange={(e) => setGalleryCount(Number(e.target.value))}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand"
            />
          </div>
          <p className="text-[10px] text-gray-400">
             Наведіть на фото в галереї, щоб змінити його розмір.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="pt-6 border-t border-gray-100 mt-auto">
        <button
          onClick={onDownload}
          disabled={isDownloading}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-brand text-white font-bold rounded-lg shadow-lg hover:brightness-110 transition-all disabled:opacity-50"
        >
          {isDownloading ? (
            <span className="animate-pulse">Генерація...</span>
          ) : (
            <>
              <Download size={18} />
              Завантажити PDF
            </>
          )}
        </button>
      </div>
    </aside>
  );
};