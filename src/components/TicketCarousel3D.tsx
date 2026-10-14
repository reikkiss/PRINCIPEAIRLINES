import React, { useState, useEffect, useCallback } from 'react';
import { BoardingTicket } from '../types';
import { TicketCard } from './TicketCard';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface TicketCarousel3DProps {
  tickets: BoardingTicket[];
  onOpenUploadModal: (prefill?: Partial<BoardingTicket>) => void;
  onEditTicket: (ticket: BoardingTicket) => void;
  onSwitchToMap?: (ticket?: BoardingTicket) => void;
}

export const TicketCarousel3D: React.FC<TicketCarousel3DProps> = ({
  tickets,
  onOpenUploadModal,
  onEditTicket,
  onSwitchToMap,
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  useEffect(() => {
    if (tickets.length > 0 && activeIndex >= tickets.length) {
      setActiveIndex(Math.max(0, tickets.length - 1));
    }
  }, [tickets.length, activeIndex]);

  const handleNext = useCallback(() => {
    if (tickets.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % tickets.length);
  }, [tickets.length]);

  const handlePrev = useCallback(() => {
    if (tickets.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + tickets.length) % tickets.length);
  }, [tickets.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  if (tickets.length === 0) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center p-8 text-center text-white bg-gradient-to-b from-[#030B1E] to-[#0A2540]">
        <p className="text-xl font-display mb-4">No hay boletos disponibles</p>
        <button
          onClick={() => onOpenUploadModal()}
          className="px-6 py-3 bg-[#FACC15] text-black font-bold uppercase tracking-wider rounded"
        >
          Subir Primera Foto & Boleto
        </button>
      </div>
    );
  }

  const activeTicket = tickets[activeIndex] || tickets[0];

  return (
    <div className="relative w-full min-h-[75vh] sm:min-h-[80vh] bg-gradient-to-b from-[#030B1E] via-[#051336] to-[#0A2540] text-white overflow-hidden flex flex-col justify-between py-6 px-4 md:px-10">
      {/* 3D Cover Flow Carousel Stage */}
      <div 
        className="relative w-full flex-1 flex items-center justify-center my-6 py-6 perspective-[1200px]"
        style={{ perspective: '1200px' }}
      >
        {/* Floor reflection ambient effect */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[85%] h-12 bg-gradient-to-t from-white/10 to-transparent blur-2xl rounded-full pointer-events-none" />

        <div className="relative w-full max-w-5xl h-[560px] flex items-center justify-center">
          {tickets.map((ticket, index) => {
            const offset = index - activeIndex;
            const absOffset = Math.abs(offset);

            // Hide cards that are too far away for performance and visual clarity
            if (absOffset > 4) return null;

            // 3D Cover Flow transforms
            let transformStyle = '';
            let zIndex = 30 - absOffset;
            let opacity = 1;

            if (offset === 0) {
              // Center focused card
              transformStyle = 'translateX(0) translateZ(0) rotateY(0deg) scale(1)';
              zIndex = 40;
              opacity = 1;
            } else if (offset < 0) {
              // Left fanning cards
              const xPos = -120 * absOffset - 80;
              const zPos = -120 * absOffset;
              const rotY = 48 - Math.min(absOffset * 4, 15);
              transformStyle = `translateX(${xPos}px) translateZ(${zPos}px) rotateY(${rotY}deg) scale(${0.88 - absOffset * 0.05})`;
              opacity = Math.max(0.4, 1 - absOffset * 0.2);
            } else {
              // Right fanning cards
              const xPos = 120 * absOffset + 80;
              const zPos = -120 * absOffset;
              const rotY = -(48 - Math.min(absOffset * 4, 15));
              transformStyle = `translateX(${xPos}px) translateZ(${zPos}px) rotateY(${rotY}deg) scale(${0.88 - absOffset * 0.05})`;
              opacity = Math.max(0.4, 1 - absOffset * 0.2);
            }

            return (
              <div
                key={ticket.id}
                onClick={() => setActiveIndex(index)}
                className="absolute transition-all duration-500 ease-out cursor-pointer"
                style={{
                  transform: transformStyle,
                  zIndex,
                  opacity,
                  transformStyle: 'preserve-3d',
                }}
              >
                <TicketCard
                  ticket={ticket}
                  isFocused={offset === 0}
                  onEdit={onEditTicket}
                  onViewOnMap={() => onSwitchToMap?.(ticket)}
                  showActions={offset === 0}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Navigation: Huge White Arrows matching screenshot */}
      <div className="relative z-40 flex items-center justify-center gap-12 sm:gap-20 pt-4 pb-2">
        {/* Left Arrow Button */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous Ticket"
          className="group p-3 rounded-full hover:bg-white/10 transition-transform active:scale-90 focus:outline-none cursor-pointer"
        >
          <ArrowLeft className="w-10 h-10 sm:w-14 sm:h-14 text-white stroke-[2.5] group-hover:translate-x-[-4px] transition-transform" />
        </button>

        {/* Counter & Indicator */}
        <div className="flex flex-col items-center font-mono">
          <div className="text-sm sm:text-base font-bold text-[#FACC15] tracking-widest">
            {activeIndex + 1} / {tickets.length}
          </div>
          <div className="text-[10px] text-white/50 uppercase tracking-widest mt-0.5">
            {activeTicket.departingCode} → {activeTicket.destinationCode}
          </div>
        </div>

        {/* Right Arrow Button */}
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next Ticket"
          className="group p-3 rounded-full hover:bg-white/10 transition-transform active:scale-90 focus:outline-none cursor-pointer"
        >
          <ArrowRight className="w-10 h-10 sm:w-14 sm:h-14 text-white stroke-[2.5] group-hover:translate-x-[4px] transition-transform" />
        </button>
      </div>
    </div>
  );
};
