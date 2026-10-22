import React, { useState, useEffect } from 'react';
import { LoveLetter } from '../types';
import { Lock, Heart, Crown, Calendar, Sparkles, X, Clock, CheckCircle2 } from 'lucide-react';

interface LetterCountdownLockModalProps {
  letter: LoveLetter | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenLetter?: (letter: LoveLetter) => void;
  onUpdateLetter?: (letter: LoveLetter) => void;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export const LetterCountdownLockModal: React.FC<LetterCountdownLockModalProps> = ({
  letter,
  isOpen,
  onClose,
  onOpenLetter,
  onUpdateLetter,
}) => {
  const [isEditingTime, setIsEditingTime] = useState<boolean>(false);
  const [newUnlockTime, setNewUnlockTime] = useState<string>(() => {
    if (letter?.unlockDate) {
      const d = new Date(letter.unlockDate);
      if (!isNaN(d.getTime())) {
        return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
      }
    }
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    return new Date(nextWeek.getTime() - nextWeek.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  });

  useEffect(() => {
    if (letter?.unlockDate) {
      const d = new Date(letter.unlockDate);
      if (!isNaN(d.getTime())) {
        setNewUnlockTime(new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16));
      }
    }
    setIsEditingTime(false);
  }, [letter, isOpen]);
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    if (!isOpen || !letter || !letter.unlockDate) return;

    const calculateTime = () => {
      const targetTime = new Date(letter.unlockDate!).getTime();
      const now = Date.now();
      const difference = targetTime - now;

      if (difference <= 0) {
        setTimeRemaining({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
        });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeRemaining({
        days,
        hours,
        minutes,
        seconds,
        isExpired: false,
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [isOpen, letter]);

  if (!isOpen || !letter) return null;

  const formatUnlockDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn select-none">
      <div className="relative w-full max-w-lg bg-[#0E2340] text-white rounded-3xl border-2 border-amber-300/50 shadow-2xl overflow-hidden p-6 sm:p-8 flex flex-col items-center text-center">
        {/* Top Terracotta Candy Stripe */}
        <div className="absolute top-0 left-0 right-0 h-3 pattern-stripes-terracotta border-b border-amber-300/30" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-white/50 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Wax Seal Icon with Lock */}
        <div className="mt-4 mb-5 relative">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#E05A36] via-[#C84B2B] to-[#992E15] border-2 border-amber-300 flex items-center justify-center shadow-xl transform rotate-2">
            {timeRemaining.isExpired ? (
              <CheckCircle2 className="w-10 h-10 text-emerald-300 animate-bounce" />
            ) : (
              <Lock className="w-10 h-10 text-amber-300 animate-pulse" />
            )}
          </div>
          <div className="absolute -top-2 -right-2 bg-amber-400 text-[#0E2340] p-1.5 rounded-full shadow-md">
            <Crown className="w-4 h-4 fill-current" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-1 mb-5">
          <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-amber-300 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-300/30">
            {timeRemaining.isExpired ? '¡CARTA DESBLOQUEADA!' : 'CARTA DE AMOR SELLADA'}
          </span>
          <h2 className="text-xl sm:text-2xl font-black font-display text-white mt-2">
            {letter.title}
          </h2>
          <p className="text-xs font-mono text-neutral-300">
            Para: <strong className="text-rose-300">{letter.recipient}</strong> · De: <strong className="text-amber-200">{letter.sender}</strong>
          </p>
        </div>

        {/* Countdown Timer Display or Unlocked CTA */}
        {!timeRemaining.isExpired ? (
          <div className="w-full space-y-5 my-2">
            {/* Live Digits Grid */}
            <div className="grid grid-cols-4 gap-2 sm:gap-3 w-full">
              {[
                { label: 'DÍAS', value: timeRemaining.days },
                { label: 'HORAS', value: timeRemaining.hours },
                { label: 'MINUTOS', value: timeRemaining.minutes },
                { label: 'SEGUNDOS', value: timeRemaining.seconds },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-black/50 border border-amber-300/30 rounded-2xl p-2.5 sm:p-3 flex flex-col items-center justify-center shadow-inner"
                >
                  <span className="text-2xl sm:text-4xl font-mono font-black text-amber-300 tabular-nums">
                    {item.value.toString().padStart(2, '0')}
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-mono tracking-widest text-neutral-400 mt-1 uppercase">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Target Date Box & Edit button */}
            <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-xs font-mono text-neutral-300 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>Se revelará el: <strong className="text-white capitalize">{formatUnlockDate(letter.unlockDate)}</strong></span>
                </div>
                {onUpdateLetter && !isEditingTime && (
                  <button
                    type="button"
                    onClick={() => setIsEditingTime(true)}
                    className="px-2.5 py-1 bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 rounded text-[10px] font-mono uppercase font-bold transition-colors cursor-pointer border border-amber-400/40"
                  >
                    Editar Fecha / Hora
                  </button>
                )}
              </div>

              {isEditingTime && (
                <div className="pt-2 border-t border-white/10 space-y-2 animate-fadeIn text-left">
                  <label className="block text-[11px] font-mono text-amber-300 uppercase">
                    Nueva Fecha y Hora de Desbloqueo:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="datetime-local"
                      value={newUnlockTime}
                      onChange={(e) => setNewUnlockTime(e.target.value)}
                      className="flex-1 px-3 py-2 bg-neutral-900 border border-amber-400/60 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!letter || !onUpdateLetter) return;
                        const updated: LoveLetter = {
                          ...letter,
                          isLockedUntilDate: true,
                          unlockDate: new Date(newUnlockTime).toISOString(),
                        };
                        onUpdateLetter(updated);
                        setIsEditingTime(false);
                      }}
                      className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold rounded-lg text-xs font-mono uppercase cursor-pointer shrink-0"
                    >
                      Guardar
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingTime(false)}
                      className="px-2.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-mono uppercase cursor-pointer shrink-0"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Romantic Message */}
            <div className="p-4 bg-gradient-to-r from-rose-950/40 via-[#1C172B]/60 to-rose-950/40 border border-rose-500/30 rounded-2xl text-xs text-rose-200 font-serif italic leading-relaxed">
              "¡Paciencia mi amor! Esta carta fue sellada con una promesa y palabras muy especiales. No se permite abrirla hasta que la cuenta regresiva llegue a cero." ❤️
            </div>
          </div>
        ) : (
          <div className="w-full space-y-4 my-3">
            <div className="p-4 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl text-emerald-200 font-sans text-sm">
              ✨ <strong>¡Llegó el momento tan esperado!</strong> La fecha especial se ha cumplido y el sello real ha sido liberado.
            </div>

            {onOpenLetter && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenLetter(letter);
                }}
                className="w-full py-3.5 px-6 bg-gradient-to-r from-[#E05A36] to-[#F4A62A] hover:brightness-110 text-white font-mono font-bold text-sm uppercase tracking-wider rounded-xl shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>Abrir y Leer la Carta Ahora</span>
              </button>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-white/10 w-full flex items-center justify-between text-[11px] font-mono text-neutral-400">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Cuenta regresiva en vivo</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-300 hover:text-white hover:underline cursor-pointer"
          >
            Cerrar ventana
          </button>
        </div>
      </div>
    </div>
  );
};
