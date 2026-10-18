import React, { useState, useRef, useEffect } from 'react';
import { BoardingTicket } from '../types';
import { TicketCard } from './TicketCard';
import { X, Upload, Camera, Sparkles, Check, RefreshCw } from 'lucide-react';

interface TicketUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (ticket: BoardingTicket) => void;
  initialData?: Partial<BoardingTicket> | null;
  mode?: 'create' | 'edit';
}

export const TicketUploadModal: React.FC<TicketUploadModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  mode = 'create',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form States
  const [photoUrl, setPhotoUrl] = useState<string>(
    initialData?.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80'
  );
  const [photoFilter, setPhotoFilter] = useState<'halftone' | 'grayscale' | 'contrast' | 'none'>(
    initialData?.photoFilter || 'halftone'
  );
  const [status, setStatus] = useState<string>(initialData?.status || 'WINNER');
  const [departingCode, setDepartingCode] = useState<string>(initialData?.departingCode || 'AKL');
  const [departingCity, setDepartingCity] = useState<string>(initialData?.departingCity || 'Auckland');
  const [departingCountry, setDepartingCountry] = useState<string>(initialData?.departingCountry || '');
  const [departingRegion, setDepartingRegion] = useState<string>(initialData?.departingRegion || '');
  
  const [destinationCode, setDestinationCode] = useState<string>(initialData?.destinationCode || 'ICN');
  const [destinationCity, setDestinationCity] = useState<string>(initialData?.destinationCity || 'Seoul Incheon');
  const [destinationCountry, setDestinationCountry] = useState<string>(initialData?.destinationCountry || '');
  const [destinationRegion, setDestinationRegion] = useState<string>(initialData?.destinationRegion || '');

  const handleLookup = async (city: string, setCode: (c: string) => void, setCountry: (c: string) => void, setRegion: (r: string) => void) => {
    try {
      const res = await fetch(`/api/airport-lookup?city=${encodeURIComponent(city)}`);
      const data = await res.json();
      if (data && data.length > 0) {
        const airport = data[0];
        setCode(airport.iata_code || airport.icao_code || '');
        setCountry(airport.country_name || '');
        const country = airport.country_name.toLowerCase();
        let region = 'Europe';
        if (['france', 'spain', 'italy', 'germany', 'united kingdom'].includes(country)) region = 'Europe';
        else if (['japan', 'china', 'south korea', 'thailand'].includes(country)) region = 'Asia';
        else if (['usa', 'canada', 'brazil', 'argentina'].includes(country)) region = 'Americas';
        setRegion(region);
      }
    } catch (e) {
      console.error('Lookup failed', e);
    }
  };

  const [departingDate, setDepartingDate] = useState<string>(
    initialData?.departingDate || new Date().toISOString().split('T')[0]
  );
  const [returnDate, setReturnDate] = useState<string>(initialData?.returnDate || '');
  const [packageContents, setPackageContents] = useState<string>(initialData?.packageContents || 'HEONJUNG');
  const [forRecipient, setForRecipient] = useState<string>(initialData?.forRecipient || 'CATHY');
  const [carrierName, setCarrierName] = useState<string>(initialData?.carrierName || 'PRINCIPE AIRLINES');
  const [flightNumber, setFlightNumber] = useState<string>(initialData?.flightNumber || 'PA286');
  const [barcode1, setBarcode1] = useState<string>(
    initialData?.barcode1 || Math.floor(100000000000 + Math.random() * 900000000000).toString()
  );
  const [barcode2, setBarcode2] = useState<string>(
    initialData?.barcode2 || Math.floor(100000000000 + Math.random() * 900000000000).toString()
  );

  // Reset or initialize state when initialData changes
  useEffect(() => {
    if (initialData) {
      if (initialData.photoUrl) setPhotoUrl(initialData.photoUrl);
      if (initialData.photoFilter) setPhotoFilter(initialData.photoFilter);
      if (initialData.status) setStatus(initialData.status);
      if (initialData.departingCode) setDepartingCode(initialData.departingCode);
      if (initialData.departingCity) setDepartingCity(initialData.departingCity);
      if (initialData.destinationCode) setDestinationCode(initialData.destinationCode);
      if (initialData.destinationCity) setDestinationCity(initialData.destinationCity);
      if (initialData.departingDate) setDepartingDate(initialData.departingDate);
      if (initialData.returnDate !== undefined) setReturnDate(initialData.returnDate || '');
      if (initialData.packageContents) setPackageContents(initialData.packageContents);
      if (initialData.forRecipient) setForRecipient(initialData.forRecipient);
      if (initialData.carrierName) setCarrierName(initialData.carrierName);
      if (initialData.flightNumber) setFlightNumber(initialData.flightNumber);
      if (initialData.barcode1) setBarcode1(initialData.barcode1);
      if (initialData.barcode2) setBarcode2(initialData.barcode2);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  // File Upload Handler (FileReader base64)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotoUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const generateRandomBarcodes = () => {
    setBarcode1(Math.floor(100000000000 + Math.random() * 900000000000).toString());
    setBarcode2(Math.floor(100000000000 + Math.random() * 900000000000).toString());
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const ticketToSave: BoardingTicket = {
      id: initialData?.id || `ticket-${Date.now()}`,
      status,
      statusColor: status === 'WINNER' ? '#EAB308' : '#F97316',
      departingCode: departingCode.toUpperCase().trim(),
      departingCity: departingCity.trim(),
      destinationCode: destinationCode.toUpperCase().trim(),
      destinationCity: destinationCity.trim(),
      departingDate,
      returnDate: returnDate || undefined,
      packageContents: packageContents.toUpperCase().trim(),
      forRecipient: forRecipient.toUpperCase().trim(),
      photoUrl,
      photoFilter,
      barcode1,
      barcode2,
      carrierName,
      flightNumber,
      createdAt: initialData?.createdAt || new Date().toISOString(),
    };

    onSave(ticketToSave);
    onClose();
  };

  // Construct draft object for live preview
  const draftTicket: BoardingTicket = {
    id: initialData?.id || 'preview',
    status,
    statusColor: status === 'WINNER' ? '#EAB308' : '#F97316',
    departingCode: departingCode || 'AKL',
    departingCity: departingCity || 'Auckland',
    destinationCode: destinationCode || 'ICN',
    destinationCity: destinationCity || 'Seoul Incheon',
    departingDate: departingDate || '2026-11-14',
    returnDate: returnDate || undefined,
    packageContents: packageContents || 'PASSENGER',
    forRecipient: forRecipient || 'RECIPIENT',
    photoUrl,
    photoFilter,
    barcode1,
    barcode2,
    carrierName,
    flightNumber,
    createdAt: new Date().toISOString(),
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-[#121212] text-white border-2 border-[#FACC15]/40 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/15 bg-neutral-900">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-[#FACC15]" />
            <h3 className="font-display font-black text-lg sm:text-xl text-white uppercase tracking-wider">
              {mode === 'edit' ? 'Editar Boleto & Ubicación' : 'Subir Foto & Generar Boleto'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-white/60 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content: Split Screen Form & Live Preview */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Form Fields (7 cols) */}
          <form onSubmit={handleFormSubmit} className="lg:col-span-7 space-y-5">
            {/* 1. Photo Upload Dropzone */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#FACC15] font-bold mb-2">
                1. Foto del Pasajero / Experiencia *
              </label>
              
              <div
                onClick={() => fileInputRef.current?.click()}
                className="group relative border-2 border-dashed border-white/25 hover:border-[#FACC15] rounded-lg p-4 bg-white/5 hover:bg-white/10 transition-all cursor-pointer flex flex-col items-center justify-center text-center"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Upload className="w-8 h-8 text-[#FACC15] mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-sm font-semibold text-white">
                  Haz clic o arrastra tu foto aquí
                </p>
                <p className="text-xs text-white/50 mt-1">
                  Formatos soportados: JPG, PNG, WEBP (se convertirá en retrato con filtro de seguridad)
                </p>
              </div>

              {/* Photo Filter Selection */}
              <div className="mt-3 flex items-center gap-2 text-xs font-mono">
                <span className="text-white/60">Filtro de Foto:</span>
                {(['halftone', 'grayscale', 'contrast', 'none'] as const).map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setPhotoFilter(filter)}
                    className={`px-2.5 py-1 rounded transition-colors uppercase ${
                      photoFilter === filter
                        ? 'bg-[#FACC15] text-black font-bold'
                        : 'bg-white/10 hover:bg-white/20 text-white/80'
                    }`}
                  >
                    {filter === 'halftone' ? 'Halftone Dither' : filter}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Status Selection */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#FACC15] font-bold mb-2">
                2. Estado del Boleto
              </label>
              <div className="flex flex-wrap gap-2 text-xs font-mono">
                {['WINNER', 'ORDERED', 'VIP', 'IN TRANSIT'].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(s)}
                    className={`px-3 py-1.5 rounded transition-colors font-bold uppercase ${
                      status === s
                        ? s === 'WINNER'
                          ? 'bg-[#FACC15] text-black'
                          : 'bg-[#FB923C] text-black'
                        : 'bg-white/10 hover:bg-white/20 text-white/80'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Route & Locations (Departing -> Destination) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Departing */}
              <div className="p-3 bg-white/5 border border-white/10 rounded-lg space-y-2">
                <span className="text-[10px] font-mono font-bold text-white/50 uppercase tracking-wider">
                  Origen / Departing
                </span>
                <div>
                  <label className="block text-[11px] text-white/70">Ciudad</label>
                  <input
                    type="text"
                    value={departingCity}
                    onChange={(e) => setDepartingCity(e.target.value)}
                    onBlur={() => handleLookup(departingCity, setDepartingCode, setDepartingCountry, setDepartingRegion)}
                    className="w-full px-2.5 py-1.5 bg-black border border-white/20 rounded text-white text-xs focus:border-[#FACC15] focus:outline-none"
                    placeholder="Auckland"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-white/70">Código (IATA)</label>
                  <input
                    type="text"
                    maxLength={4}
                    value={departingCode}
                    onChange={(e) => setDepartingCode(e.target.value.toUpperCase())}
                    className="w-full px-2.5 py-1.5 bg-black border border-white/20 rounded font-mono font-bold text-white text-sm focus:border-[#FACC15] focus:outline-none uppercase"
                    placeholder="AKL"
                    required
                  />
                </div>
              </div>

              {/* Destination */}
              <div className="p-3 bg-white/5 border border-white/10 rounded-lg space-y-2">
                <span className="text-[10px] font-mono font-bold text-white/50 uppercase tracking-wider">
                  Destino / Destination
                </span>
                <div>
                  <label className="block text-[11px] text-white/70">Ciudad</label>
                  <input
                    type="text"
                    value={destinationCity}
                    onChange={(e) => setDestinationCity(e.target.value)}
                    onBlur={() => handleLookup(destinationCity, setDestinationCode, setDestinationCountry, setDestinationRegion)}
                    className="w-full px-2.5 py-1.5 bg-black border border-white/20 rounded text-white text-xs focus:border-[#FACC15] focus:outline-none"
                    placeholder="Seoul Incheon"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-white/70">Código (IATA)</label>
                  <input
                    type="text"
                    maxLength={4}
                    value={destinationCode}
                    onChange={(e) => setDestinationCode(e.target.value.toUpperCase())}
                    className="w-full px-2.5 py-1.5 bg-black border border-white/20 rounded font-mono font-bold text-white text-sm focus:border-[#FACC15] focus:outline-none uppercase"
                    placeholder="ICN"
                    required
                  />
                </div>
              </div>
            </div>

            {/* 4. Dates & Flight Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-white/70 mb-1">
                  Fecha de Salida (DEP) *
                </label>
                <input
                  type="date"
                  value={departingDate}
                  onChange={(e) => setDepartingDate(e.target.value)}
                  className="w-full px-3 py-2 bg-black border border-white/20 rounded text-white text-xs focus:border-[#FACC15] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-white/70 mb-1">
                  Fecha de Regreso (Opcional)
                </label>
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full px-3 py-2 bg-black border border-white/20 rounded text-white text-xs focus:border-[#FACC15] focus:outline-none"
                />
              </div>
            </div>

            {/* 5. Passenger Names (Package Contents & For Recipient) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-white/70 mb-1">
                  Package Contents / Pasajero *
                </label>
                <input
                  type="text"
                  value={packageContents}
                  onChange={(e) => setPackageContents(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 bg-black border border-white/20 rounded text-white text-sm font-bold font-display uppercase focus:border-[#FACC15] focus:outline-none"
                  placeholder="HEONJUNG"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-white/70 mb-1">
                  For / Destinatario *
                </label>
                <input
                  type="text"
                  value={forRecipient}
                  onChange={(e) => setForRecipient(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 bg-black border border-white/20 rounded text-white text-sm font-bold font-display uppercase focus:border-[#FACC15] focus:outline-none"
                  placeholder="CATHY"
                  required
                />
              </div>
            </div>

            {/* 6. Airline & Barcodes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-mono uppercase text-white/70 mb-1">
                  Aerolínea / Carrier
                </label>
                <input
                  type="text"
                  value={carrierName}
                  onChange={(e) => setCarrierName(e.target.value)}
                  className="w-full px-3 py-2 bg-black border border-white/20 rounded text-white text-xs focus:border-[#FACC15] focus:outline-none"
                  placeholder="PRINCIPE AIRLINES"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={generateRandomBarcodes}
                  className="w-full py-2 px-3 bg-white/10 hover:bg-white/20 text-white/80 hover:text-white rounded text-xs font-mono flex items-center justify-center gap-2 border border-white/20"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Regenerar Códigos de Barra</span>
                </button>
              </div>
            </div>

            {/* Submit & Cancel Buttons */}
            <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/15">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded text-xs font-mono uppercase tracking-wider"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#FACC15] hover:bg-[#EAB308] text-black font-bold text-xs font-mono uppercase tracking-wider rounded shadow-lg transition-transform active:scale-95"
              >
                {mode === 'edit' ? 'Guardar Cambios' : 'Crear y Publicar Boleto'}
              </button>
            </div>
          </form>

          {/* Right Column: Live Interactive Ticket Card Preview (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 bg-black/40 rounded-xl border border-white/10">
            <div className="text-xs font-mono text-white/60 mb-3 uppercase tracking-widest text-center">
              VISTA PREVIA EN VIVO
            </div>
            
            <div className="transform scale-95 sm:scale-100 transition-transform">
              <TicketCard ticket={draftTicket} isFocused showActions={false} />
            </div>

            <p className="text-[11px] font-mono text-white/40 text-center mt-4 max-w-xs">
              Al guardar, este boleto se incorporará inmediatamente al Carrusel 3D Cover Flow y se posicionará en el mapa de vuelos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
