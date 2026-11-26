import React, { useState, useEffect, useRef } from 'react';
import { BoardingTicket } from '../types';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Upload, 
  Trash2, 
  Camera, 
  Calendar, 
  Crown, 
  Plane
} from 'lucide-react';
import { compressImage } from '../utils/imageCompressor';
import { formatDisplayDate } from '../utils/dateFormat';

interface TripPhotosModalProps {
  ticket: BoardingTicket | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateTicket?: (updatedTicket: BoardingTicket) => void;
  canEdit?: boolean;
}

export const TripPhotosModal: React.FC<TripPhotosModalProps> = ({
  ticket,
  isOpen,
  onClose,
  onUpdateTicket,
  canEdit = false,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Collect all photos: ticket.photoUrl (if valid) + galleryPhotos
  const allPhotos: string[] = React.useMemo(() => {
    if (!ticket) return [];
    const photos: string[] = [];
    if (ticket.photoUrl) {
      photos.push(ticket.photoUrl);
    }
    if (ticket.galleryPhotos && Array.isArray(ticket.galleryPhotos)) {
      ticket.galleryPhotos.forEach((p) => {
        if (p && !photos.includes(p)) {
          photos.push(p);
        }
      });
    }
    return photos;
  }, [ticket]);

  // Reset index when ticket changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
    }
  }, [isOpen, ticket?.id]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && allPhotos.length > 1) {
        setCurrentIndex((prev) => (prev + 1) % allPhotos.length);
      }
      if (e.key === 'ArrowLeft' && allPhotos.length > 1) {
        setCurrentIndex((prev) => (prev - 1 + allPhotos.length) % allPhotos.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, allPhotos.length, onClose]);

  if (!isOpen || !ticket) return null;

  const currentPhoto = allPhotos[currentIndex] || ticket.photoUrl;

  const handleNext = () => {
    if (allPhotos.length > 1) {
      setCurrentIndex((prev) => (prev + 1) % allPhotos.length);
    }
  };

  const handlePrev = () => {
    if (allPhotos.length > 1) {
      setCurrentIndex((prev) => (prev - 1 + allPhotos.length) % allPhotos.length);
    }
  };

  const handleUploadPhotos = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !onUpdateTicket) return;

    setIsUploading(true);
    const newPhotos: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const compressed = await compressImage(file, 900, 900, 0.65);
        if (compressed) {
          newPhotos.push(compressed);
        }
      }

      if (newPhotos.length > 0) {
        const existingGallery = ticket.galleryPhotos || [];
        const updatedTicket: BoardingTicket = {
          ...ticket,
          galleryPhotos: [...existingGallery, ...newPhotos],
        };
        onUpdateTicket(updatedTicket);
        // Point to the first newly added photo
        setCurrentIndex(allPhotos.length);
      }
    } catch (err) {
      console.error('Error uploading trip photos', err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeleteCurrentPhoto = () => {
    if (!onUpdateTicket) return;
    if (allPhotos.length <= 1) {
      alert('El viaje debe tener al menos una foto principal.');
      return;
    }

    const photoToDelete = allPhotos[currentIndex];
    let newMainPhoto = ticket.photoUrl;
    let newGallery = [...(ticket.galleryPhotos || [])];

    if (photoToDelete === ticket.photoUrl) {
      // The deleted photo is the main photo; promote first gallery photo to main photo
      if (newGallery.length > 0) {
        newMainPhoto = newGallery[0];
        newGallery = newGallery.slice(1);
      }
    } else {
      newGallery = newGallery.filter((p) => p !== photoToDelete);
    }

    const updatedTicket: BoardingTicket = {
      ...ticket,
      photoUrl: newMainPhoto,
      galleryPhotos: newGallery,
    };

    onUpdateTicket(updatedTicket);
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const formatDate = (dateStr?: string) => formatDisplayDate(dateStr, 'long');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-2 sm:p-4 md:p-6 animate-fadeIn select-none">
      <div className="relative w-full max-w-5xl h-[92vh] max-h-[920px] bg-[#0E1B2E] border border-amber-400/30 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white">
        {/* Top Header */}
        <div className="px-4 sm:px-6 py-3.5 bg-black/40 border-b border-white/10 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E05A36] to-[#F4A62A] flex items-center justify-center text-white shrink-0 shadow-md">
              <Camera className="w-5 h-5 text-amber-200" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-300 font-bold uppercase tracking-wider">
                <Crown className="w-3.5 h-3.5 text-amber-300" />
                <span>ÁLBUM DE FOTOS DEL VIAJE</span>
                <span className="text-white/40">·</span>
                <span className="text-white/80">{ticket.flightNumber || 'PRINCIPE AIRLINES'}</span>
              </div>
              <h3 className="text-sm sm:text-base font-bold font-display tracking-tight text-white truncate flex items-center gap-1.5 mt-0.5">
                <span>{ticket.departingCity} ({ticket.departingCode})</span>
                <Plane className="w-3.5 h-3.5 text-[#E05A36] shrink-0 transform rotate-45" />
                <span>{ticket.destinationCity} ({ticket.destinationCode})</span>
              </h3>
            </div>
          </div>

          {/* Top Actions: Add photos (if editable) & Close */}
          <div className="flex items-center gap-2 shrink-0">
            {canEdit && onUpdateTicket && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleUploadPhotos}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="px-3 py-1.5 bg-[#E05A36] hover:bg-[#C84B2B] text-white text-xs font-mono font-bold uppercase tracking-wider rounded-lg transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  title="Subir más fotos para este viaje"
                >
                  <Upload className="w-3.5 h-3.5 text-amber-300" />
                  <span className="hidden sm:inline">
                    {isUploading ? 'Comprimiendo...' : '+ Añadir Fotos'}
                  </span>
                  <span className="sm:hidden">+ Fotos</span>
                </button>
              </>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
              title="Cerrar galería"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Main Photo Showcase Area */}
        <div className="relative flex-1 bg-black/60 flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          {/* Main Photo */}
          {currentPhoto ? (
            <div className="relative max-w-full max-h-full flex items-center justify-center group">
              <img
                src={currentPhoto}
                alt={`${ticket.destinationCity} - Foto ${currentIndex + 1}`}
                referrerPolicy="no-referrer"
                className="max-h-[58vh] sm:max-h-[62vh] max-w-full object-contain rounded-xl shadow-2xl border-2 border-white/20 transition-all duration-300"
              />

              {/* Photo Counter Badge */}
              <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono text-amber-300 font-bold border border-white/20 shadow-md">
                Foto {currentIndex + 1} de {allPhotos.length}
              </div>

              {/* Delete button (if editable and more than 1 photo) */}
              {canEdit && onUpdateTicket && allPhotos.length > 1 && (
                <button
                  type="button"
                  onClick={handleDeleteCurrentPhoto}
                  className="absolute top-3 right-3 p-2 bg-red-600/80 hover:bg-red-600 text-white rounded-full transition-all shadow-md cursor-pointer opacity-80 hover:opacity-100"
                  title="Eliminar esta foto del álbum"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <div className="text-center text-white/60 font-mono text-sm py-12">
              <Camera className="w-12 h-12 mx-auto text-amber-400 mb-2 opacity-60" />
              <span>No hay fotos cargadas para este viaje.</span>
            </div>
          )}

          {/* Left Arrow Button */}
          {allPhotos.length > 1 && (
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 bg-black/70 hover:bg-black/90 text-white rounded-full border border-white/20 shadow-xl transition-transform active:scale-90 cursor-pointer"
              title="Foto anterior (Flecha Izquierda)"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}

          {/* Right Arrow Button */}
          {allPhotos.length > 1 && (
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 bg-black/70 hover:bg-black/90 text-white rounded-full border border-white/20 shadow-xl transition-transform active:scale-90 cursor-pointer"
              title="Siguiente foto (Flecha Derecha)"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}
        </div>

        {/* Thumbnails Filmstrip & Trip Info Footer */}
        <div className="p-3 sm:p-4 bg-[#0A1422] border-t border-white/10 shrink-0 space-y-3">
          {/* Thumbnails Strip */}
          {allPhotos.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full scrollbar-thin">
              {allPhotos.map((photo, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    currentIndex === idx
                      ? 'border-amber-400 ring-2 ring-amber-400/50 scale-105'
                      : 'border-white/20 opacity-60 hover:opacity-100 hover:border-white/60'
                  }`}
                >
                  <img
                    src={photo}
                    alt={`Miniatura ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  {idx === 0 && (
                    <span className="absolute bottom-0 inset-x-0 bg-black/80 text-[8px] font-mono font-bold text-amber-300 text-center uppercase py-0.5">
                      Ppal
                    </span>
                  )}
                </button>
              ))}

              {/* Add more button in thumbnails strip (if editable) */}
              {canEdit && onUpdateTicket && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg border-2 border-dashed border-amber-300/40 hover:border-amber-400 bg-amber-400/5 hover:bg-amber-400/10 text-amber-300 flex flex-col items-center justify-center shrink-0 transition-colors cursor-pointer text-[10px] font-mono"
                  title="Añadir más fotos"
                >
                  <Upload className="w-4 h-4 mb-0.5" />
                  <span>+ Subir</span>
                </button>
              )}
            </div>
          )}

          {/* Trip Meta Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-neutral-400 pt-1">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <span className="flex items-center gap-1.5 text-white">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Fecha: <strong>{formatDate(ticket.departingDate)}</strong></span>
              </span>
              <span>
                Pasajero: <strong className="text-amber-200">{ticket.packageContents || 'MI PRÍNCIPE'}</strong>
              </span>
              <span>
                Dedicado a: <strong className="text-rose-300">{ticket.forRecipient || 'EL AMOR DE MI VIDA'}</strong>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-amber-300/90 font-bold">
                {allPhotos.length} {allPhotos.length === 1 ? 'Foto' : 'Fotos'} en el álbum
              </span>
              {canEdit && onUpdateTicket && allPhotos.length <= 1 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1 bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 rounded font-bold text-[10px] uppercase transition-colors cursor-pointer border border-amber-400/30"
                >
                  + Añadir más fotos
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
