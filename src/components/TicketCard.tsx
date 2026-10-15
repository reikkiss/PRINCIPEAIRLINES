import React from 'react';
import { BoardingTicket } from '../types';
import { Edit3, MapPin, Crown, Heart } from 'lucide-react';

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

  // Format dates for display
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  // Ensure carrier name is PRINCIPE AIRLINES
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
      {/* Status indicator tag above ticket (Warm terracotta & marigold palette) */}
      <div className="mb-2.5 text-center">
        <div className="text-[10px] tracking-widest font-mono uppercase text-amber-200/70 leading-none">
          PASAJERO VIP:
        </div>
        <div className="text-sm sm:text-base font-mono font-black tracking-widest uppercase text-amber-300 drop-shadow-[0_2px_8px_rgba(244,166,42,0.4)] flex items-center justify-center gap-1.5 mt-0.5">
          <Crown className="w-3.5 h-3.5 fill-amber-300 text-amber-400" />
          <span>{ticket.status}</span>
        </div>
      </div>

      {/* The physical paper ticket card: Roman Arch Top matching reference image */}
      <div 
        className={`relative w-[280px] sm:w-[320px] md:w-[360px] bg-[#FBF8F1] text-[#121212] shape-arch overflow-hidden shadow-2xl transition-all duration-300 border-2 border-white/60`}
        style={{
          boxShadow: isFocused 
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 35px rgba(224, 90, 54, 0.25)' 
            : '0 15px 30px -10px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Top Candy Stripe / Pattern Bar (Mediterranean Terracotta & Cream Stripes) */}
        <div className="h-3 w-full pattern-stripes-terracotta border-b border-[#E05A36]/30" />

        {/* Top Header Bar: Mediterranean Navy with Gold King Crown */}
        <div className="bg-[#0E2340] text-white px-5 py-3 flex items-center justify-between border-b-2 border-amber-400/40">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-amber-400/20 border border-amber-300/50 flex items-center justify-center">
              <Crown className="w-4 h-4 text-amber-300 fill-amber-300" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[10px] font-mono font-black tracking-wider text-amber-200">PRINCIPE</span>
              <span className="text-[7px] font-mono text-white/70 tracking-widest uppercase">AIRLINES</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-right">
            <div className="flex flex-col items-end leading-none">
              <span className="text-[8px] font-mono font-bold tracking-widest uppercase text-amber-300">
                SPECIAL CLASS
              </span>
              <span className="text-[8px] text-white/80 font-mono tracking-wider mt-0.5">
                {displayFlight.startsWith('FLIGHT') ? displayFlight : `FLIGHT ${displayFlight}`}
              </span>
            </div>
          </div>
        </div>

        {/* Departure & Destination Row */}
        <div className="px-5 pt-3.5 pb-2.5 border-b border-[#EADFCB] bg-[#FFFDF7]">
          <div className="flex justify-between text-[9px] font-mono font-semibold text-neutral-500 uppercase tracking-wider">
            <span>Origen: <strong className="text-[#0E2340]">{ticket.departingCity}</strong></span>
            <span>Destino: <strong className="text-[#E05A36]">{ticket.destinationCity}</strong></span>
          </div>

          {/* Airport Codes with stylized arrow */}
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-3xl sm:text-4xl font-black font-display tracking-tight text-[#0E2340]">
              {ticket.departingCode}
            </span>
            <div className="flex items-center gap-1 text-[#E05A36] font-bold text-2xl sm:text-3xl">
              <span className="inline-block transform scale-x-125">✈</span>
            </div>
            <span className="text-3xl sm:text-4xl font-black font-display tracking-tight text-[#E05A36]">
              {ticket.destinationCode}
            </span>
          </div>

          {/* Departure Date and details */}
          <div className="flex justify-between items-center mt-1 text-[9px] font-mono text-neutral-600">
            <span>VUELO: {formatDate(ticket.departingDate)}</span>
            {ticket.returnDate && <span>REGRESO: {formatDate(ticket.returnDate)}</span>}
          </div>
        </div>

        {/* Passenger Name / Package Contents */}
        <div className="px-5 py-2.5 border-b border-[#EADFCB] bg-[#FBF8F1]">
          <div className="text-[8px] font-mono uppercase tracking-wider text-neutral-400">
            Pasajero & Compañero de Viaje:
          </div>
          <div className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[#0E2340] font-display leading-tight flex items-center justify-between">
            <span>{ticket.packageContents || 'MI PRÍNCIPE'}</span>
            <Heart className="w-4 h-4 fill-[#FA8B69] text-[#FA8B69]" />
          </div>
        </div>

        {/* Dedicated for Boyfriend */}
        <div className="px-5 py-2 border-b border-[#EADFCB] bg-[#FFFDF7] flex justify-between items-center">
          <div>
            <span className="text-[8px] font-mono uppercase tracking-wider text-neutral-400 block">Dedicado a:</span>
            <span className="text-sm font-bold uppercase tracking-tight text-[#E05A36] font-display">
              {ticket.forRecipient || 'EL AMOR DE MI VIDA'}
            </span>
          </div>
          <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold border border-amber-300/60">
            PRIMERA CLASE
          </span>
        </div>

        {/* Bottom Section: Biometric Photo + Barcodes */}
        <div className="p-4 grid grid-cols-2 gap-3 items-center bg-[#F6F1E5]">
          {/* Passenger Photo Container with warm film aesthetic */}
          <div className="relative aspect-[4/5] bg-neutral-900 rounded-lg overflow-hidden border-2 border-white shadow-md group">
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
                  : 'contrast-110 brightness-100' // vibrant Mediterranean warmth
              }`}
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            {/* Halftone / scanline overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            
            <div className="absolute bottom-1 left-1.5 text-[7px] font-mono font-bold text-white uppercase tracking-widest bg-[#E05A36]/85 px-1.5 py-0.5 rounded">
              VERIFICADO
            </div>
          </div>

          {/* Barcodes & Numbers */}
          <div className="flex flex-col justify-between h-full py-1">
            {/* Barcode 1 */}
            <div className="flex flex-col items-center">
              <div className="w-full h-8 flex items-center justify-between px-1 bg-white border border-[#EADFCB] py-1 rounded">
                <svg viewBox="0 0 100 24" className="w-full h-full" preserveAspectRatio="none">
                  <rect x="0" y="0" width="3" height="24" fill="#0E2340" />
                  <rect x="5" y="0" width="1" height="24" fill="#0E2340" />
                  <rect x="8" y="0" width="4" height="24" fill="#0E2340" />
                  <rect x="15" y="0" width="2" height="24" fill="#0E2340" />
                  <rect x="20" y="0" width="5" height="24" fill="#0E2340" />
                  <rect x="28" y="0" width="2" height="24" fill="#0E2340" />
                  <rect x="33" y="0" width="1" height="24" fill="#0E2340" />
                  <rect x="36" y="0" width="4" height="24" fill="#0E2340" />
                  <rect x="43" y="0" width="2" height="24" fill="#0E2340" />
                  <rect x="48" y="0" width="3" height="24" fill="#0E2340" />
                  <rect x="54" y="0" width="5" height="24" fill="#0E2340" />
                  <rect x="62" y="0" width="1" height="24" fill="#0E2340" />
                  <rect x="66" y="0" width="4" height="24" fill="#0E2340" />
                  <rect x="73" y="0" width="2" height="24" fill="#0E2340" />
                  <rect x="78" y="0" width="6" height="24" fill="#0E2340" />
                  <rect x="87" y="0" width="2" height="24" fill="#0E2340" />
                  <rect x="92" y="0" width="3" height="24" fill="#0E2340" />
                  <rect x="97" y="0" width="3" height="24" fill="#0E2340" />
                </svg>
              </div>
              <span className="text-[8px] font-mono text-neutral-700 tracking-wider mt-0.5">
                {ticket.barcode1}
              </span>
            </div>

            {/* Barcode 2 */}
            <div className="flex flex-col items-center mt-2">
              <div className="w-full h-8 flex items-center justify-between px-1 bg-white border border-[#EADFCB] py-1 rounded">
                <svg viewBox="0 0 100 24" className="w-full h-full" preserveAspectRatio="none">
                  <rect x="2" y="0" width="2" height="24" fill="#0E2340" />
                  <rect x="6" y="0" width="4" height="24" fill="#0E2340" />
                  <rect x="12" y="0" width="2" height="24" fill="#0E2340" />
                  <rect x="17" y="0" width="6" height="24" fill="#0E2340" />
                  <rect x="26" y="0" width="1" height="24" fill="#0E2340" />
                  <rect x="30" y="0" width="3" height="24" fill="#0E2340" />
                  <rect x="36" y="0" width="5" height="24" fill="#0E2340" />
                  <rect x="44" y="0" width="2" height="24" fill="#0E2340" />
                  <rect x="49" y="0" width="4" height="24" fill="#0E2340" />
                  <rect x="56" y="0" width="2" height="24" fill="#0E2340" />
                  <rect x="61" y="0" width="5" height="24" fill="#0E2340" />
                  <rect x="69" y="0" width="3" height="24" fill="#0E2340" />
                  <rect x="75" y="0" width="2" height="24" fill="#0E2340" />
                  <rect x="80" y="0" width="4" height="24" fill="#0E2340" />
                  <rect x="87" y="0" width="3" height="24" fill="#0E2340" />
                  <rect x="93" y="0" width="5" height="24" fill="#0E2340" />
                </svg>
              </div>
              <span className="text-[8px] font-mono text-neutral-700 tracking-wider mt-0.5">
                {ticket.barcode2}
              </span>
            </div>
          </div>
        </div>

        {/* Perforated bottom tear strip */}
        <div className="border-t-2 border-dashed border-[#D5C9B3] px-4 py-2 bg-[#EFE9DC] flex justify-between items-center text-[8px] font-mono text-neutral-700">
          <span>{ticket.seatOrGate || 'PASEO JUNTOS · ASIENTO VIP'}</span>
          <span className="font-bold text-[#E05A36]">PRINCIPE-AIRLINES</span>
        </div>
      </div>

      {/* Action shortcuts when card is selected / focused */}
      {showActions && (
        <div className="mt-3.5 flex items-center gap-2">
          {onEdit && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(ticket);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-full text-xs font-mono transition-colors border border-white/25 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-300" />
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
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#E05A36] hover:bg-[#C84B2B] text-white rounded-full text-xs font-mono font-bold tracking-wider transition-all shadow-md cursor-pointer border border-[#FA8B69]/40"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-300" />
              <span>Ver en Mapa</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
