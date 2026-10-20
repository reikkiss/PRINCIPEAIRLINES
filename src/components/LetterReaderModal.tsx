import React from 'react';
import { LoveLetter } from '../types';
import { AppleMusicPlayer } from './AppleMusicPlayer';
import { X, Crown, Heart, Calendar, Printer, Sparkles, Music } from 'lucide-react';

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

  const getPaperTheme = (style?: string) => {
    switch (style) {
      case 'linen':
        return {
          bg: 'bg-[#FDFCF7]',
          text: 'text-[#1A1A1A]',
          border: 'border-[#E5E0D5]',
          badgeBg: 'bg-[#F0ECE1]',
          badgeText: 'text-[#554D40]',
          accent: 'text-[#333333]',
          barStyle: 'bg-gradient-to-r from-neutral-300 via-neutral-400 to-neutral-300',
        };
      case 'parchment':
        return {
          bg: 'bg-[#F4EBD9]',
          text: 'text-[#3D2C1E]',
          border: 'border-[#D9C7AB]',
          badgeBg: 'bg-[#E2D2B5]',
          badgeText: 'text-[#614932]',
          accent: 'text-[#8C6239]',
          barStyle: 'bg-gradient-to-r from-amber-700 via-yellow-600 to-amber-800',
        };
      case 'airmail':
        return {
          bg: 'bg-[#F0F4F8]',
          text: 'text-[#102A43]',
          border: 'border-[#BCCCDC]',
          badgeBg: 'bg-[#D9E2EC]',
          badgeText: 'text-[#243B53]',
          accent: 'text-[#1D4ED8]',
          barStyle: 'pattern-stripes-terracotta bg-blue-600',
        };
      case 'kraft':
        return {
          bg: 'bg-[#E8DCC4]',
          text: 'text-[#2C2215]',
          border: 'border-[#C8B696]',
          badgeBg: 'bg-[#D2C2A2]',
          badgeText: 'text-[#4A3B28]',
          accent: 'text-[#9A5B13]',
          barStyle: 'bg-gradient-to-r from-amber-900 via-amber-700 to-amber-900',
        };
      case 'rose':
      default:
        return {
          bg: 'bg-[#FAF6EE]',
          text: 'text-[#121212]',
          border: 'border-[#EADFCB]',
          badgeBg: 'bg-[#FFF0EB]',
          badgeText: 'text-[#E05A36]',
          accent: 'text-[#E05A36]',
          barStyle: 'pattern-stripes-terracotta',
        };
    }
  };

  const paper = getPaperTheme(letter.paperStyle);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn select-none">
      <div className={`relative w-full max-w-3xl ${paper.bg} ${paper.text} shape-arch shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col border-4 border-white transition-colors duration-300`}>
        {/* Top Decorative Stripe Pattern based on paper style */}
        <div className={`w-full h-4 ${paper.barStyle} border-b border-black/10`} />

        {/* Action Bar */}
        <div className={`px-6 py-3.5 ${paper.badgeBg} border-b ${paper.border} flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            <Heart className={`w-4 h-4 fill-current ${paper.badgeText} animate-pulse`} />
            <span className={`text-xs font-mono font-bold uppercase tracking-widest ${paper.text}`}>
              CARTA DE AMOR PARA MI NOVIO · PRINCIPE AIRLINES ({letter.paperStyle?.toUpperCase() || 'ROSE'})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className={`p-1.5 hover:bg-black/10 ${paper.badgeText} rounded-full transition-colors cursor-pointer`}
              title="Guardar o Imprimir Carta"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className={`p-1.5 hover:bg-black/10 ${paper.text} rounded-full transition-colors cursor-pointer`}
              title="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Paper Container */}
        <div className={`p-6 sm:p-10 overflow-y-auto space-y-6 flex-1 ${paper.bg}`}>
          {/* Top Stamp & Date Banner */}
          <div className={`flex items-start justify-between gap-4 border-b ${paper.border} pb-6`}>
            <div className="space-y-1.5">
              <div className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full ${paper.badgeBg} ${paper.badgeText} text-xs font-mono font-bold uppercase tracking-wider border border-current/20 shadow-2xs`}>
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>ESCRITA CON TODO MI CORAZÓN</span>
              </div>
              
              <div className={`flex items-center gap-2 text-xs font-mono opacity-80 pt-1`}>
                <Calendar className="w-3.5 h-3.5 text-rose-500" />
                <span>Fecha: <strong className="font-bold">{formatDate(letter.date)}</strong></span>
              </div>

              {letter.specialSong && !letter.appleMusicTrack && (
                <div className={`text-[11px] font-mono italic flex items-center gap-1 ${paper.accent}`}>
                  <Music className="w-3.5 h-3.5" />
                  <span>{letter.specialSong}</span>
                </div>
              )}
            </div>

            {/* Regal King Crown & Heart Wax Seal */}
            <div className="relative w-16 h-22 bg-gradient-to-b from-[#E05A36] via-[#D44E2A] to-[#A33517] text-amber-200 border-2 border-amber-300/60 rounded-xl p-2 flex flex-col items-center justify-between shadow-lg transform rotate-2">
              <div className="text-[7px] font-mono font-black text-amber-200 tracking-wider">
                PRÍNCIPE
              </div>
              <Crown className="w-7 h-7 text-amber-300 fill-amber-300/40 drop-shadow-sm" />
              <Heart className="w-4 h-4 fill-white text-white" />
              <div className="text-[7px] font-mono font-bold text-amber-200">
                AMOR REAL
              </div>
            </div>
          </div>

          {/* Letter Title */}
          <div>
            <h1 className="font-display font-black text-2xl sm:text-4xl leading-tight">
              {letter.title}
            </h1>
            <div className={`mt-3 flex flex-wrap items-center gap-4 text-xs sm:text-sm font-mono border-l-3 border-rose-500 pl-3 py-1 ${paper.badgeBg} rounded-r`}>
              <span>Para: <strong className="font-bold">{letter.recipient}</strong></span>
              <span>De: <strong className="font-bold">{letter.sender}</strong></span>
            </div>
          </div>

          {/* Dedication Apple Music Track Player */}
          {letter.appleMusicTrack && (
            <div className="my-2">
              <AppleMusicPlayer track={letter.appleMusicTrack} variant="full" />
            </div>
          )}

          {/* Letter Body & Couple Photo Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start pt-2">
            <div className="md:col-span-2 space-y-6">
              <div className="text-base sm:text-lg leading-relaxed font-serif whitespace-pre-line text-pretty">
                {letter.content}
              </div>

              {/* Romantic Signature */}
              <div className={`pt-6 border-t ${paper.border}`}>
                <div className={`font-script text-4xl sm:text-5xl ${paper.accent} transform -rotate-2`}>
                  {letter.sender}
                </div>
                <div className="text-xs font-mono opacity-70 tracking-wider mt-1 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 fill-current text-rose-500" />
                  <span>Tu novia que te ama para siempre · Principe Airlines</span>
                </div>
              </div>
            </div>

            {/* Attached Couple Photo Styled as a Romantic Polaroid */}
            {letter.photoUrl && (
              <div className="md:col-span-1 bg-white p-3.5 rounded-xl shadow-xl border-2 border-white transform rotate-2 hover:rotate-0 transition-transform">
                <div className="aspect-[4/5] bg-neutral-900 rounded-lg overflow-hidden">
                  <img
                    src={letter.photoUrl}
                    alt={letter.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center mt-3 font-script text-2xl text-rose-600">
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
