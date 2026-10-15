import React from 'react';
import { LoveLetter } from '../types';
import { LetterCard } from './LetterCard';
import { Heart, Sparkles, Crown } from 'lucide-react';

interface LettersRegistrySectionProps {
  letters: LoveLetter[];
  onOpenLetterReader: (letter: LoveLetter) => void;
  onOpenCreateLetter?: () => void;
}

export const LettersRegistrySection: React.FC<LettersRegistrySectionProps> = ({
  letters,
  onOpenLetterReader,
}) => {
  return (
    <section id="letters-registry" className="w-full bg-[#FAF6EE] py-20 px-4 sm:px-6 lg:px-8 border-t-2 border-[#EADFCB] relative overflow-hidden">
      {/* Decorative ambient subtle hearts & sunlit circles in background */}
      <div className="absolute top-10 left-10 text-[#FA8B69]/15 select-none pointer-events-none">
        <Heart className="w-28 h-28 stroke-[1]" />
      </div>
      <div className="absolute bottom-8 right-12 text-[#F4A62A]/15 select-none pointer-events-none">
        <Heart className="w-36 h-36 stroke-[1]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b-2 border-[#EADFCB]">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF0EB] text-[#E05A36] text-xs font-mono font-bold tracking-wider mb-3 border border-[#FA8B69]/40 shadow-2xs">
              <Heart className="w-3.5 h-3.5 fill-[#E05A36] text-[#E05A36] animate-pulse" />
              <span>BUZÓN DE CARTAS DE AMOR PARA MI NOVIO</span>
            </div>
            
            <h2 className="font-display font-black text-3xl sm:text-5xl text-[#0E2340] tracking-tight flex items-center gap-3">
              <span>Cartas de Amor para Ti</span>
              <Crown className="w-7 h-7 sm:w-9 sm:h-9 text-amber-500 fill-amber-400/40 inline-block" />
            </h2>
            
            <p className="text-sm sm:text-base text-neutral-600 font-sans mt-2 max-w-2xl leading-relaxed">
              Un rincón íntimo y especial creado solo para nosotros. Cada carta fue escrita con todo mi amor para que entres a leerlas cuando quieras y recuerdes lo mucho que significas para mí. Haz clic en cualquiera para abrirla.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-neutral-600 self-start md:self-auto">
            <span>Cartas guardadas:</span>
            <span className="font-bold text-[#E05A36] bg-white px-3.5 py-1.5 rounded-full border border-[#FA8B69]/40 shadow-xs flex items-center gap-1.5">
              <Heart className="w-3 h-3 fill-[#E05A36] text-[#E05A36]" />
              <span>{letters.length} Cartas de Amor</span>
            </span>
          </div>
        </div>

        {/* Letters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-10">
          {letters.length === 0 ? (
            <div className="col-span-full py-16 text-center text-neutral-600 font-mono text-sm bg-white rounded-2xl border-2 border-dashed border-[#EADFCB] p-8">
              Aún no hay cartas en el buzón. Entra al Estudio & Gestor para escribir la primera carta de amor para tu novio.
            </div>
          ) : (
            letters.map((letter) => (
              <LetterCard
                key={letter.id}
                letter={letter}
                onOpen={() => onOpenLetterReader(letter)}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
};
