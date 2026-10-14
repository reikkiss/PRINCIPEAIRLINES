import React from 'react';
import { ViewMode } from './Header';
import { Language } from '../types';
import { VersalLogo } from './VersalLogo';
import { X, ArrowRight, Instagram, Linkedin, Mail, Phone, MapPin, Camera, Layers, Map, Sparkles } from 'lucide-react';

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  language: Language;
  onOpenUploadModal: () => void;
  onScrollToSection: (sectionId: string) => void;
}

export const MenuDrawer: React.FC<MenuDrawerProps> = ({
  isOpen,
  onClose,
  viewMode,
  setViewMode,
  language,
  onOpenUploadModal,
  onScrollToSection,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-neutral-950 text-white flex flex-col justify-between p-6 sm:p-10 md:p-16 animate-fadeIn">
      {/* Top Bar of Drawer */}
      <div className="flex items-center justify-between border-b border-white/10 pb-6">
        <VersalLogo size="md" className="text-white" />

        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar menú"
          className="p-3 rounded-full hover:bg-white/10 transition-colors text-white focus:outline-none cursor-pointer"
        >
          <X className="w-8 h-8" />
        </button>
      </div>

      {/* Main Navigation Links */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 my-auto py-8">
        <div className="lg:col-span-8 space-y-4 sm:space-y-6">
          <nav className="flex flex-col space-y-4 font-display">
            <button
              type="button"
              onClick={() => {
                setViewMode('showcase');
                onClose();
                onScrollToSection('hero');
              }}
              className="group text-left flex items-baseline gap-4 hover:translate-x-3 transition-transform cursor-pointer"
            >
              <span className="font-mono text-xs sm:text-sm text-[#0015ff] font-bold">01</span>
              <span className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight group-hover:text-[#0015ff] transition-colors">
                {language === 'es' ? 'Versal Hero' : 'Versal Hero'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setViewMode('showcase');
                onClose();
                onScrollToSection('tickets-3d');
              }}
              className="group text-left flex items-baseline gap-4 hover:translate-x-3 transition-transform cursor-pointer"
            >
              <span className="font-mono text-xs sm:text-sm text-[#FACC15] font-bold">02</span>
              <span className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight group-hover:text-[#FACC15] transition-colors">
                {language === 'es' ? 'Carrusel de Boletos 3D' : '3D Ticket Cover Flow'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setViewMode('showcase');
                onClose();
                onScrollToSection('flight-map');
              }}
              className="group text-left flex items-baseline gap-4 hover:translate-x-3 transition-transform cursor-pointer"
            >
              <span className="font-mono text-xs sm:text-sm text-orange-500 font-bold">03</span>
              <span className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight group-hover:text-orange-500 transition-colors">
                {language === 'es' ? 'Mapa de Rutas Globales' : 'Global Flight Map'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setViewMode('showcase');
                onClose();
                onScrollToSection('future-destinations');
              }}
              className="group text-left flex items-baseline gap-4 hover:translate-x-3 transition-transform cursor-pointer"
            >
              <span className="font-mono text-xs sm:text-sm text-emerald-400 font-bold">04</span>
              <span className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight group-hover:text-emerald-400 transition-colors">
                {language === 'es' ? 'Destinos & Checkmarks' : 'Destinations & Checkmarks'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setViewMode('manager');
                onClose();
              }}
              className="group text-left flex items-baseline gap-4 hover:translate-x-3 transition-transform cursor-pointer"
            >
              <span className="font-mono text-xs sm:text-sm text-[#0015ff] font-bold">05</span>
              <span className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight group-hover:text-[#0015ff] transition-colors">
                {language === 'es' ? 'Gestor de Boletos (Carga & Edición)' : 'Ticket Manager & Uploads'}
              </span>
            </button>
          </nav>
        </div>

        {/* Right Details Column */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-6 text-sm font-mono text-neutral-400 border-l border-white/10 pl-6">
          <div>
            <div className="text-xs uppercase text-white font-bold tracking-widest mb-2">
              MANIFIESTO
            </div>
            <p className="text-neutral-300 font-sans text-sm leading-relaxed">
              "Boring is Bad for Business. Embrace the Unusual."
              Estudio independiente de Packaging, Branding y Lettering radicado en Santiago de Chile.
            </p>
          </div>

          <div>
            <div className="text-xs uppercase text-white font-bold tracking-widest mb-2">
              ACCIONES RÁPIDAS
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenUploadModal();
              }}
              className="w-full py-2.5 px-4 bg-[#0015ff] hover:bg-[#0022ff] text-white font-bold text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-2"
            >
              <Camera className="w-4 h-4 text-[#FACC15]" />
              <span>Subir Foto de Boleto</span>
            </button>
          </div>

          <div>
            <div className="text-xs uppercase text-white font-bold tracking-widest mb-2">
              CONTACTO
            </div>
            <div className="space-y-1 text-xs">
              <a href="mailto:maria@versaldesign.cl" className="hover:text-white flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#0015ff]" />
                <span>maria@versaldesign.cl</span>
              </a>
              <a href="tel:+56988371103" className="hover:text-white flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#0015ff]" />
                <span>+56 9 8837 1103</span>
              </a>
              <div className="flex items-center gap-2 text-neutral-500">
                <MapPin className="w-3.5 h-3.5" />
                <span>Santiago de Chile</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Drawer Footer */}
      <div className="border-t border-white/10 pt-6 flex flex-wrap items-center justify-between text-xs font-mono text-neutral-500 gap-4">
        <div>© 2026 Versal Graphic Design Studio · Santiago, Chile</div>
        <div className="flex items-center gap-4">
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-white">Instagram</a>
          <a href="https://behance.net" target="_blank" rel="noreferrer" className="hover:text-white">Behance</a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-white">LinkedIn</a>
        </div>
      </div>
    </div>
  );
};
