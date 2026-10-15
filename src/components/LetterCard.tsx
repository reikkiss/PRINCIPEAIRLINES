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
      className={`group relative bg-[#FBF8F1] text-[#121212] shape-arch border-2 border-[#EADFCB] hover:border-[#E05A36] shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between hover:-translate-y-1.5 ${className}`}
    >
      {/* Mediterranean Terracotta & Marigold Candy Stripes Bar */}
      <div className="w-full h-3.5 pattern-stripes-terracotta border-b border-[#E05A36]/30" />

      <div className="p-6 flex-1 flex flex-col justify-between">
        {/* Top Header: Romantic Badge, Special Date & Royal Wax Seal */}
        <div className="flex items-start justify-between gap-3 border-b border-[#EADFCB] pb-3.5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0EB] text-[#E05A36] text-[11px] font-mono font-bold tracking-wide border border-[#FA8B69]/40 shadow-2xs">
              <Heart className="w-3.5 h-3.5 fill-[#E05A36] text-[#E05A36] animate-pulse" />
              <span>CARTA DE AMOR PARA TI</span>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-mono text-neutral-500 pt-1">
              <Calendar className="w-3.5 h-3.5 text-[#E05A36]" />
              <span>{formatDate(letter.date)}</span>
            </div>
          </div>

          {/* Royal King Crown & Heart Wax Seal (Terracotta & Gold) */}
          <div 
            className="relative w-12 h-14 bg-gradient-to-b from-[#E05A36] to-[#C84B2B] text-amber-200 border-2 border-amber-300/60 rounded-lg p-1.5 flex flex-col items-center justify-between shadow-md shrink-0 transform rotate-3 group-hover:rotate-0 transition-transform"
            title="Sello Real de Amor"
          >
            <Crown className="w-5 h-5 text-amber-300 fill-amber-300/40" />
            <Heart className="w-3 h-3 fill-white text-white" />
            <div className="text-[6px] font-mono font-black uppercase tracking-tighter text-amber-200">
              PRÍNCIPE
            </div>
          </div>
        </div>

        {/* Letter Body Preview & Photo */}
        <div className="py-4 flex gap-4 items-center">
          {letter.photoUrl && (
            <div className="w-20 h-24 sm:w-22 sm:h-28 rounded-xl overflow-hidden border-2 border-white shadow-md shrink-0 bg-neutral-100 transform -rotate-1 group-hover:rotate-0 transition-transform">
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
              <h3 className="font-display font-bold text-lg sm:text-xl text-[#0E2340] group-hover:text-[#E05A36] transition-colors leading-tight line-clamp-2">
                {letter.title}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 font-serif mt-2 line-clamp-3 leading-relaxed italic">
                "{letter.content}"
              </p>
            </div>
          </div>
        </div>

        {/* Recipient & Sender Sign-off */}
        <div className="pt-3 border-t border-[#EADFCB] flex flex-wrap items-center justify-between text-xs font-mono text-neutral-600 gap-2">
          <div>
            <span className="text-neutral-400">Para: </span>
            <strong className="text-[#E05A36] font-bold">{letter.recipient}</strong>
          </div>
          <div>
            <span className="text-neutral-400">De: </span>
            <strong className="text-[#0E2340] font-bold">{letter.sender}</strong>
          </div>
        </div>
      </div>

      {/* Love Letter CTA Bar (Terracotta & Gold) */}
      <div className="bg-[#FFF0EB] group-hover:bg-[#E05A36] group-hover:text-white px-5 py-3 border-t border-[#FA8B69]/30 flex items-center justify-between text-xs font-mono font-bold text-[#E05A36] transition-colors">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 group-hover:text-amber-200" />
          <span>Abrir y Leer Carta con Amor</span>
        </span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
      </div>
    </div>
  );
};
