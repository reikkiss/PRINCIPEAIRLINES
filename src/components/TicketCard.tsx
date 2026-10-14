import React from 'react';
import { BoardingTicket } from '../types';
import { Edit3, MapPin } from 'lucide-react';

interface TicketCardProps {
  ticket: BoardingTicket;
  isFocused?: boolean;
  onEdit?: (ticket: BoardingTicket) => void;
  onViewOnMap?: (ticket: BoardingTicket) => void;
  className?: string;
  showActions?: boolean;
}

export const TicketCard: React.FC<TicketCardProps> = ({
  ticket,
  isFocused = false,
  onEdit,
  onViewOnMap,
  className = '',
  showActions = true,
}) => {
  const isWinner = ticket.status.toUpperCase() === 'WINNER';
  const statusColorClass = isWinner
    ? 'text-[#FACC15]'
    : 'text-[#FB923C]';

  // Format dates for display
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  // Ensure carrier name is PRINCIPE AIRLINES if empty or legacy name
  const displayCarrier =
    ticket.carrierName &&
    ticket.carrierName !== 'SINGAPORE AIRLINES' &&
    ticket.carrierName !== 'PRINCIPE AILINES'
      ? ticket.carrierName
      : 'PRINCIPE AIRLINES';

  // Ensure flight number prefix reflects PA
  const displayFlight =
    ticket.flightNumber && !ticket.flightNumber.startsWith('SQ')
      ? ticket.flightNumber
      : (ticket.flightNumber?.replace(/^SQ/, 'PA') || 'FLIGHT PA286');

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* Status indicator tag above ticket (matches the screenshot!) */}
      <div className="mb-2 text-center">
        <div className="text-[10px] tracking-widest font-mono uppercase text-white/50 leading-none">
          STATUS:
        </div>
        <div className={`text-base sm:text-lg font-mono font-black tracking-widest uppercase ${statusColorClass} drop-shadow-[0_2px_8px_rgba(250,204,21,0.3)]`}>
          {ticket.status}
        </div>
      </div>

      {/* The physical paper ticket card */}
      <div 
        className={`relative w-[280px] sm:w-[320px] md:w-[360px] bg-[#FAF9F5] text-[#111111] rounded-sm overflow-hidden shadow-2xl transition-all duration-300 border border-black/10`}
        style={{
          boxShadow: isFocused 
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(255, 255, 255, 0.15)' 
            : '0 15px 30px -10px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Top Header Bar */}
        <div className="bg-[#121212] text-white px-4 py-2.5 flex items-center justify-between border-b-2 border-black">
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-center leading-none">
              <span className="text-[11px] font-mono font-black tracking-tighter">PA</span>
              <span className="text-[11px] font-mono font-black tracking-tighter">DS</span>
            </div>
            {/* Minimalist Globe / Wing emblem */}
            <div className="w-5 h-5 rounded-full border border-white/70 flex items-center justify-center p-0.5">
              <div className="w-full h-full rounded-full border-t border-b border-white/90 transform rotate-45" />
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-right">
            <div className="flex flex-col items-end leading-none">
              <span className="text-[9px] font-bold tracking-widest uppercase text-white/90">
                {displayCarrier}
              </span>
              <span className="text-[7px] text-[#FACC15] font-mono tracking-wider mt-0.5">
                {displayFlight.startsWith('FLIGHT') ? displayFlight : `FLIGHT ${displayFlight}`}
              </span>
            </div>

            {/* Regal King Crown Logo */}
            <div 
              className="w-7 h-6 flex items-center justify-center rounded bg-gradient-to-b from-[#FACC15]/20 to-[#FACC15]/5 border border-[#FACC15]/40 shadow-[0_0_10px_rgba(250,204,21,0.3)] shrink-0"
              title="Principe Airlines - Royal Crown"
            >
              <svg 
                viewBox="0 0 24 20" 
                className="w-5 h-4.5 text-[#FACC15] fill-current drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
              >
                {/* 5 Crown jewels / pearls on the tips */}
                <circle cx="2.5" cy="5.5" r="1.3" />
                <circle cx="7.25" cy="4" r="1.3" />
                <circle cx="12" cy="2" r="1.6" />
                <circle cx="16.75" cy="4" r="1.3" />
                <circle cx="21.5" cy="5.5" r="1.3" />
                {/* Crown peaks and body */}
                <path d="M 2.5,7 L 4.5,14 L 19.5,14 L 21.5,7 L 16.75,9.5 L 12,4.5 L 7.25,9.5 Z" />
                {/* Crown base band with embossed gems */}
                <rect x="3.5" y="15" width="17" height="3" rx="0.8" />
                <circle cx="6.5" cy="16.5" r="0.7" fill="#121212" />
                <circle cx="12" cy="16.5" r="0.8" fill="#121212" />
                <circle cx="17.5" cy="16.5" r="0.7" fill="#121212" />
              </svg>
            </div>
          </div>
        </div>

        {/* Departure & Destination Row */}
        <div className="px-5 pt-3 pb-2 border-b border-neutral-300">
          <div className="flex justify-between text-[10px] font-medium text-neutral-500 uppercase tracking-wider">
            <span>Departing: <strong className="text-black font-semibold">{ticket.departingCity}</strong></span>
            <span>Destination: <strong className="text-black font-semibold">{ticket.destinationCity}</strong></span>
          </div>

          {/* Airport Codes with arrow (matches screenshot AKL → ICN) */}
          <div className="flex items-center justify-between mt-1">
            <span className="text-3xl sm:text-4xl font-black font-display tracking-tight text-black">
              {ticket.departingCode}
            </span>
            <div className="flex items-center gap-1 text-black font-bold text-2xl sm:text-3xl">
              <span className="inline-block transform scale-x-125">→</span>
            </div>
            <span className="text-3xl sm:text-4xl font-black font-display tracking-tight text-black">
              {ticket.destinationCode}
            </span>
          </div>

          {/* Departure Date and details */}
          <div className="flex justify-between items-center mt-1 text-[9px] font-mono text-neutral-600">
            <span>DEP: {formatDate(ticket.departingDate)}</span>
            {ticket.returnDate && <span>RET: {formatDate(ticket.returnDate)}</span>}
          </div>
        </div>

        {/* Package Contents / Passenger Name */}
        <div className="px-5 py-2.5 border-b border-neutral-300">
          <div className="text-[9px] font-mono uppercase tracking-wider text-neutral-500">
            Package Contents:
          </div>
          <div className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black font-display leading-tight">
            {ticket.packageContents || 'PASSENGER'}
          </div>
        </div>

        {/* For: Recipient */}
        <div className="px-5 py-2.5 border-b border-neutral-300">
          <div className="text-[9px] font-mono uppercase tracking-wider text-neutral-500">
            For:
          </div>
          <div className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black font-display leading-tight">
            {ticket.forRecipient || 'RECIPIENT'}
          </div>
        </div>

        {/* Bottom Section: Biometric Halftone Photo + Dual Barcodes */}
        <div className="p-4 grid grid-cols-2 gap-3 items-center bg-[#F4F3EE]">
          {/* Passenger Photo Container with authentic halftone/dither filter */}
          <div className="relative aspect-[4/5] bg-neutral-900 rounded-sm overflow-hidden border border-neutral-400 shadow-inner group">
            <img
              src={ticket.photoUrl}
              alt={ticket.packageContents}
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover ${
                ticket.photoFilter === 'grayscale'
                  ? 'grayscale contrast-125'
                  : ticket.photoFilter === 'contrast'
                  ? 'contrast-150 brightness-90 grayscale'
                  : ticket.photoFilter === 'none'
                  ? ''
                  : 'grayscale contrast-150 brightness-95' // default halftone aesthetic
              }`}
              onError={(e) => {
                // Fallback avatar if image fails
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            {/* Halftone / scanline overlay matching airline security photo */}
            <div className="absolute inset-0 bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:3px_3px] opacity-35 pointer-events-none mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            
            <div className="absolute bottom-1 left-1.5 text-[7px] font-mono font-bold text-white/90 uppercase tracking-widest bg-black/60 px-1 py-0.5 rounded">
              VERIFIED
            </div>
          </div>

          {/* Barcodes & Numbers (matches exact dual vertical barcodes from the screenshot) */}
          <div className="flex flex-col justify-between h-full py-1">
            {/* Barcode 1 */}
            <div className="flex flex-col items-center">
              <div className="w-full h-8 flex items-center justify-between px-1 bg-white border border-neutral-300 py-1">
                {/* SVG Simulated Code 128 / EAN Barcode */}
                <svg viewBox="0 0 100 24" className="w-full h-full" preserveAspectRatio="none">
                  <rect x="0" y="0" width="3" height="24" fill="#000" />
                  <rect x="5" y="0" width="1" height="24" fill="#000" />
                  <rect x="8" y="0" width="4" height="24" fill="#000" />
                  <rect x="15" y="0" width="2" height="24" fill="#000" />
                  <rect x="20" y="0" width="5" height="24" fill="#000" />
                  <rect x="28" y="0" width="2" height="24" fill="#000" />
                  <rect x="33" y="0" width="1" height="24" fill="#000" />
                  <rect x="36" y="0" width="4" height="24" fill="#000" />
                  <rect x="43" y="0" width="2" height="24" fill="#000" />
                  <rect x="48" y="0" width="3" height="24" fill="#000" />
                  <rect x="54" y="0" width="5" height="24" fill="#000" />
                  <rect x="62" y="0" width="1" height="24" fill="#000" />
                  <rect x="66" y="0" width="4" height="24" fill="#000" />
                  <rect x="73" y="0" width="2" height="24" fill="#000" />
                  <rect x="78" y="0" width="6" height="24" fill="#000" />
                  <rect x="87" y="0" width="2" height="24" fill="#000" />
                  <rect x="92" y="0" width="3" height="24" fill="#000" />
                  <rect x="97" y="0" width="3" height="24" fill="#000" />
                </svg>
              </div>
              <span className="text-[8px] font-mono text-neutral-800 tracking-wider mt-0.5">
                {ticket.barcode1}
              </span>
            </div>

            {/* Barcode 2 */}
            <div className="flex flex-col items-center mt-2">
              <div className="w-full h-8 flex items-center justify-between px-1 bg-white border border-neutral-300 py-1">
                <svg viewBox="0 0 100 24" className="w-full h-full" preserveAspectRatio="none">
                  <rect x="2" y="0" width="2" height="24" fill="#000" />
                  <rect x="6" y="0" width="4" height="24" fill="#000" />
                  <rect x="12" y="0" width="2" height="24" fill="#000" />
                  <rect x="17" y="0" width="6" height="24" fill="#000" />
                  <rect x="26" y="0" width="1" height="24" fill="#000" />
                  <rect x="30" y="0" width="3" height="24" fill="#000" />
                  <rect x="36" y="0" width="5" height="24" fill="#000" />
                  <rect x="44" y="0" width="2" height="24" fill="#000" />
                  <rect x="49" y="0" width="4" height="24" fill="#000" />
                  <rect x="56" y="0" width="2" height="24" fill="#000" />
                  <rect x="61" y="0" width="5" height="24" fill="#000" />
                  <rect x="69" y="0" width="3" height="24" fill="#000" />
                  <rect x="75" y="0" width="2" height="24" fill="#000" />
                  <rect x="80" y="0" width="4" height="24" fill="#000" />
                  <rect x="87" y="0" width="3" height="24" fill="#000" />
                  <rect x="93" y="0" width="5" height="24" fill="#000" />
                </svg>
              </div>
              <span className="text-[8px] font-mono text-neutral-800 tracking-wider mt-0.5">
                {ticket.barcode2}
              </span>
            </div>
          </div>
        </div>

        {/* Perforated bottom tear strip */}
        <div className="border-t-2 border-dashed border-neutral-400 px-4 py-1.5 bg-[#EAE8E0] flex justify-between items-center text-[8px] font-mono text-neutral-600">
          <span>{ticket.seatOrGate || 'BAGGAGE CLAIM PASS'}</span>
          <span>PRINCIPE-AIRLINES</span>
        </div>
      </div>

      {/* Action shortcuts when card is selected / focused */}
      {showActions && (
        <div className="mt-3 flex items-center gap-2">
          {onEdit && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(ticket);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-xs font-mono transition-colors border border-white/20 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Editar Boleto</span>
            </button>
          )}

          {onViewOnMap && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onViewOnMap(ticket);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FACC15]/20 hover:bg-[#FACC15]/30 text-[#FACC15] rounded text-xs font-mono transition-colors border border-[#FACC15]/40 cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Ver en Mapa</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
