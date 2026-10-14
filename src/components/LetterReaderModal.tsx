import React from 'react';
import { LoveLetter } from '../types';
import { X, Crown, Heart, Calendar, Printer, Sparkles } from 'lucide-react';

interface LetterReaderModalProps {
  letter: LoveLetter | null;
  isOpen: boolean;
  onClose: () => void;
}

export const LetterReaderModal: React.FC<LetterReaderModalProps> = ({
  letter,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !letter) return null;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-[#FFFDF9] text-[#1A1A1A] rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col border-4 border-rose-300/40">
        {/* Romantic Rose Gold Ribbon Border */}
        <div 
          className="w-full h-3.5"
          style={{
            background: 'repeating-linear-gradient(135deg, #E11D48 0, #E11D48 16px, #FFF1F2 16px, #FFF1F2 22px, #F59E0B 22px, #F59E0B 38px, #FFF1F2 38px, #FFF1F2 44px)',
          }}
        />

        {/* Action Bar */}
        <div className="px-6 py-3.5 bg-rose-50/70 border-b border-rose-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 fill-rose-600 text-rose-600 animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-rose-800">
              CARTA DE AMOR PARA MI NOVIO · PRINCIPE AIRLINES
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="p-1.5 hover:bg-rose-200/60 text-rose-800 rounded transition-colors cursor-pointer"
              title="Guardar o Imprimir Carta"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 hover:bg-rose-200/60 text-rose-800 rounded transition-colors cursor-pointer"
              title="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Paper Container */}
        <div className="p-6 sm:p-10 overflow-y-auto space-y-6 flex-1 bg-[#FFFDF9]">
          {/* Top Stamp & Date Banner */}
          <div className="flex items-start justify-between gap-4 border-b border-rose-200/60 pb-6">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-mono font-bold uppercase tracking-wider border border-rose-200">
                <Sparkles className="w-3.5 h-3.5" />
                <span>ESCRITA CON TODO MI CORAZÓN</span>
              </div>
              
              <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 pt-1">
                <Calendar className="w-3.5 h-3.5 text-rose-500" />
                <span>Fecha: <strong className="text-neutral-800">{formatDate(letter.date)}</strong></span>
              </div>

              {letter.specialSong && (
                <div className="text-[11px] font-mono text-rose-600 italic">
                  🎵 {letter.specialSong}
                </div>
              )}
            </div>

            {/* Regal King Crown & Heart Wax Seal */}
            <div className="relative w-16 h-22 bg-gradient-to-b from-rose-700 via-rose-800 to-rose-950 text-amber-300 border-2 border-amber-300/60 rounded p-2 flex flex-col items-center justify-between shadow-lg transform rotate-2">
              <div className="text-[7px] font-mono font-black text-amber-200 tracking-wider">
                PRINCIPE
              </div>
              <Crown className="w-7 h-7 text-amber-300 fill-amber-300/30 drop-shadow-sm" />
              <Heart className="w-4 h-4 fill-amber-300 text-amber-300" />
              <div className="text-[7px] font-mono font-bold text-amber-200">
                AMOR REAL
              </div>
            </div>
          </div>

          {/* Letter Title */}
          <div>
            <h1 className="font-display font-black text-2xl sm:text-4xl text-neutral-900 leading-tight">
              {letter.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs sm:text-sm font-mono border-l-2 border-rose-400 pl-3 py-1 bg-rose-50/50 rounded-r">
              <span>Para: <strong className="text-rose-700 font-bold">{letter.recipient}</strong></span>
              <span>De: <strong className="text-neutral-900 font-bold">{letter.sender}</strong></span>
            </div>
          </div>

          {/* Letter Body & Couple Photo Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start pt-2">
            <div className="md:col-span-2 space-y-6">
              <div className="text-base sm:text-lg leading-relaxed text-neutral-800 font-serif whitespace-pre-line text-pretty">
                {letter.content}
              </div>

              {/* Romantic Signature */}
              <div className="pt-6 border-t border-rose-200">
                <div className="font-script text-4xl sm:text-5xl text-rose-600 transform -rotate-2">
                  {letter.sender}
                </div>
                <div className="text-xs font-mono text-neutral-500 tracking-wider mt-1 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                  <span>Tu novia que te ama para siempre · Principe Airlines</span>
                </div>
              </div>
            </div>

            {/* Attached Couple Photo Styled as a Romantic Polaroid */}
            {letter.photoUrl && (
              <div className="md:col-span-1 bg-white p-3.5 rounded-lg shadow-xl border border-rose-200/80 transform rotate-2 hover:rotate-0 transition-transform">
                <div className="aspect-[4/5] bg-neutral-900 rounded-sm overflow-hidden">
                  <img
                    src={letter.photoUrl}
                    alt={letter.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center mt-3 font-script text-2xl text-rose-700">
                  Nosotros ❤️
                </div>
                <div className="text-center text-[10px] font-mono text-neutral-400 uppercase tracking-widest mt-0.5">
                  Recuerdo inolvidable
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
