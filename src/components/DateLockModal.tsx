import React, { useState } from 'react';
import { Lock, KeyRound, X, AlertCircle, CheckCircle2, Calendar } from 'lucide-react';

interface DateLockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const DateLockModal: React.FC<DateLockModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  // Date states (Day, Month, Year)
  const [day, setDay] = useState<string>('01');
  const [month, setMonth] = useState<string>('01');
  const [year, setYear] = useState<string>('2025');
  const [dateInput, setDateInput] = useState<string>('2025-01-01');
  const [useCalendar, setUseCalendar] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const validateAndSubmit = (selectedDateStr?: string) => {
    setError(null);

    // Target date is 02/12/2026
    // In ISO format: 2026-12-02 (2 Dec 2026) or 2026-02-12 (12 Feb 2026)
    let isMatch = false;

    if (selectedDateStr) {
      if (selectedDateStr === '2026-12-02' || selectedDateStr === '2026-02-12') {
        isMatch = true;
      }
    } else {
      const d = parseInt(day, 10);
      const m = parseInt(month, 10);
      const y = parseInt(year, 10);

      // Check standard DD/MM/YYYY (02/12/2026) or MM/DD/YYYY
      if (y === 2026 && ((d === 2 && m === 12) || (d === 12 && m === 2))) {
        isMatch = true;
      }
    }

    if (isMatch) {
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onSuccess();
      }, 700);
    } else {
      setError('Fecha incorrecta. Por favor ingresa la fecha autorizada.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (useCalendar) {
      validateAndSubmit(dateInput);
    } else {
      validateAndSubmit();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn select-none">
      <div className="relative w-full max-w-md bg-[#0F172A] text-white border-2 border-[#0015ff] rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-white/50 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Security Lock Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#0015ff]/20 border-2 border-[#0015ff] flex items-center justify-center mb-3">
            {isSuccess ? (
              <CheckCircle2 className="w-7 h-7 text-emerald-400 animate-scaleUp" />
            ) : (
              <Lock className="w-7 h-7 text-[#0015ff]" />
            )}
          </div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#FACC15] font-bold">
            ACCESO PROTEGIDO
          </span>
          <h3 className="font-display font-black text-2xl text-white mt-1">
            Estudio & Gestor de Boletos
          </h3>
          <p className="text-xs text-white/60 font-sans mt-1.5 max-w-xs mx-auto">
            Por favor selecciona la fecha autorizada para desbloquear el panel de edición.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {!useCalendar ? (
            /* Styled DD / MM / YYYY Selectors */
            <div className="grid grid-cols-3 gap-2 font-mono">
              {/* Day */}
              <div>
                <label className="block text-[10px] text-white/60 uppercase mb-1 text-center">
                  Día (DD)
                </label>
                <select
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                  className="w-full py-2.5 px-2 bg-black border border-white/20 rounded-lg text-center font-bold text-base text-white focus:border-[#0015ff] focus:outline-none"
                >
                  {Array.from({ length: 31 }, (_, i) => {
                    const val = (i + 1).toString().padStart(2, '0');
                    return (
                      <option key={val} value={val}>
                        {val}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Month */}
              <div>
                <label className="block text-[10px] text-white/60 uppercase mb-1 text-center">
                  Mes (MM)
                </label>
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="w-full py-2.5 px-2 bg-black border border-white/20 rounded-lg text-center font-bold text-base text-white focus:border-[#0015ff] focus:outline-none"
                >
                  {Array.from({ length: 12 }, (_, i) => {
                    const val = (i + 1).toString().padStart(2, '0');
                    return (
                      <option key={val} value={val}>
                        {val}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Year */}
              <div>
                <label className="block text-[10px] text-white/60 uppercase mb-1 text-center">
                  Año (AAAA)
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full py-2.5 px-2 bg-black border border-white/20 rounded-lg text-center font-bold text-base text-white focus:border-[#0015ff] focus:outline-none"
                >
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                  <option value="2028">2028</option>
                </select>
              </div>
            </div>
          ) : (
            /* Native HTML Date Picker Option */
            <div>
              <label className="block text-[11px] font-mono text-white/60 uppercase mb-1">
                Selecciona la fecha en el calendario
              </label>
              <input
                type="date"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                className="w-full py-2.5 px-3 bg-black border border-white/20 rounded-lg text-sm text-white font-mono focus:border-[#0015ff] focus:outline-none"
                required
              />
            </div>
          )}

          {/* Toggle between 3 dropdowns and calendar input */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => setUseCalendar(!useCalendar)}
              className="text-[11px] font-mono text-[#FACC15] hover:underline flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>
                {useCalendar ? 'Usar selector Día/Mes/Año' : 'Usar calendario directo'}
              </span>
            </button>
          </div>

          {/* Error notice */}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Unlock Button */}
          <button
            type="submit"
            className="w-full py-3 bg-[#0015ff] hover:bg-[#0022ff] text-white font-mono font-bold text-xs uppercase tracking-wider rounded-lg transition-transform active:scale-95 shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <KeyRound className="w-4 h-4 text-[#FACC15]" />
            <span>Desbloquear Estudio</span>
          </button>
        </form>
      </div>
    </div>
  );
};
