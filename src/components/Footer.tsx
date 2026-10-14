import React from 'react';
import { VersalLogo } from './VersalLogo';
import { ArrowUp, Instagram, Linkedin } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#FAF9F5] border-t border-black/10 pt-16 pb-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto flex flex-col justify-between">
        {/* Massive Brand Wordmark across bottom */}
        <div className="flex items-center justify-between pb-10 border-b border-black/10">
          <VersalLogo size="xl" />
          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Volver arriba"
            className="p-3 rounded-full border border-black/20 hover:bg-black hover:text-white transition-colors"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        </div>

        {/* Links & Studio Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 py-10 text-xs font-mono">
          <div>
            <div className="font-bold text-neutral-900 uppercase mb-2">Estudio</div>
            <p className="text-neutral-600 font-sans leading-relaxed">
              Versal es un estudio independiente de diseño de packaging, branding y lettering con sede en Santiago de Chile.
            </p>
          </div>

          <div>
            <div className="font-bold text-neutral-900 uppercase mb-2">Contacto</div>
            <div className="space-y-1 text-neutral-600">
              <div>maria@versaldesign.cl</div>
              <div>+56 9 8837 1103</div>
              <div>Santiago, Chile</div>
            </div>
          </div>

          <div>
            <div className="font-bold text-neutral-900 uppercase mb-2">Membresía</div>
            <p className="text-neutral-600 font-sans leading-relaxed">
              Estudio asociado a <strong>Chile Diseño</strong>. Nominados en Premios Chile Diseño 2024 en la categoría Rebranding.
            </p>
          </div>

          <div>
            <div className="font-bold text-neutral-900 uppercase mb-2">Redes & Portafolio</div>
            <div className="flex items-center gap-3 mt-1">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-neutral-700 hover:text-[#0015ff]">
                Instagram
              </a>
              <span className="text-neutral-300">/</span>
              <a href="https://behance.net" target="_blank" rel="noreferrer" className="text-neutral-700 hover:text-[#0015ff]">
                Behance
              </a>
              <span className="text-neutral-300">/</span>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-neutral-700 hover:text-[#0015ff]">
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-black/10 flex flex-wrap items-center justify-between text-[11px] font-mono text-neutral-500 gap-4">
          <div>© 2026 Versal Graphic Design Studio · Todos los derechos reservados.</div>
          <div className="text-neutral-400">"Boring is Bad for Business"</div>
        </div>
      </div>
    </footer>
  );
};
