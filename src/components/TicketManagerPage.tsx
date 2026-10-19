import React, { useState, useRef } from 'react';
import { BoardingTicket, DestinationItem, TravelLetter } from '../types';
import { TicketCard } from './TicketCard';
import { LetterCard } from './LetterCard';
import { FutureDestinationsList } from './FutureDestinationsList';
import { compressImage } from '../utils/imageCompressor';
import { 
  Upload, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Copy, 
  RotateCcw, 
  Eye, 
  Layers, 
  ArrowLeft,
  Lock,
  CheckCircle2,
  Mail,
  MapPin,
  Heart,
  Sparkles
} from 'lucide-react';

interface TicketManagerPageProps {
  tickets: BoardingTicket[];
  destinations: DestinationItem[];
  letters: TravelLetter[];
  heroImage?: string;
  onUpdateHeroImage?: (imageUrl: string) => void;
  onAddTicket: (ticket: BoardingTicket) => void;
  onUpdateTicket: (ticket: BoardingTicket) => void;
  onDeleteTicket: (ticketId: string) => void;
  onSelectTicketFor3D: (ticket: BoardingTicket) => void;
  onOpenUploadModal: (prefill?: Partial<BoardingTicket>) => void;
  onToggleDestination: (destId: string) => void;
  onAddDestination: (destination: Omit<DestinationItem, 'id'>) => void;
  onDeleteDestination: (destId: string) => void;
  onAddLetter: (letter: TravelLetter) => void;
  onUpdateLetter: (letter: TravelLetter) => void;
  onDeleteLetter: (letterId: string) => void;
  onOpenLetterEditor: (prefill?: Partial<TravelLetter>) => void;
  onOpenLetterReader: (letter: TravelLetter) => void;
  onBackToMain: () => void;
  onLockSession: () => void;
  onClearDemoContent?: () => Promise<void> | void;
  onDeleteAllDestinations?: () => Promise<void> | void;
  onDeleteAllTickets?: () => Promise<void> | void;
  onDeleteAllLetters?: () => Promise<void> | void;
}

