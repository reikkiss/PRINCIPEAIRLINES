import React, { useState, useRef, useEffect } from 'react';
import { LoveLetter } from '../types';
import { X, Upload, Heart, Sparkles, Crown } from 'lucide-react';

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
  const [content, setContent] = useState(initialData?.content || '');
  const [photoUrl, setPhotoUrl] = useState(
    initialData?.photoUrl || 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&auto=format&fit=crop&q=80'
  );
  const [paperStyle, setPaperStyle] = useState<'linen' | 'parchment' | 'airmail' | 'kraft' | 'rose'>(
    initialData?.paperStyle || 'rose'
  );

  useEffect(() => {
    if (initialData) {
      if (initialData.title) setTitle(initialData.title);
      if (initialData.recipient) setRecipient(initialData.recipient);
      if (initialData.sender) setSender(initialData.sender);
      if (initialData.date) setDate(initialData.date);
      if (initialData.specialSong) setSpecialSong(initialData.specialSong);
      if (initialData.content) setContent(initialData.content);
      if (initialData.photoUrl) setPhotoUrl(initialData.photoUrl);
      if (initialData.paperStyle) setPaperStyle(initialData.paperStyle);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const letterToSave: LoveLetter = {
      id: initialData?.id || `letter-${Date.now()}`,
      title: title.trim() || 'Carta de Amor para Ti',
      recipient: recipient.trim() || 'MI AMOR, MI PRÍNCIPE',
      sender: sender.trim() || 'TU NOVIA',
      date,
      originCity: 'Con todo mi corazón',
      destinationCity: 'Para ti, mi rey',
      content: content.trim() || 'Te amo hoy y todos los días de mi vida.',
      photoUrl,
      paperStyle,
      stampType: 'heart-crown',
      waxSealColor: 'crimson',
      specialSong: specialSong.trim() || undefined,
      mood: 'romantica',
      createdAt: initialData?.createdAt || new Date().toISOString(),
    };

    onSave(letterToSave);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-[#171717] border border-rose-500/30 text-white rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
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

          {/* Date & Song */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-white/70 mb-1">
                Fecha de la Carta
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
                Canción o Dedicatoria Especial (Opcional)
              </label>
              <input
                type="text"
                value={specialSong}
                onChange={(e) => setSpecialSong(e.target.value)}
                placeholder="Ej: Perfect - Ed Sheeran"
                className="w-full px-3 py-2 bg-neutral-900 border border-white/20 rounded-lg text-white text-xs focus:border-rose-500 focus:outline-none"
              />
            </div>
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

          {/* Photo & Paper Style */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-mono uppercase text-white/70 mb-2">
                Foto de Recuerdo Juntos
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

            <div>
              <label className="block text-xs font-mono uppercase text-white/70 mb-2">
                Estilo de Papel de Carta
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'rose', name: 'Rosa Romántico' },
                  { id: 'linen', name: 'Lino Blanco' },
                  { id: 'parchment', name: 'Pergamino Real' },
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
