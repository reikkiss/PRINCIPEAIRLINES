import React from 'react';
import { LoveLetter } from '../types';
import { Heart, Crown, Calendar, Sparkles, ArrowRight } from 'lucide-react';

interface LetterCardProps {
  letter: LoveLetter;
  onOpen?: () => void;
  className?: string;
}

export const LetterCard: React.FC<LetterCardProps> = ({
  letter,
  onOpen,
  className = '',
}) => {
  // Format dates
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
    <div
      onClick={onOpen}
      className={`group relative bg-[#FCF9F5] text-[#1A1A1A] rounded-xl border border-rose-200/80 hover:border-rose-400 shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between hover:-translate-y-1 ${className}`}
    >
      {/* Romantic Rose Gold & Ruby Ribbon Top Border */}
      <div 
        className="w-full h-3"
        style={{
          background: 'repeating-linear-gradient(135deg, #E11D48 0, #E11D48 14px, #FFF1F2 14px, #FFF1F2 20px, #F59E0B 20px, #F59E0B 34px, #FFF1F2 34px, #FFF1F2 40px)',
        }}
      />

      <div className="p-6 flex-1 flex flex-col justify-between">
        {/* Top Header: Romantic Badge, Special Date & Royal Wax Seal */}
        <div className="flex items-start justify-between gap-3 border-b border-rose-100 pb-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-600 text-[11px] font-mono font-bold tracking-wide border border-rose-200 shadow-2xs">
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-pulse" />
              <span>CARTA DE AMOR PARA TI</span>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-mono text-neutral-500 pt-1">
              <Calendar className="w-3.5 h-3.5 text-rose-400" />
              <span>{formatDate(letter.date)}</span>
            </div>
          </div>

          {/* Royal King Crown & Heart Wax Seal */}
          <div 
            className="relative w-12 h-14 bg-gradient-to-b from-rose-700 to-rose-900 text-amber-300 border border-amber-300/40 rounded-sm p-1.5 flex flex-col items-center justify-between shadow-md shrink-0 transform rotate-3 group-hover:rotate-0 transition-transform"
            title="Sello Real de Amor"
          >
            <Crown className="w-5 h-5 text-amber-300 fill-amber-300/30" />
            <Heart className="w-3 h-3 fill-amber-300 text-amber-300" />
            <div className="text-[6px] font-mono font-black uppercase tracking-tighter text-amber-200">
              PRINCIPE
            </div>
          </div>
        </div>

        {/* Letter Body Preview & Photo */}
        <div className="py-4 flex gap-4 items-center">
          {letter.photoUrl && (
            <div className="w-20 h-24 sm:w-22 sm:h-28 rounded-lg overflow-hidden border-2 border-white shadow-md shrink-0 bg-neutral-100 transform -rotate-1 group-hover:rotate-0 transition-transform">
              <img
                src={letter.photoUrl}
                alt={letter.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}

          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h3 className="font-display font-bold text-lg sm:text-xl text-neutral-900 group-hover:text-rose-600 transition-colors leading-tight line-clamp-2">
                {letter.title}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 font-serif mt-2 line-clamp-3 leading-relaxed italic">
                "{letter.content}"
              </p>
            </div>
          </div>
        </div>

        {/* Recipient & Sender Sign-off */}
        <div className="pt-3 border-t border-rose-100 flex flex-wrap items-center justify-between text-xs font-mono text-neutral-600 gap-2">
          <div>
            <span className="text-neutral-400">Para: </span>
            <strong className="text-rose-700 font-bold">{letter.recipient}</strong>
          </div>
          <div>
            <span className="text-neutral-400">De: </span>
            <strong className="text-neutral-900 font-bold">{letter.sender}</strong>
          </div>
        </div>
      </div>

      {/* Love Letter CTA Bar */}
      <div className="bg-rose-50/80 group-hover:bg-rose-600 group-hover:text-white px-5 py-2.5 border-t border-rose-200/60 flex items-center justify-between text-xs font-mono font-bold text-rose-700 transition-colors">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Abrir y Leer Carta con Amor</span>
        </span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
      </div>
    </div>
  );
};
