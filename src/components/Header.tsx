import React from 'react';
import { VersalLogo } from './VersalLogo';
import { Language } from '../types';
import { Camera, Layers, Sparkles } from 'lucide-react';

export type ViewMode = 'showcase' | 'manager';

interface HeaderProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  onOpenMenu: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  onOpenUploadModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  setViewMode,
  onOpenMenu,
  language,
  setLanguage,
  onOpenUploadModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#F5F2EB]/95 backdrop-blur-md border-b border-black/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Left: Versal Wordmark */}
        <button
          type="button"
          onClick={() => setViewMode('showcase')}
          className="focus:outline-none flex items-center gap-2 group text-left cursor-pointer"
        >
          <VersalLogo size="md" />
        </button>

        {/* Right Zone: Clean controls */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {/* Quick toggle between Showcase and Manager */}
          <div className="flex items-center bg-black/5 p-1 rounded-lg border border-black/10 text-xs font-mono">
            <button
              type="button"
              onClick={() => setViewMode('showcase')}
              className={`px-3 py-1.5 rounded-md transition-colors font-medium ${
                viewMode === 'showcase'
                  ? 'bg-black text-white shadow-sm font-bold'
                  : 'text-neutral-700 hover:text-black'
              }`}
            >
              {language === 'es' ? 'Showcase & Mapa' : 'Showcase & Map'}
            </button>
            <button
              type="button"
              onClick={() => setViewMode('manager')}
              className={`px-3 py-1.5 rounded-md transition-colors font-medium flex items-center gap-1.5 ${
                viewMode === 'manager'
                  ? 'bg-[#0015ff] text-white shadow-sm font-bold'
                  : 'text-neutral-700 hover:text-black'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{language === 'es' ? 'Gestor de Boletos' : 'Ticket Studio'}</span>
            </button>
          </div>

          {/* Quick upload CTA */}
          <button
            type="button"
            onClick={onOpenUploadModal}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0015ff] hover:bg-[#0022ff] text-white text-xs font-mono font-bold uppercase tracking-wider rounded-lg transition-all shadow-sm"
          >
            <Camera className="w-3.5 h-3.5 text-[#FACC15]" />
            <span>{language === 'es' ? 'Subir Foto' : 'Upload Card'}</span>
          </button>

          {/* Language Switcher ES / EN */}
          <div className="flex items-center bg-black/5 rounded-md p-0.5 text-xs font-mono">
            <button
              type="button"
              onClick={() => setLanguage('es')}
              className={`px-2 py-1 rounded transition-colors ${
                language === 'es' ? 'bg-black text-white font-bold' : 'text-neutral-600 hover:text-black'
              }`}
            >
              ES
            </button>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 rounded transition-colors ${
                language === 'en' ? 'bg-black text-white font-bold' : 'text-neutral-600 hover:text-black'
              }`}
            >
              EN
            </button>
          </div>

          {/* Hamburger Menu: 4 horizontal lines matching user screenshot */}
          <button
            type="button"
            onClick={onOpenMenu}
            aria-label="Abrir menú"
            className="p-2 sm:p-2.5 rounded-md hover:bg-black/5 transition-colors flex flex-col justify-center items-center gap-1 focus:outline-none cursor-pointer"
          >
            <span className="w-6 sm:w-7 h-[2px] bg-black block transition-all" />
            <span className="w-6 sm:w-7 h-[2px] bg-black block transition-all" />
            <span className="w-6 sm:w-7 h-[2px] bg-black block transition-all" />
            <span className="w-6 sm:w-7 h-[2px] bg-black block transition-all" />
          </button>
        </div>
      </div>
    </header>
  );
};
