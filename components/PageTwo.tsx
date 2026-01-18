import React from 'react';
import { Editable } from './Editable';
import { SpecSection, ThemeType, PageTwoText } from '../types';
import { Plus, Trash2 } from 'lucide-react';

interface PageProps {
  theme: ThemeType;
  specs: SpecSection[];
  onAddRow: (sectionId: string) => void;
  onRemoveRow: (sectionId: string, rowIndex: number) => void;
  onUpdateRow: (sectionId: string, rowIndex: number, field: 'label' | 'value', newValue: string) => void;
  onUpdateSectionTitle: (id: string, newTitle: string) => void;
  textContent: PageTwoText;
  onUpdateText: (field: keyof PageTwoText, value: string) => void;
}

export const PageTwo: React.FC<PageProps> = ({ 
  theme, 
  specs, 
  onAddRow, 
  onRemoveRow,
  onUpdateRow,
  onUpdateSectionTitle,
  textContent,
  onUpdateText
}) => {
  return (
    <div className={`a4-page relative flex flex-col p-10 theme-${theme}`}>
      {/* Header */}
      <div className="mb-10 flex items-center justify-between">
        <div>
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-1">Технічні Характеристики</h2>
            <div className="w-16 h-1 bg-brand"></div>
        </div>
        <div className="text-right">
             <Editable 
               initialValue={textContent.datasheet}
               onChange={(val) => onUpdateText('datasheet', val)}
               className="text-xs font-mono text-gray-400"
             />
        </div>
      </div>

      {/* Technical Blueprint Table Design */}
      <div className="flex-1 flex flex-col justify-center">
        <div className="w-full border-t-2 border-black">
            <table className="w-full border-collapse">
                <tbody>
                    {specs.map((section, sectionIdx) => (
                        <React.Fragment key={section.id}>
                            {section.rows.map((row, rowIdx) => {
                                const isFirstRow = rowIdx === 0;
                                return (
                                    <tr key={`${section.id}-${rowIdx}`} className="border-b border-gray-300 hover:bg-gray-50 transition-colors group relative">
                                        {/* Category Column - Merged */}
                                        {isFirstRow && (
                                            <td 
                                                className="py-4 px-4 font-bold text-black align-top w-[25%] border-r border-gray-300 uppercase tracking-wide text-xs bg-gray-100 relative"
                                                rowSpan={section.rows.length}
                                            >
                                                <Editable 
                                                  initialValue={section.title} 
                                                  onChange={(val) => onUpdateSectionTitle(section.id, val)}
                                                />
                                                
                                                {/* Add Row Button (Bottom of Section Label) */}
                                                <button 
                                                    onClick={() => onAddRow(section.id)}
                                                    className="absolute bottom-2 right-2 bg-brand text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity no-print hover:scale-110 z-10"
                                                    title="Add Row to Section"
                                                >
                                                    <Plus size={12} />
                                                </button>
                                            </td>
                                        )}
                                        
                                        {/* Parameter Name */}
                                        <td className="py-3 px-6 text-gray-600 font-medium w-[40%] border-r border-gray-200 text-sm relative">
                                            <Editable 
                                              initialValue={row.label}
                                              onChange={(val) => onUpdateRow(section.id, rowIndex, 'label', val)}
                                            />
                                        </td>
                                        
                                        {/* Parameter Value */}
                                        <td className="py-3 px-6 text-black font-mono font-semibold text-sm relative pr-10">
                                            <Editable 
                                              initialValue={row.value}
                                              onChange={(val) => onUpdateRow(section.id, rowIndex, 'value', val)}
                                            />
                                            
                                            {/* Remove Row Button */}
                                            {section.rows.length > 1 && (
                                                <button 
                                                    onClick={() => onRemoveRow(section.id, rowIdx)}
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all no-print"
                                                    title="Remove Row"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};