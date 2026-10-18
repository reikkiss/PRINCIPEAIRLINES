import React, { useState } from 'react';
import { DestinationItem, WorldRegion, BoardingTicket } from '../types';
import { CheckCircle2, Circle, Plus, Camera, MapPin, Calendar, Sparkles, Filter, Trash2 } from 'lucide-react';

interface FutureDestinationsListProps {
  destinations: DestinationItem[];
  tickets: BoardingTicket[];
  onToggleDestination: (destId: string) => void;
  onOpenUploadForDestination?: (destination: DestinationItem) => void;
  onAddDestination?: (destination: Omit<DestinationItem, 'id'>) => void;
  onDeleteDestination?: (destId: string) => void;
}

export const FutureDestinationsList: React.FC<FutureDestinationsListProps> = ({
  destinations,
  tickets,
  onToggleDestination,
  onOpenUploadForDestination,
  onAddDestination,
  onDeleteDestination,
}) => {
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('all');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  // New Destination Form State
  const [newCity, setNewCity] = useState('');
  const [newCountry, setNewCountry] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newRegion, setNewRegion] = useState<WorldRegion>('Europe');
  const [newDate, setNewDate] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCity || !newCode) return;

    onAddDestination({
      city: newCity,
      country: newCountry || 'International',
      code: newCode.toUpperCase().trim(),
      region: newRegion,
      completed: false,
      targetDate: newDate || new Date().toISOString().split('T')[0],
      experienceNotes: newNotes || 'Nuevas experiencias y registro fotográfico.',
      lat: 0,
      lng: 0,
    });

    // Reset form
    setNewCity('');
    setNewCountry('');
    setNewCode('');
    setNewNotes('');
    setShowAddForm(false);
  };

  const filtered = destinations.filter((dest) => {
    const matchesRegion = selectedRegion === 'all' || dest.region.toLowerCase() === selectedRegion.toLowerCase();
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'completed' && dest.completed) ||
      (filterStatus === 'pending' && !dest.completed);
    return matchesRegion && matchesStatus;
  });

  const completedCount = destinations.filter((d) => d.completed).length;

  return (
    <div className="w-full bg-[#FAF9F5] text-[#121212] p-4 sm:p-6 md:p-8 rounded-xl border border-neutral-300 shadow-xl">
      {/* Header with Title and stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <div className="text-xs font-mono font-bold text-[#0015ff] uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <MapPin className="w-4 h-4" />
            <span>LISTA DE DESTINOS & CIUDADES FUTURAS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-neutral-900">
            Ciudades por Conquistar & Completar
          </h2>
          <p className="text-sm text-neutral-600 mt-1 max-w-2xl">
            Marca el check al visitar cada destino para <strong className="text-black">abrir inmediatamente el creador de tarjetas</strong> y subir la foto de tu experiencia.
          </p>
        </div>

        {/* Progress Counter & Add Button */}
        <div className="flex items-center gap-3">
          <div className="bg-neutral-100 border border-neutral-300 px-4 py-2 rounded-lg text-center font-mono">
            <div className="text-xs text-neutral-500 uppercase">Completadas</div>
            <div className="text-lg font-bold text-[#0015ff]">
              {completedCount} <span className="text-neutral-400 font-normal">/ {destinations.length}</span>
            </div>
          </div>

          {onAddDestination && (
              <button
                type="button"
                onClick={() => setShowAddForm(!showAddForm)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0015ff] hover:bg-[#0022ff] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Agregar Ciudad</span>
              </button>
          )}
        </div>
      </div>

      {/* Add Custom Destination Dropdown Modal / Form */}
      {showAddForm && (
        <form onSubmit={handleAddSubmit} className="my-6 p-5 bg-white border-2 border-[#0015ff] rounded-xl shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="font-bold text-sm uppercase font-mono tracking-wider text-[#0015ff]">
              + Planear Nueva Ciudad o Destino
            </h3>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-xs text-neutral-500 hover:text-black font-mono"
            >
              Cancelar
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block font-bold text-neutral-700 mb-1">Ciudad *</label>
              <input
                type="text"
                placeholder="Ej. Tokio, Florencia"
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded border-neutral-300 focus:outline-none focus:border-[#0015ff]"
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-700 mb-1">País</label>
              <input
                type="text"
                placeholder="Ej. Japón, Italia"
                value={newCountry}
                onChange={(e) => setNewCountry(e.target.value)}
                className="w-full px-3 py-2 border rounded border-neutral-300 focus:outline-none focus:border-[#0015ff]"
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-700 mb-1">Código Aeropuerto (IATA) *</label>
              <input
                type="text"
                maxLength={4}
                placeholder="Ej. NRT, FLR"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                required
                className="w-full px-3 py-2 border rounded border-neutral-300 focus:outline-none focus:border-[#0015ff] font-mono uppercase"
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-700 mb-1">Región</label>
              <select
                value={newRegion}
                onChange={(e) => setNewRegion(e.target.value as WorldRegion)}
                className="w-full px-3 py-2 border rounded border-neutral-300 focus:outline-none focus:border-[#0015ff]"
              >
                <option value="Europe">Europe</option>
                <option value="Asia">Asia</option>
                <option value="Africa">Africa</option>
                <option value="Americas">Americas</option>
                <option value="Oceania">Oceania</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-bold text-neutral-700 mb-1">Fecha Estimada de Viaje</label>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full px-3 py-2 border rounded border-neutral-300 focus:outline-none focus:border-[#0015ff]"
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-700 mb-1">Notas de Experiencia / Objetivos</label>
              <input
                type="text"
                placeholder="Ej. Conocer los archivos tipográficos y empaques locales"
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                className="w-full px-3 py-2 border rounded border-neutral-300 focus:outline-none focus:border-[#0015ff]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="submit"
              className="px-5 py-2 bg-[#0015ff] text-white font-bold text-xs uppercase tracking-wider rounded hover:bg-[#0022ff] shadow"
            >
              Guardar en Lista
            </button>
          </div>
        </form>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 my-4">
        {/* Regions */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
          <span className="text-neutral-500 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Región:</span>
          </span>
          {['all', 'Europe', 'Asia', 'Africa', 'Americas', 'Oceania'].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setSelectedRegion(r)}
              className={`px-2.5 py-1 rounded transition-colors uppercase ${
                selectedRegion === r
                  ? 'bg-neutral-900 text-white font-bold'
                  : 'bg-neutral-200 hover:bg-neutral-300 text-neutral-700'
              }`}
            >
              {r === 'all' ? 'Todas' : r}
            </button>
          ))}
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-1 text-xs font-mono">
          <button
            type="button"
            onClick={() => setFilterStatus('all')}
            className={`px-2.5 py-1 rounded ${filterStatus === 'all' ? 'bg-neutral-900 text-white font-bold' : 'bg-neutral-200 text-neutral-700'}`}
          >
            Todas ({destinations.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('pending')}
            className={`px-2.5 py-1 rounded ${filterStatus === 'pending' ? 'bg-[#0015ff] text-white font-bold' : 'bg-neutral-200 text-neutral-700'}`}
          >
            Pendientes ({destinations.length - completedCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('completed')}
            className={`px-2.5 py-1 rounded ${filterStatus === 'completed' ? 'bg-emerald-600 text-white font-bold' : 'bg-neutral-200 text-neutral-700'}`}
          >
            Completadas ({completedCount})
          </button>
        </div>
      </div>

      {/* Destinations Interactive Table / List */}
      <div className="divide-y divide-neutral-200 bg-white rounded-lg border border-neutral-300 overflow-hidden shadow-sm">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-neutral-500 font-mono text-sm">
            No se encontraron ciudades con los filtros seleccionados.
          </div>
        ) : (
          filtered.map((dest) => {
            const hasTicket = tickets.some(
              (t) => t.destinationCode.toUpperCase().includes(dest.code) ||
                     t.departingCode.toUpperCase().includes(dest.code)
            );

            return (
              <div
                key={dest.id}
                className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                  dest.completed ? 'bg-emerald-50/40 hover:bg-emerald-50' : 'hover:bg-neutral-50'
                }`}
              >
                {/* Left: Checkmark & Destination info */}
                <div className="flex items-start sm:items-center gap-3">
                  {/* Interactive Checkmark */}
                  <button
                    type="button"
                    onClick={() => {
                      onToggleDestination(dest.id);
                      // If completing, immediately prompt user to upload the ticket card
                      if (!dest.completed) {
                        onOpenUploadForDestination(dest);
                      }
                    }}
                    title={dest.completed ? 'Marcar como pendiente' : '¡Completar destino y subir tarjeta!'}
                    className="mt-0.5 sm:mt-0 p-1 text-neutral-400 hover:text-[#0015ff] transition-colors focus:outline-none"
                  >
                    {dest.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 fill-emerald-100" />
                    ) : (
                      <Circle className="w-6 h-6 hover:stroke-[#0015ff]" />
                    )}
                  </button>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display font-black text-lg text-neutral-900">
                        {dest.city}
                      </span>
                      <span className="px-1.5 py-0.5 bg-neutral-900 text-[#FACC15] font-mono font-bold text-xs rounded">
                        {dest.code}
                      </span>
                      <span className="text-xs text-neutral-500 font-medium">
                        · {dest.country}
                      </span>
                    </div>

                    <div className="text-xs text-neutral-600 mt-0.5 flex flex-wrap items-center gap-2">
                      <span className="font-mono text-neutral-500">
                        {dest.completed
                          ? `Visitado: ${dest.completedDate || '2026'}`
                          : `Objetivo: ${dest.targetDate || 'Próximamente'}`}
                      </span>
                      {dest.experienceNotes && (
                        <>
                          <span aria-hidden="true" className="text-neutral-300">|</span>
                          <span className="italic text-neutral-500 line-clamp-1">{dest.experienceNotes}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  {hasTicket ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-mono font-semibold rounded">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Tarjeta Creada</span>
                    </span>
                  ) : null}

                  {/* Immediate Upload Button */}
                  {onOpenUploadForDestination && (
                      <button
                        type="button"
                        onClick={() => onOpenUploadForDestination(dest)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0015ff] hover:bg-[#0022ff] text-white text-xs font-mono font-bold uppercase tracking-wider rounded transition-all shadow-sm"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>{hasTicket ? 'Reemplazar Foto' : 'Subir Tarjeta'}</span>
                      </button>
                  )}

                  {onDeleteDestination && (
                      <button
                        type="button"
                        onClick={() => onDeleteDestination(dest.id)}
                        title="Eliminar de lista"
                        className="p-1.5 text-neutral-400 hover:text-red-600 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
