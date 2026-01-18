import React, { useState, useRef, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { PageOne } from './components/PageOne';
import { PageTwo } from './components/PageTwo';
import { GalleryPage } from './components/PageThree';
import { ThemeType, BrandColor, SpecSection, GalleryImage, HeroImageState, PageOneText, PageTwoText } from './types';

// LocalStorage key for auto-save
const STORAGE_KEY = 'harvester-datasheet-data';

// Default Text Content
const DEFAULT_PAGE_ONE_TEXT: PageOneText = {
  seriesTitle: 'X-2000 SERIES',
  mainTitle: 'INDUSTRIAL HARVESTER',
  modelYear: 'MODEL YEAR 2025',
  introHeading: 'Вступ',
  introText: 'Ця машина являє собою вершину інженерної думки в галузі лісозаготівлі. Розроблена для забезпечення максимальної ефективності та надійності, вона поєднує в собі потужність передових технологій та ергономіку нового покоління. Ідеальне рішення для найскладніших завдань.',
  feature1Title: 'ЕФЕКТИВНІСТЬ',
  feature1Text: 'Зниження витрат палива на 15% завдяки новій гідравліці.',
  feature2Title: 'НАДІЙНІСТЬ',
  feature2Text: 'Посилена рама та компоненти для роботи 24/7.',
  feature3Title: 'КОМФОРТ',
  feature3Text: 'Кабіна з оглядом 360° та системою клімат-контролю.'
};

const DEFAULT_PAGE_TWO_TEXT: PageTwoText = {
  datasheet: 'DATASHEET 2.0'
};

// Default Data
const DEFAULT_SPECS: SpecSection[] = [
  {
    id: 'dims',
    title: 'Габарити',
    rows: [
        { label: 'Ширина', value: '2980 мм' },
        { label: 'Висота', value: '3850 мм' },
        { label: 'Довжина', value: '8200 мм' },
        { label: 'Вага', value: '18500 кг' }
    ]
  },
  {
    id: 'engine',
    title: 'Двигун',
    rows: [
        { label: 'Модель', value: 'AgroPower X6' },
        { label: 'Потужність', value: '280 к.с.' },
        { label: 'Крутний момент', value: '1200 Нм' },
        { label: 'Екологічний клас', value: 'Stage V' },
        { label: 'Об\'єм баку', value: '400 л' }
    ]
  },
  {
    id: 'crane',
    title: 'Кран',
    rows: [
        { label: 'Виліт стріли', value: '10.5 м' },
        { label: 'Вантажопідйомність', value: '180 kNm' },
        { label: 'Кут повороту', value: '280°' }
    ]
  },
  {
    id: 'head',
    title: 'Головка',
    rows: [
        { label: 'Модель', value: 'CutMaster 5000' },
        { label: 'Діаметр зрізу', value: '750 мм' },
        { label: 'Швидкість', value: '6 м/с' },
        { label: 'Пильна шина', value: '900 мм' }
    ]
  },
  {
      id: 'other',
      title: 'Шасі',
      rows: [
          { label: 'Кліренс', value: '700 мм' },
          { label: 'Тягове зусилля', value: '195 кН' },
          { label: 'Колеса', value: '26.5-20' }
      ]
  }
];

const App: React.FC = () => {
  // Load saved data from localStorage ONCE
  const getSavedData = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        console.log('📦 Loaded saved data from localStorage:', data);
        return data;
      }
    } catch (error) {
      console.error('❌ Error loading saved data:', error);
    }
    console.log('📝 No saved data found, using defaults');
    return {};
  };

  // Load saved data once
  const savedData = getSavedData();

  const [theme, setTheme] = useState<ThemeType>(savedData.theme || 'sharp');
  const [color, setColor] = useState<BrandColor>(savedData.color || 'forest');
  const [specs, setSpecs] = useState<SpecSection[]>(savedData.specs || DEFAULT_SPECS);
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Page 1 Hero Image State
  const [heroImage, setHeroImage] = useState<HeroImageState>(savedData.heroImage || {
      image: null,
      posX: 50,
      posY: 50,
      scale: 1
  });

  // Gallery State
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>(
      savedData.galleryImages || Array.from({ length: 4 }).map((_, i) => ({ 
          id: `img-${i}`,
          image: null,
          width: 50, 
          height: 300,
          posX: 50,
          posY: 50,
          scale: 1
      }))
  );

  // Text Content State
  const [pageOneText, setPageOneText] = useState<PageOneText>(savedData.pageOneText || DEFAULT_PAGE_ONE_TEXT);
  const [pageTwoText, setPageTwoText] = useState<PageTwoText>(savedData.pageTwoText || DEFAULT_PAGE_TWO_TEXT);
  
  const contentRef = useRef<HTMLDivElement>(null);

  // Text update handlers
  const handleUpdatePageOneText = (field: keyof PageOneText, value: string) => {
    setPageOneText(prev => ({ ...prev, [field]: value }));
  };

  const handleUpdatePageTwoText = (field: keyof PageTwoText, value: string) => {
    setPageTwoText(prev => ({ ...prev, [field]: value }));
  };

  // Auto-save to localStorage whenever data changes
  useEffect(() => {
    try {
      const dataToSave = {
        theme,
        color,
        specs,
        heroImage,
        galleryImages,
        pageOneText,
        pageTwoText
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
      console.log('✅ Auto-saved to localStorage:', { 
        theme, 
        color, 
        specsCount: specs.length,
        heroImageLoaded: !!heroImage.image,
        galleryImagesCount: galleryImages.length,
        textFieldsSaved: true
      });
    } catch (error) {
      console.error('❌ Error saving data:', error);
    }
  }, [theme, color, specs, heroImage, galleryImages, pageOneText, pageTwoText]);

  // --- Handlers ---

  const handleUpdateHeroImage = (updates: Partial<HeroImageState>) => {
      setHeroImage(prev => ({ ...prev, ...updates }));
  };

  const handleUpdateSectionTitle = (id: string, newTitle: string) => {
    setSpecs(prev => prev.map(s => s.id === id ? { ...s, title: newTitle } : s));
  };

  const handleGalleryCountChange = (count: number) => {
      setGalleryImages(prev => {
          if (count > prev.length) {
              const newImages = Array.from({ length: count - prev.length }).map((_, i) => ({
                  id: `img-${Date.now()}-${i}`,
                  image: null,
                  width: 50,
                  height: 300,
                  posX: 50,
                  posY: 50,
                  scale: 1
              }));
              return [...prev, ...newImages];
          } else {
              return prev.slice(0, count);
          }
      });
  };

  const handleUpdateImage = (id: string, updates: Partial<GalleryImage>) => {
      setGalleryImages(prev => prev.map(img => img.id === id ? { ...img, ...updates } : img));
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
      e.dataTransfer.setData('text/plain', id);
      e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
      e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
      e.preventDefault();
      const sourceId = e.dataTransfer.getData('text/plain');
      if (sourceId === targetId) return;

      const sourceIndex = galleryImages.findIndex(img => img.id === sourceId);
      const targetIndex = galleryImages.findIndex(img => img.id === targetId);

      if (sourceIndex === -1 || targetIndex === -1) return;

      const newImages = [...galleryImages];
      const [movedImage] = newImages.splice(sourceIndex, 1);
      newImages.splice(targetIndex, 0, movedImage);
      setGalleryImages(newImages);
  };

  const handleAddSection = () => {
    const newId = `custom-${Date.now()}`;
    setSpecs([...specs, { id: newId, title: 'Нова Секція', rows: [{ label: 'Параметр', value: 'Значення' }] }]);
  };

  const handleRemoveSection = (id: string) => {
    setSpecs(specs.filter(s => s.id !== id));
  };

  // Row Management Handlers
  const handleAddRow = (sectionId: string) => {
    setSpecs(prevSpecs => prevSpecs.map(section => {
        if (section.id === sectionId) {
            return {
                ...section,
                rows: [...section.rows, { label: 'Новий', value: '-' }]
            };
        }
        return section;
    }));
  };

  const handleRemoveRow = (sectionId: string, rowIndex: number) => {
    setSpecs(prevSpecs => prevSpecs.map(section => {
        if (section.id === sectionId) {
            const newRows = [...section.rows];
            newRows.splice(rowIndex, 1);
            return { ...section, rows: newRows };
        }
        return section;
    }));
  };

  const handleUpdateRow = (sectionId: string, rowIndex: number, field: 'label' | 'value', newValue: string) => {
    setSpecs(prevSpecs => prevSpecs.map(section => {
        if (section.id === sectionId) {
            const newRows = [...section.rows];
            newRows[rowIndex] = { ...newRows[rowIndex], [field]: newValue };
            return { ...section, rows: newRows };
        }
        return section;
    }));
  };

  const getCSSVariables = () => {
    switch (color) {
      case 'forest': return { '--brand-color': '#1b4d3e', '--brand-color-dark': '#123329' } as React.CSSProperties;
      case 'yellow': return { '--brand-color': '#eab308', '--brand-color-dark': '#a16207' } as React.CSSProperties;
      case 'steel': return { '--brand-color': '#475569', '--brand-color-dark': '#1e293b' } as React.CSSProperties;
      default: return {};
    }
  };

  // --- RESET HANDLER ---
  const handleReset = () => {
    if (confirm('Ви впевнені? Це видалить всі зміни та відновить значення за замовчуванням.')) {
      // Clear localStorage
      localStorage.removeItem(STORAGE_KEY);
      console.log('🗑️ Cleared localStorage');
      
      // Reset all state to defaults
      setTheme('sharp');
      setColor('forest');
      setSpecs(DEFAULT_SPECS);
      setHeroImage({
        image: null,
        posX: 50,
        posY: 50,
        scale: 1
      });
      setGalleryImages(
        Array.from({ length: 4 }).map((_, i) => ({ 
          id: `img-${i}`,
          image: null,
          width: 50, 
          height: 300,
          posX: 50,
          posY: 50,
          scale: 1
        }))
      );
      setPageOneText(DEFAULT_PAGE_ONE_TEXT);
      setPageTwoText(DEFAULT_PAGE_TWO_TEXT);
      console.log('🔄 Reset all state to defaults');
    }
  };

  // --- PDF GENERATION - Server-side with Puppeteer ---
  const handleDownloadPDF = async () => {
    const container = document.getElementById('datasheet-container');
    if (!container) return;
    
    setIsDownloading(true);

    try {
      // Get the HTML content
      const html = container.innerHTML;
      
      // Get CSS variables
      const brandColor = getCSSVariables()['--brand-color'];
      const brandColorDark = getCSSVariables()['--brand-color-dark'];
      
      // Inject CSS variables into HTML
      const styledHTML = `
        <div style="--brand-color: ${brandColor}; --brand-color-dark: ${brandColorDark};">
          ${html}
        </div>
      `;

      // Use environment variable for API URL (production) or localhost (development)
      const API_URL = import.meta.env.VITE_PDF_SERVER_URL || 'http://localhost:3001';

      // Send to server
      const response = await fetch(`${API_URL}/generate-pdf`, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: styledHTML
      });

      if (!response.ok) {
        throw new Error('Server returned: ' + response.status);
      }

      // Download the PDF
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Harvester_Datasheet.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('PDF Error:', error);
      alert('PDF Server Error: Make sure the server is running.\n\nRun in terminal:\n  npm install express puppeteer cors\n  node pdf-server.js');
    } finally {
      setIsDownloading(false);
    }
  };

  // --- Smart Pagination Logic ---

  const renderGalleryPages = () => {
    const MAX_PAGE_HEIGHT = 980; // Increased to allow photos closer to bottom
    
    const pages: GalleryImage[][] = [];
    let currentPage: GalleryImage[] = [];
    let currentPageHeight = 0;
    
    let currentRowImages: GalleryImage[] = [];
    let currentRowWidth = 0;
    let currentRowHeight = 0;

    const flushRow = () => {
        if (currentRowImages.length === 0) return;
        
        if (currentPageHeight + currentRowHeight > MAX_PAGE_HEIGHT) {
            pages.push(currentPage);
            currentPage = [];
            currentPageHeight = 0;
        }
        
        currentPage.push(...currentRowImages);
        currentPageHeight += currentRowHeight + 16; 
        
        currentRowImages = [];
        currentRowWidth = 0;
        currentRowHeight = 0;
    };

    galleryImages.forEach((img) => {
        if (currentRowWidth + img.width <= 101) {
            currentRowImages.push(img);
            currentRowWidth += img.width;
            currentRowHeight = Math.max(currentRowHeight, img.height);
        } else {
            flushRow();
            currentRowImages.push(img);
            currentRowWidth = img.width;
            currentRowHeight = img.height;
        }
    });

    flushRow();

    if (currentPage.length > 0) {
        pages.push(currentPage);
    }

    return pages.map((pageImages, idx) => (
        <GalleryPage 
            key={`gallery-page-${idx}`}
            theme={theme}
            pageIndex={idx}
            images={pageImages}
            onUpdateImage={handleUpdateImage}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        />
    ));
  };

  return (
    <div className="min-h-screen font-sans text-gray-800" style={getCSSVariables()}>
      <Sidebar 
        theme={theme} setTheme={setTheme}
        color={color} setColor={setColor}
        galleryCount={galleryImages.length} setGalleryCount={handleGalleryCountChange}
        specs={specs}
        onAddSection={handleAddSection}
        onRemoveSection={handleRemoveSection}
        onUpdateSectionTitle={handleUpdateSectionTitle}
        onDownload={handleDownloadPDF}
        onReset={handleReset}
        isDownloading={isDownloading}
      />

      {/* Main Content Area */}
      <main className="pl-72 py-8 min-h-screen bg-gray-100/50 flex flex-col items-center justify-start overflow-auto">
        
        {/* Printable Container */}
        <div ref={contentRef} id="datasheet-container">
            <PageOne 
              theme={theme} 
              heroImage={heroImage}
              onUpdateHeroImage={handleUpdateHeroImage}
              textContent={pageOneText}
              onUpdateText={handleUpdatePageOneText}
            />
            <PageTwo 
                theme={theme} 
                specs={specs} 
                onAddRow={handleAddRow}
                onRemoveRow={handleRemoveRow}
                onUpdateRow={handleUpdateRow}
                onUpdateSectionTitle={handleUpdateSectionTitle}
                textContent={pageTwoText}
                onUpdateText={handleUpdatePageTwoText}
            />
            {galleryImages.length > 0 && renderGalleryPages()}
        </div>
        
        <div className="text-gray-400 text-xs mt-4 no-print mb-8">
            Scroll to view all generated pages.
        </div>
      </main>
    </div>
  );
};

export default App;