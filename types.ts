export type ThemeType = 'sharp' | 'angle' | 'minimal';
export type BrandColor = 'forest' | 'yellow' | 'steel';

export interface HeroImageState {
  image: string | null;
  posX: number;
  posY: number;
  scale: number;
}

export interface GalleryImage {
  id: string;
  image: string | null; // base64 image data
  width: number; // percentage 20-100
  height: number; // pixels 200-800
  posX: number; // object-position x % (0-100)
  posY: number; // object-position y % (0-100)
  scale: number; // transform scale (1-3)
}

export interface SpecRow {
  label: string;
  value: string;
}

export interface SpecSection {
  id: string;
  title: string;
  rows: SpecRow[];
}

export interface PageOneText {
  seriesTitle: string;
  mainTitle: string;
  modelYear: string;
  introHeading: string;
  introText: string;
  feature1Title: string;
  feature1Text: string;
  feature2Title: string;
  feature2Text: string;
  feature3Title: string;
  feature3Text: string;
}

export interface PageTwoText {
  datasheet: string;
}

export interface AppState {
  theme: ThemeType;
  color: BrandColor;
  galleryImages: GalleryImage[];
  specs: SpecSection[];
  pageOneText: PageOneText;
  pageTwoText: PageTwoText;
}