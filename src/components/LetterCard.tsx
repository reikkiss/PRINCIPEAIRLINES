import React, { useState, useEffect } from 'react';
import { LoveLetter } from '../types';
import { Heart, Crown, Calendar, Sparkles, ArrowRight, Lock, Disc3, Clock } from 'lucide-react';

interface LetterCardProps {
  letter: LoveLetter;
  onOpen?: () => void;
  className?: string;
}

export const isLetterLocked = (letter: LoveLetter): boolean => {
  if (!letter.isLockedUntilDate || !letter.unlockDate) return false;
  return new Date(letter.unlockDate).getTime() > Date.now();
};

export const LetterCard: React.FC<LetterCardProps> = ({
  letter,
  onOpen,
  className = '',
}) => {
  const [countdownText, setCountdownText] = useState<string>('');
  const [isLocked, setIsLocked] = useState<boolean>(() => isLetterLocked(letter));

  useEffect(() => {
    if (!letter.isLockedUntilDate || !letter.unlockDate) {
      setIsLocked(false);
      return;
    }

    const updateTimer = () => {
      const targetTime = new Date(letter.unlockDate!).getTime();
      const diff = targetTime - Date.now();

      if (diff <= 0) {
        setIsLocked(false);
        setCountdownText('¡Abierta!');
        return;
      }

      setIsLocked(true);
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      if (d > 0) {
        setCountdownText(`${d}d ${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m`);
      } else {
        setCountdownText(`${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [letter.isLockedUntilDate, letter.unlockDate]);

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

  const getCardBg = (style?: string) => {
    switch (style) {
      case 'linen': return 'bg-[#FDFCF7]';
      case 'parchment': return 'bg-[#F4EBD9]';
      case 'airmail': return 'bg-[#F0F4F8]';
      case 'kraft': return 'bg-[#E8DCC4]';
      case 'rose':
      default: return 'bg-[#FBF8F1]';
    }
  };

  return (
    <div
      onClick={onOpen}
      className={`group relative ${getCardBg(letter.paperStyle)} text-[#121212] shape-arch border-2 ${
        isLocked
          ? 'border-amber-400/60 hover:border-amber-500 shadow-md'
          : 'border-[#EADFCB] hover:border-[#E05A36] shadow-lg'
      } hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between hover:-translate-y-1.5 ${className}`}
    >
      {/* Top Mediterranean Stripes Bar */}
      <div className={`w-full h-3.5 ${isLocked ? 'bg-gradient-to-r from-amber-500 via-[#E05A36] to-[#0E2340]' : 'pattern-stripes-terracotta'} border-b border-[#E05A36]/30`} />

      <div className="p-6 flex-1 flex flex-col justify-between">
        {/* Top Header: Romantic Badge / Countdown Badge & Royal Wax Seal */}
        <div className="flex items-start justify-between gap-3 border-b border-[#EADFCB] pb-3.5">
          <div className="space-y-1">
            {isLocked ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-[11px] font-mono font-bold tracking-wide border border-amber-300 shadow-2xs">
                <Lock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                <span>SELLADA · CUENTA REGRESIVA</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0EB] text-[#E05A36] text-[11px] font-mono font-bold tracking-wide border border-[#FA8B69]/40 shadow-2xs">
                <Heart className="w-3.5 h-3.5 fill-[#E05A36] text-[#E05A36] animate-pulse" />
                <span>CARTA DE AMOR PARA TI</span>
              </div>
            )}

            <div className="flex items-center gap-1.5 text-xs font-mono text-neutral-500 pt-1">
              <Calendar className="w-3.5 h-3.5 text-[#E05A36]" />
              <span>{formatDate(letter.date)}</span>
            </div>
          </div>

          {/* Royal King Crown & Heart Wax Seal (with Lock icon if locked) */}
          <div 
            className={`relative w-12 h-14 ${
              isLocked
                ? 'bg-gradient-to-b from-[#0E2340] to-[#1E3A5F] text-amber-300 border-2 border-amber-400'
                : 'bg-gradient-to-b from-[#E05A36] to-[#C84B2B] text-amber-200 border-2 border-amber-300/60'
            } rounded-lg p-1.5 flex flex-col items-center justify-between shadow-md shrink-0 transform rotate-3 group-hover:rotate-0 transition-transform`}
            title={isLocked ? 'Carta Sellada con Candado Real' : 'Sello Real de Amor'}
          >
            {isLocked ? (
              <>
                <Lock className="w-4 h-4 text-amber-300" />
                <Crown className="w-4 h-4 text-amber-300 fill-amber-300/40" />
                <div className="text-[6px] font-mono font-black uppercase tracking-tighter text-amber-200">
                  SELLADA
                </div>
              </>
            ) : (
              <>
                <Crown className="w-5 h-5 text-amber-300 fill-amber-300/40" />
                <Heart className="w-3 h-3 fill-white text-white" />
                <div className="text-[6px] font-mono font-black uppercase tracking-tighter text-amber-200">
                  PRÍNCIPE
                </div>
              </>
            )}
          </div>
        </div>

        {/* Letter Body Preview & Photo */}
        <div className="py-4 flex gap-4 items-center">
          {letter.photoUrl && (
            <div className={`w-20 h-24 sm:w-22 sm:h-28 rounded-xl overflow-hidden border-2 border-white shadow-md shrink-0 bg-neutral-100 transform -rotate-1 group-hover:rotate-0 transition-transform ${isLocked ? 'filter blur-[1px]' : ''}`}>
              <img
                src={letter.photoUrl}
                alt={letter.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}

          <div className="flex-1 flex flex-col justify-between min-w-0">
            <div>
              <h3 className="font-display font-bold text-lg sm:text-xl text-[#0E2340] group-hover:text-[#E05A36] transition-colors leading-tight line-clamp-2">
                {letter.title}
              </h3>

              {isLocked ? (
                /* Obfuscated locked preview */
                <div className="mt-2.5 p-2.5 bg-amber-50/70 border border-amber-200/80 rounded-lg text-xs font-serif text-amber-900/80 italic leading-relaxed">
                  🔒 "Esta carta está sellada para ti y se revelará al completarse la cuenta regresiva..."
                </div>
              ) : (
                <p className="text-xs sm:text-sm text-neutral-600 font-serif mt-2 line-clamp-3 leading-relaxed italic">
                  "{letter.content}"
                </p>
              )}
            </div>

            {/* Apple Music Track Badge */}
            {letter.appleMusicTrack && (
              <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-50 text-rose-700 text-[10px] font-mono border border-rose-200 max-w-full">
                <Disc3 className="w-3 h-3 text-rose-500 shrink-0" />
                <span className="font-bold truncate">{letter.appleMusicTrack.title}</span>
                <span className="text-rose-400">·</span>
                <span className="text-neutral-500 truncate">{letter.appleMusicTrack.artist}</span>
              </div>
            )}
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

      {/* Action Bar (Terracotta or Locked Countdown Bar) */}
      {isLocked ? (
        <div className="bg-gradient-to-r from-[#0E2340] to-[#1E3A5F] group-hover:from-amber-600 group-hover:to-[#0E2340] text-amber-300 group-hover:text-white px-5 py-3 border-t border-amber-400/30 flex items-center justify-between text-xs font-mono font-bold transition-all">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '8s' }} />
            <span>Abre en: <strong className="text-white font-mono tabular-nums">{countdownText}</strong></span>
          </span>
          <div className="flex items-center gap-1 text-[11px] uppercase tracking-wider text-amber-200">
            <span>Ver Contador</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      ) : (
        <div className="bg-[#FFF0EB] group-hover:bg-[#E05A36] group-hover:text-white px-5 py-3 border-t border-[#FA8B69]/30 flex items-center justify-between text-xs font-mono font-bold text-[#E05A36] transition-colors">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 group-hover:text-amber-200" />
            <span>Abrir y Leer Carta con Amor</span>
          </span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
        </div>
      )}
    </div>
  );
};
