import React from 'react';
import { HeroStickers } from './HeroStickers';
import { Language } from '../types';

interface HeroProps {
  onSelectProject?: (projectId: string) => void;
  language?: Language;
}

export const Hero: React.FC<HeroProps> = ({
  onSelectProject,
  language = 'es',
}) => {
  return (
    <section className="relative w-full min-h-[85vh] sm:min-h-[88vh] flex flex-col justify-center items-center px-4 sm:px-8 py-10 overflow-hidden bg-[#F5F2EB]">
      {/* Draggable interactive stickers matching Versal Design screenshots */}
      <HeroStickers onSelectProject={onSelectProject} language={language} />

      {/* The Iconic Hero Typographic Lockup (Screenshots 1 & 2) */}
      <div className="relative z-20 my-auto text-center select-none pointer-events-none px-4">
        {/* Top condensed uppercase editorial serif: "BORING IS BAD" */}
        <h1 className="font-display font-black text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-black tracking-tight uppercase leading-[0.85] text-balance">
          BORING IS BAD
        </h1>

        {/* Interlocking flowing cursive calligraphy: "For Business" in electric cobalt blue */}
        <div className="relative -mt-6 sm:-mt-10 md:-mt-14 lg:-mt-18">
          <span className="font-script text-7xl sm:text-8xl md:text-9xl lg:text-[11rem] text-[#0015ff] font-normal leading-none inline-block drop-shadow-[0_4px_12px_rgba(0,21,255,0.15)] transform -rotate-2">
            For Business
          </span>
        </div>

        {/* Studio Subtitle */}
        <p className="mt-4 sm:mt-6 font-mono text-xs sm:text-sm text-neutral-600 tracking-wider uppercase pointer-events-auto max-w-lg mx-auto">
          {language === 'es' 
            ? 'Estudio de Packaging, Branding & Lettering · Santiago, Chile' 
            : 'Packaging, Branding & Lettering Studio · Santiago, Chile'}
        </p>
      </div>
    </section>
  );
};
