import React, { useState, useRef, useEffect } from 'react';
import { LoveLetter, AppleMusicTrack } from '../types';
import { AppleMusicSelector } from './AppleMusicSelector';
import { compressImage } from '../utils/imageCompressor';
import { X, Upload, Heart, Lock, Calendar, Clock, Disc3 } from 'lucide-react';

interface LetterEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (letter: LoveLetter) => void;
  initialData?: Partial<LoveLetter> | null;
}

export const LetterEditorModal: React.FC<LetterEditorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(initialData?.title || '');
  const [recipient, setRecipient] = useState(initialData?.recipient || 'MI AMOR, MI PRÍNCIPE');
  const [sender, setSender] = useState(initialData?.sender || 'TU NOVIA');
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);
  const [specialSong, setSpecialSong] = useState(initialData?.specialSong || '');
  const [appleMusicTrack, setAppleMusicTrack] = useState<AppleMusicTrack | undefined>(initialData?.appleMusicTrack);
  const [content, setContent] = useState(initialData?.content || '');
  const [photoUrl, setPhotoUrl] = useState(
    initialData?.photoUrl || 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&auto=format&fit=crop&q=80'
  );
  const [paperStyle, setPaperStyle] = useState<'linen' | 'parchment' | 'airmail' | 'kraft' | 'rose'>(
    initialData?.paperStyle || 'rose'
  );

  // Countdown Lock State
  const [isLockedUntilDate, setIsLockedUntilDate] = useState<boolean>(initialData?.isLockedUntilDate || false);
  const [unlockDate, setUnlockDate] = useState<string>(() => {
    if (initialData?.unlockDate) {
      // If it has datetime, convert to YYYY-MM-DDTHH:mm format for datetime-local
      const d = new Date(initialData.unlockDate);
      if (!isNaN(d.getTime())) {
        return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
      }
      return initialData.unlockDate;
    }
    // Default 7 days from now at 00:00
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    return new Date(nextWeek.getTime() - nextWeek.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  });

  useEffect(() => {
    if (initialData) {
      if (initialData.title) setTitle(initialData.title);
      if (initialData.recipient) setRecipient(initialData.recipient);
      if (initialData.sender) setSender(initialData.sender);
      if (initialData.date) setDate(initialData.date);
      if (initialData.specialSong) setSpecialSong(initialData.specialSong);
      if (initialData.appleMusicTrack) setAppleMusicTrack(initialData.appleMusicTrack);
      if (initialData.content) setContent(initialData.content);
      if (initialData.photoUrl) setPhotoUrl(initialData.photoUrl);
      if (initialData.paperStyle) setPaperStyle(initialData.paperStyle);
      setIsLockedUntilDate(!!initialData.isLockedUntilDate);
      if (initialData.unlockDate) {
        const d = new Date(initialData.unlockDate);
        if (!isNaN(d.getTime())) {
          setUnlockDate(new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16));
        } else {
          setUnlockDate(initialData.unlockDate);
        }
      }
    } else {
      // Reset defaults for fresh new letter
      setTitle('');
      setRecipient('MI AMOR, MI PRÍNCIPE');
      setSender('TU NOVIA');
      setDate(new Date().toISOString().split('T')[0]);
      setSpecialSong('');
      setAppleMusicTrack(undefined);
      setContent('');
      setIsLockedUntilDate(false);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImage(file, 1024, 1024, 0.75);
        setPhotoUrl(compressed);
      } catch (err) {
        console.error('Error compressing letter photo', err);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let finalPhoto = photoUrl;
    if (finalPhoto && finalPhoto.startsWith('data:image') && finalPhoto.length > 500000) {
      finalPhoto = await compressImage(finalPhoto, 900, 900, 0.65);
    }

    const letterToSave: LoveLetter = {
      id: initialData?.id || `letter-${Date.now()}`,
      title: title.trim() || 'Carta de Amor para Ti',
      recipient: recipient.trim() || 'MI AMOR, MI PRÍNCIPE',
      sender: sender.trim() || 'TU NOVIA',
      date,
      originCity: 'Con todo mi corazón',
      destinationCity: 'Para ti, mi rey',
      content: content.trim() || 'Te amo hoy y todos los días de mi vida.',
      photoUrl: finalPhoto,
      paperStyle,
      stampType: 'heart-crown',
      waxSealColor: 'crimson',
      specialSong: appleMusicTrack ? `${appleMusicTrack.title} - ${appleMusicTrack.artist}` : (specialSong.trim() || undefined),
      appleMusicTrack: appleMusicTrack || undefined,
      isLockedUntilDate: isLockedUntilDate,
      unlockDate: isLockedUntilDate ? new Date(unlockDate).toISOString() : undefined,
      mood: 'romantica',
      createdAt: initialData?.createdAt || new Date().toISOString(),
    };

    onSave(letterToSave);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn select-none">
      <div className="relative w-full max-w-4xl bg-[#171717] border border-rose-500/30 text-white rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-rose-500/20 flex items-center justify-between bg-black/60">
          <div className="flex items-center gap-2.5">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500 animate-pulse" />
            <h2 className="text-lg sm:text-xl font-bold font-display uppercase tracking-wide text-white">
              {initialData?.id ? 'Editar Carta de Amor' : 'Redactar Carta de Amor para Mi Novio'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1 font-sans">
          {/* Title */}
          <div>
            <label className="block text-xs font-mono uppercase text-rose-400 font-bold mb-1">
              Título / Asunto de la Carta de Amor *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Para el amor de mi vida, mi Príncipe"
              className="w-full px-3.5 py-2.5 bg-neutral-900 border border-white/20 rounded-lg text-white font-display text-base focus:border-rose-500 focus:outline-none"
            />
          </div>

          {/* Sender & Recipient */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-white/70 mb-1">
                Para (Mi Novio / Recipient) *
              </label>
              <input
                type="text"
                required
                value={recipient}
                onChange={(e) => setRecipient(e.target.value.toUpperCase())}
                placeholder="MI AMOR, MI PRÍNCIPE"
                className="w-full px-3 py-2 bg-neutral-900 border border-white/20 rounded-lg text-white font-mono text-sm uppercase focus:border-rose-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-white/70 mb-1">
                De (Tu Nombre / Firma) *
              </label>
              <input
                type="text"
                required
                value={sender}
                onChange={(e) => setSender(e.target.value.toUpperCase())}
                placeholder="TU NOVIA"
                className="w-full px-3 py-2 bg-neutral-900 border border-white/20 rounded-lg text-white font-mono text-sm uppercase focus:border-rose-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Date of Letter */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-white/70 mb-1">
                Fecha visible de la Carta
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-900 border border-white/20 rounded-lg text-white text-xs focus:border-rose-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-white/70 mb-1">
                Estilo de Papel de Carta
              </label>
              <div className="flex flex-wrap gap-2 pt-0.5">
                {[
                  { id: 'rose', name: 'Rosa Romántico' },
                  { id: 'linen', name: 'Lino Blanco' },
                  { id: 'parchment', name: 'Pergamino Real' },
                  { id: 'airmail', name: 'Correo Aéreo' },
                  { id: 'kraft', name: 'Papel Kraft' },
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setPaperStyle(st.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                      paperStyle === st.id
                        ? 'bg-rose-600 text-white font-bold'
                        : 'bg-white/10 text-white/80 hover:bg-white/20'
                    }`}
                  >
                    {st.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section: Canción o Dedicatoria Especial desde Apple Music */}
          <div className="p-4 bg-black/40 border border-rose-500/20 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-mono uppercase text-rose-300 font-bold flex items-center gap-1.5">
                <Disc3 className="w-4 h-4 text-rose-400" />
                <span>Canción o Dedicatoria Especial (Apple Music)</span>
              </label>
              <span className="text-[10px] font-mono text-neutral-400">
                Búsqueda en catálogo de Apple Music
              </span>
            </div>
            
            <AppleMusicSelector
              selectedTrack={appleMusicTrack}
              onSelectTrack={(track) => {
                setAppleMusicTrack(track);
                if (track) {
                  setSpecialSong(`${track.title} - ${track.artist}`);
                }
              }}
              initialManualText={specialSong}
              onManualTextChange={(txt) => setSpecialSong(txt)}
            />
          </div>

          {/* Section: Countdown Lock Settings */}
          <div className="p-4 bg-gradient-to-r from-[#17132B]/80 to-[#101426]/80 border border-amber-400/30 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-400/20 text-amber-300">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wide text-amber-300">
                    Cuenta Regresiva & Bloqueo de Carta
                  </h4>
                  <p className="text-[11px] text-neutral-400 font-sans">
                    No permitir abrirla hasta una fecha y hora especificada
                  </p>
                </div>
              </div>

              {/* Toggle switch */}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isLockedUntilDate}
                  onChange={(e) => setIsLockedUntilDate(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>

            {isLockedUntilDate && (
              <div className="pt-2 border-t border-white/10 space-y-2 animate-fadeIn">
                <label className="block text-[11px] font-mono text-amber-200 uppercase font-semibold">
                  Fecha y Hora exacta de Apertura:
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="datetime-local"
                    required={isLockedUntilDate}
                    value={unlockDate}
                    onChange={(e) => setUnlockDate(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 bg-neutral-900 border border-amber-400/50 rounded-lg text-white font-mono text-xs focus:border-amber-400 focus:outline-none"
                  />
                  <div className="flex items-center gap-1.5 text-xs font-mono text-amber-300/80 bg-amber-400/10 px-3 py-2.5 rounded-lg border border-amber-400/20 shrink-0">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>Contador en vivo</span>
                  </div>
                </div>

                <p className="text-[11px] text-neutral-300 font-sans italic leading-relaxed pt-1">
                  💡 <strong>¿Cómo funciona?</strong> La carta se mostrará en el buzón con un sello dorado y un reloj de cuenta regresiva en vivo. Si tu novio intenta abrirla antes de tiempo, verá el temporizador y no podrá leer el mensaje hasta que la cuenta llegue a cero.
                </p>
              </div>
            )}
          </div>

          {/* Body Content */}
          <div>
            <label className="block text-xs font-mono uppercase text-rose-400 font-bold mb-1 flex items-center justify-between">
              <span>Mensaje de Amor *</span>
              <span className="text-[11px] text-white/40 font-normal">Escribe todo lo que sientes</span>
            </label>
            <textarea
              required
              rows={7}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escribe aquí tu carta de amor... Cuéntale cuánto lo amas, un recuerdo especial de ustedes dos, lo que más te gusta de él, o una promesa para el futuro..."
              className="w-full px-3.5 py-3 bg-neutral-900 border border-white/20 rounded-lg text-white text-sm sm:text-base leading-relaxed focus:border-rose-500 focus:outline-none font-serif"
            />
          </div>

          {/* Photo */}
          <div>
            <label className="block text-xs font-mono uppercase text-white/70 mb-2">
              Foto de Recuerdo Juntos (Opcional)
            </label>
            <div className="flex items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 rounded-lg text-xs font-mono flex items-center gap-2 border border-rose-500/40 cursor-pointer"
              >
                <Upload className="w-4 h-4 text-rose-400" />
                <span>Subir Foto Juntos</span>
              </button>
              {photoUrl && (
                <div className="w-12 h-14 rounded-md overflow-hidden border border-rose-300 shrink-0">
                  <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-white/15 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-mono uppercase cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-lg shadow-lg cursor-pointer transition-transform active:scale-95 flex items-center gap-2"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>Guardar en su Buzón de Amor</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