export const TicketManagerPage: React.FC<TicketManagerPageProps> = ({
  tickets,
  destinations,
  letters,
  heroImage,
  onUpdateHeroImage,
  onAddTicket,
  onDeleteTicket,
  onSelectTicketFor3D,
  onOpenUploadModal,
  onToggleDestination,
  onAddDestination,
  onDeleteDestination,
  onAddLetter,
  onDeleteLetter,
  onOpenLetterEditor,
  onOpenLetterReader,
  onBackToMain,
  onLockSession,
  onClearDemoContent,
  onDeleteAllDestinations,
  onDeleteAllTickets,
  onDeleteAllLetters,
}) => {
  const [activeTab, setActiveTab] = useState<'tickets' | 'destinations' | 'letters' | 'portada'>('tickets');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [batchUploadNotice, setBatchUploadNotice] = useState<string | null>(null);
  const batchInputRef = useRef<HTMLInputElement>(null);

  // Filter tickets
  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      t.packageContents.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.forRecipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.destinationCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.destinationCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.departingCode.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === 'all' || t.status.toUpperCase() === selectedStatus.toUpperCase();

    return matchesSearch && matchesStatus;
  });

  // Handle Multiple / Batch Image Uploads with client-side compression to satisfy Firestore limits
  const handleBatchImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    const total = fileList.length;
    setBatchUploadNotice(`Comprimiendo y procesando ${total} imágenes para la base de datos...`);

    let processed = 0;
    for (let index = 0; index < fileList.length; index++) {
      const file = fileList[index];
      try {
        const photoUrl = await compressImage(file, 800, 800, 0.7);
        const cleanName =
          file.name.split('.')[0].replace(/[^a-zA-Z0-9]/g, ' ').toUpperCase() ||
          `PASSENGER ${index + 1}`;

        const newTicket: BoardingTicket = {
          id: `ticket-${Date.now()}-${index}`,
          status: index % 2 === 0 ? 'WINNER' : 'ORDERED',
          statusColor: index % 2 === 0 ? '#EAB308' : '#FB923C',
          departingCode: 'AKL',
          departingCity: 'Auckland',
          destinationCode: index % 3 === 0 ? 'ICN' : index % 3 === 1 ? 'LHR' : 'CDG',
          destinationCity: index % 3 === 0 ? 'Seoul Incheon' : index % 3 === 1 ? 'London' : 'Paris',
          departingDate: new Date(Date.now() + index * 86400000 * 7).toISOString().split('T')[0],
          packageContents: cleanName.slice(0, 16),
          forRecipient: 'VIP TRAVELER',
          photoUrl,
          photoFilter: 'halftone',
          barcode1: Math.floor(100000000000 + Math.random() * 900000000000).toString(),
          barcode2: Math.floor(100000000000 + Math.random() * 900000000000).toString(),
          carrierName: 'PRINCIPE AIRLINES',
          flightNumber: `PA${Math.floor(200 + Math.random() * 700)}`,
          createdAt: new Date().toISOString(),
        };

        onAddTicket(newTicket);
        processed += 1;
      } catch (err) {
        console.error('Error compressing batch image:', err);
      }
    }

    if (processed > 0) {
      setBatchUploadNotice(`¡Se crearon y guardaron ${processed} nuevos boletos con éxito!`);
      setTimeout(() => setBatchUploadNotice(null), 5000);
    }
    if (batchInputRef.current) batchInputRef.current.value = '';
  };

  const handleDuplicateTicket = (ticket: BoardingTicket) => {
    const duplicated: BoardingTicket = {
      ...ticket,
      id: `ticket-${Date.now()}`,
      packageContents: `${ticket.packageContents} (COPIA)`,
      createdAt: new Date().toISOString(),
    };
    onAddTicket(duplicated);
  };

  const handleDuplicateLetter = (letter: TravelLetter) => {
    const duplicated: TravelLetter = {
      ...letter,
      id: `letter-${Date.now()}`,
      title: `${letter.title} (Copia)`,
      createdAt: new Date().toISOString(),
    };
    onAddLetter(duplicated);
  };

  return (
    <div className="w-full bg-[#FAF9F5] text-[#121212] min-h-screen p-4 sm:p-6 md:p-10 flex flex-col justify-between">
      <div>
        {/* Navigation Top Bar: Return to Main & Security Session */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-neutral-300">
          <button
            type="button"
            onClick={onBackToMain}
            className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-black text-white rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a la Galería Principal</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-mono font-bold border border-emerald-300">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Sesión Autorizada (02/12/2026)</span>
            </div>

            <button
              type="button"
              onClick={onLockSession}
              className="px-3 py-1.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 rounded-lg text-xs font-mono transition-colors cursor-pointer"
            >
              Bloquear / Salir
            </button>
          </div>
        </div>

        {/* Studio Sub-Navigation Tabs: Boletos vs Destinos vs Cartas */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('tickets')}
            className={`px-4 py-2 rounded-lg font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'tickets'
                ? 'bg-[#0E2340] text-white shadow-md'
                : 'bg-neutral-200 hover:bg-neutral-300 text-neutral-800'
            }`}
          >
            Boletos & Fotos ({tickets.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('letters')}
            className={`px-4 py-2 rounded-lg font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'letters'
                ? 'bg-[#E05A36] text-white shadow-md'
                : 'bg-neutral-200 hover:bg-neutral-300 text-neutral-800'
            }`}
          >
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>Cartas de Amor ({letters.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('destinations')}
            className={`px-4 py-2 rounded-lg font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'destinations'
                ? 'bg-[#0E2340] text-white shadow-md'
                : 'bg-neutral-200 hover:bg-neutral-300 text-neutral-800'
            }`}
          >
            Ciudades & Destinos ({destinations.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('portada')}
            className={`px-4 py-2 rounded-lg font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'portada'
                ? 'bg-[#F4A62A] text-[#0E2340] shadow-md font-black'
                : 'bg-neutral-200 hover:bg-neutral-300 text-neutral-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Foto de Portada</span>
          </button>
        </div>

        {/* TAB 1: TICKETS */}
        {activeTab === 'tickets' && (
          <>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
              <div>
                <div className="text-xs font-mono font-bold text-[#0E2340] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-amber-500" />
                  <span>PRINCIPE AIRLINES · PANEL DE CONTROL DE BOLETOS</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-black font-display tracking-tight text-neutral-900">
                  Subir Fotos y Editar Información
                </h1>
                <p className="text-sm text-neutral-600 mt-1 max-w-2xl font-sans">
                  Sube fotos individuales o en lote, edita fechas, rutas de vuelo y nombres de pasajeros.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <input
                  ref={batchInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleBatchImageUpload}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => batchInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-neutral-900 hover:bg-black text-white font-mono font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow cursor-pointer"
                >
                  <Upload className="w-4 h-4 text-[#FACC15]" />
                  <span>Subir Fotos en Lote</span>
                </button>

                <button
                  type="button"
                  onClick={() => onOpenUploadModal()}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#E05A36] hover:bg-[#C84B2B] text-white font-mono font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-md cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Crear Boleto</span>
                </button>


              </div>
            </div>

            {batchUploadNotice && (
              <div className="my-4 p-4 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-lg text-sm font-mono flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>{batchUploadNotice}</span>
              </div>
            )}

            <div
              onClick={() => batchInputRef.current?.click()}
              className="my-6 p-6 border-2 border-dashed border-neutral-300 hover:border-[#E05A36] bg-white rounded-xl text-center cursor-pointer transition-colors group shadow-sm"
            >
              <Upload className="w-10 h-10 mx-auto text-[#E05A36] mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="text-base font-bold text-neutral-900 font-display">
                Subir Múltiples Imágenes para Nuevos Boletos
              </h3>
              <p className="text-xs text-neutral-500 mt-1 max-w-md mx-auto">
                Arrastra varias fotos o haz clic aquí. Se creará automáticamente un boleto con código de barras y filtro biométrico para cada imagen.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 my-6 pb-2">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Buscar por pasajero, ciudad o IATA..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-neutral-300 rounded-lg text-xs font-mono focus:outline-none focus:border-[#0015ff]"
                />
              </div>

              <div className="flex items-center gap-2 text-xs font-mono self-start sm:self-auto">
                <span className="text-neutral-500">Estado:</span>
                {['all', 'WINNER', 'ORDERED'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setSelectedStatus(st)}
                    className={`px-3 py-1.5 rounded transition-colors uppercase font-bold cursor-pointer ${
                      selectedStatus === st
                        ? 'bg-neutral-900 text-white'
                        : 'bg-neutral-200 hover:bg-neutral-300 text-neutral-700'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTickets.length === 0 ? (
                <div className="col-span-full py-16 text-center text-neutral-500 font-mono">
                  No se encontraron boletos con los criterios de búsqueda.
                </div>
              ) : (
                filteredTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="bg-white border border-neutral-300 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all flex flex-col justify-between p-4 group"
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-neutral-200 text-xs font-mono">
                        <span className={`font-black uppercase ${ticket.status === 'WINNER' ? 'text-amber-600' : 'text-orange-600'}`}>
                          ● {ticket.status}
                        </span>
                        <span className="text-neutral-400 text-[10px]">
                          {ticket.flightNumber || 'FLIGHT'}
                        </span>
                      </div>

                      <div className="transform scale-[0.82] origin-top my-1">
                        <TicketCard ticket={ticket} showActions={false} isFocused />
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-neutral-200 grid grid-cols-4 gap-1 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          onSelectTicketFor3D(ticket);
                          onBackToMain();
                        }}
                        title="Ver en Carrusel 3D"
                        className="p-2 hover:bg-neutral-100 rounded text-neutral-700 hover:text-[#0015ff] flex flex-col items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="text-[9px] font-mono">3D</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onOpenUploadModal(ticket)}
                        title="Editar Información, Fotos y Fechas"
                        className="p-2 hover:bg-neutral-100 rounded text-neutral-700 hover:text-black flex flex-col items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4" />
                        <span className="text-[9px] font-mono">Editar</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDuplicateTicket(ticket)}
                        title="Duplicar Boleto"
                        className="p-2 hover:bg-neutral-100 rounded text-neutral-700 hover:text-black flex flex-col items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Copy className="w-4 h-4" />
                        <span className="text-[9px] font-mono">Copiar</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onDeleteTicket(ticket.id)}
                        title="Eliminar Boleto"
                        className="p-2 hover:bg-red-50 rounded text-neutral-400 hover:text-red-600 flex flex-col items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="text-[9px] font-mono">Borrar</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* TAB 2: LETTERS (CARTAS DE VIAJE) */}
        {activeTab === 'letters' && (
          <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
              <div>
                <div className="text-xs font-mono font-bold text-rose-600 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Heart className="w-4 h-4 fill-rose-600" />
                  <span>BUZÓN & GESTOR DE CARTAS DE AMOR PARA MI NOVIO</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-black font-display tracking-tight text-neutral-900">
                  Cartas de Amor Guardadas
                </h1>
                <p className="text-sm text-neutral-600 mt-1 max-w-2xl font-sans">
                  Redacta cartas de amor para tu novio, adjunta fotografías de sus recuerdos juntos y guárdalas aquí. Él podrá entrar en cualquier momento a la página principal para abrirlas y leerlas en su buzón especial.
                </p>
              </div>

              {/* Botón para Crear Carta de Amor */}
              <button
                type="button"
                onClick={() => onOpenLetterEditor()}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Escribir Carta de Amor</span>
              </button>
            </div>

            {/* Letters Grid in Admin */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {letters.length === 0 ? (
                <div className="col-span-full py-16 text-center text-neutral-500 font-mono text-sm bg-white rounded-xl border border-rose-200">
                  Aún no has escrito ninguna carta de amor. Presiona "+ Escribir Carta de Amor" para redactar la primera y sorprender a tu novio.
                </div>
              ) : (
                letters.map((letter) => (
                  <div key={letter.id} className="relative flex flex-col justify-between bg-white rounded-xl border border-neutral-300 p-2 shadow-sm hover:shadow-md">
                    <LetterCard letter={letter} onOpen={() => onOpenLetterReader(letter)} />
                    
                    {/* Admin Actions Bar on Card */}
                    <div className="mt-2 pt-2 border-t border-neutral-200 flex items-center justify-end gap-2 px-2 text-xs font-mono">
                      <button
                        type="button"
                        onClick={() => onOpenLetterEditor(letter)}
                        className="p-1.5 hover:bg-neutral-100 rounded text-neutral-700 hover:text-black flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Editar</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDuplicateLetter(letter)}
                        className="p-1.5 hover:bg-neutral-100 rounded text-neutral-700 hover:text-black flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onDeleteLetter(letter.id)}
                        className="p-1.5 hover:bg-red-50 rounded text-neutral-400 hover:text-red-600 flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Borrar</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 3: DESTINATIONS */}
        {activeTab === 'destinations' && (
          <div>
            <FutureDestinationsList
              destinations={destinations}
              tickets={tickets}
              onToggleDestination={onToggleDestination}
              onOpenUploadForDestination={(dest) =>
                onOpenUploadModal({
                  destinationCity: dest.city,
                  destinationCode: dest.code,
                  departingDate: dest.targetDate || new Date().toISOString().split('T')[0],
                })
              }
              onAddDestination={onAddDestination}
              onDeleteDestination={onDeleteDestination}
            />
          </div>
        )}

        {/* TAB 4: HERO PORTADA */}
        {activeTab === 'portada' && (
          <div className="space-y-6">
            <div className="pb-6 border-b border-neutral-200">
              <div className="text-xs font-mono font-bold text-[#E05A36] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>PRINCIPE AIRLINES · FOTO DE PORTADA PRINCIPAL</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black font-display tracking-tight text-neutral-900">
                Ajustar Imagen de Portada Hero
              </h1>
              <p className="text-sm text-neutral-600 mt-1 max-w-2xl font-sans">
                Personaliza la imagen principal que da la bienvenida a tu novio. Puedes subir una foto personal de ustedes juntos, pegar un enlace de imagen o restaurar la colección estética de papelería mediterránea.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              {/* Preview */}
              <div className="bg-white p-4 rounded-2xl border-2 border-neutral-300 shadow-sm">
                <span className="text-xs font-mono text-neutral-500 uppercase tracking-wider block mb-2 font-bold">
                  Vista Previa Actual
                </span>
                <div className="relative aspect-[16/9] rounded-xl overflow-hidden border-2 border-white shadow-md bg-neutral-900">
                  <img
                    src={heroImage || '/src/assets/images/mediterranean_love_stationery_1792013872743.jpg'}
                    alt="Portada Hero"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              {/* Upload Controls */}
              <div className="space-y-5 bg-white p-6 rounded-2xl border border-neutral-300 shadow-sm">
                <div>
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-700 block mb-2">
                    Subir Foto desde tu Dispositivo
                  </label>
                  <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#E05A36] hover:bg-[#C84B2B] text-white rounded-lg font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow">
                    <Upload className="w-4 h-4 text-amber-300" />
                    <span>Seleccionar Nueva Foto</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const compressed = await compressImage(file, 1200, 1200, 0.75);
                            if (compressed && onUpdateHeroImage) {
                              onUpdateHeroImage(compressed);
                            }
                          } catch (err) {
                            console.error('Error compressing hero image', err);
                          }
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                  <p className="text-[11px] text-neutral-500 mt-1 font-mono">
                    Formatos recomendados: JPG, PNG o WEBP.
                  </p>
                </div>

                <div className="pt-4 border-t border-neutral-200">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-700 block mb-2">
                    O Ingresar Enlace de Imagen (URL)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="https://..."
                      defaultValue={heroImage || ''}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const val = (e.target as HTMLInputElement).value;
                          if (val && onUpdateHeroImage) onUpdateHeroImage(val);
                        }
                      }}
                      className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg text-xs font-mono focus:outline-none focus:border-[#E05A36]"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-200">
                  <button
                    type="button"
                    onClick={() => {
                      if (onUpdateHeroImage) {
                        onUpdateHeroImage('/src/assets/images/mediterranean_love_stationery_1792013872743.jpg');
                      }
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg font-mono text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border border-neutral-300"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                    <span>Restaurar Imagen de Colección Mediterránea</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
