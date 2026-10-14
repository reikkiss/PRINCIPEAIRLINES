/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Hero } from './components/Hero';
import { TicketCarousel3D } from './components/TicketCarousel3D';
import { InteractiveFlightMap } from './components/InteractiveFlightMap';
import { FutureDestinationsList } from './components/FutureDestinationsList';
import { LettersRegistrySection } from './components/LettersRegistrySection';
import { TicketManagerPage } from './components/TicketManagerPage';
import { TicketUploadModal } from './components/TicketUploadModal';
import { LetterEditorModal } from './components/LetterEditorModal';
import { LetterReaderModal } from './components/LetterReaderModal';
import { DateLockModal } from './components/DateLockModal';
import { INITIAL_TICKETS } from './data/ticketsData';
import { INITIAL_DESTINATIONS } from './data/destinationsData';
import { INITIAL_LETTERS } from './data/lettersData';
import { BoardingTicket, DestinationItem, TravelLetter } from './types';
import { Lock, Unlock } from 'lucide-react';

export default function App() {
  // Page state: 'main' showcase page vs separate 'manager' page
  const [currentPage, setCurrentPage] = useState<'main' | 'manager'>('main');

  // Security Lock State (Password date: 02/12/2026)
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('versal_studio_unlocked') === 'true';
    } catch {
      return false;
    }
  });
  const [isLockModalOpen, setIsLockModalOpen] = useState<boolean>(false);

  // Tickets state with LocalStorage persistence and automatic carrier migration
  const [tickets, setTickets] = useState<BoardingTicket[]>(() => {
    try {
      const saved = localStorage.getItem('versal_tickets');
      if (saved) {
        const parsed: BoardingTicket[] = JSON.parse(saved);
        // Automatically migrate any old 'SINGAPORE AIRLINES' to 'PRINCIPE AILINES'
        return parsed.map((t) => ({
          ...t,
          carrierName:
            !t.carrierName ||
            t.carrierName === 'SINGAPORE AIRLINES' ||
            t.carrierName === 'PRINCIPE AILINES'
              ? 'PRINCIPE AIRLINES'
              : t.carrierName,
          flightNumber: t.flightNumber?.replace(/^SQ/, 'PA') || 'PA286',
        }));
      }
    } catch (e) {
      console.error('Error loading tickets from localStorage', e);
    }
    return INITIAL_TICKETS;
  });

  // Destinations state with LocalStorage persistence
  const [destinations, setDestinations] = useState<DestinationItem[]>(() => {
    try {
      const saved = localStorage.getItem('versal_destinations');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading destinations from localStorage', e);
    }
    return INITIAL_DESTINATIONS;
  });

  // Letters state with LocalStorage persistence
  const [letters, setLetters] = useState<TravelLetter[]>(() => {
    try {
      const saved = localStorage.getItem('versal_letters');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading letters from localStorage', e);
    }
    return INITIAL_LETTERS;
  });

  // Upload/Edit Modal State (only active inside Studio Manager)
  const [uploadModalState, setUploadModalState] = useState<{
    isOpen: boolean;
    initialData?: Partial<BoardingTicket> | null;
    mode: 'create' | 'edit';
  }>({
    isOpen: false,
    initialData: null,
    mode: 'create',
  });

  // Letter Reader & Editor Modal States
  const [selectedLetterForReader, setSelectedLetterForReader] = useState<TravelLetter | null>(null);
  const [letterEditorState, setLetterEditorState] = useState<{
    isOpen: boolean;
    initialData?: Partial<TravelLetter> | null;
  }>({
    isOpen: false,
    initialData: null,
  });

  // Save tickets to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('versal_tickets', JSON.stringify(tickets));
    } catch (e) {
      console.error('Error saving tickets', e);
    }
  }, [tickets]);

  // Save destinations to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('versal_destinations', JSON.stringify(destinations));
    } catch (e) {
      console.error('Error saving destinations', e);
    }
  }, [destinations]);

  // Save letters to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('versal_letters', JSON.stringify(letters));
    } catch (e) {
      console.error('Error saving letters', e);
    }
  }, [letters]);

  // Handlers for Tickets
  const handleSaveTicket = (ticket: BoardingTicket) => {
    setTickets((prev) => {
      const existsIndex = prev.findIndex((t) => t.id === ticket.id);
      if (existsIndex >= 0) {
        const updated = [...prev];
        updated[existsIndex] = ticket;
        return updated;
      }
      return [ticket, ...prev];
    });

    // Automatically mark associated destination as completed
    setDestinations((prev) =>
      prev.map((d) => {
        if (
          d.code.toUpperCase() === ticket.destinationCode.toUpperCase() ||
          ticket.destinationCity.toLowerCase().includes(d.city.toLowerCase())
        ) {
          return {
            ...d,
            completed: true,
            completedDate: ticket.departingDate,
            associatedTicketId: ticket.id,
          };
        }
        return d;
      })
    );
  };

  const handleDeleteTicket = (ticketId: string) => {
    setTickets((prev) => prev.filter((t) => t.id !== ticketId));
  };

  const handleResetTickets = () => {
    setTickets(INITIAL_TICKETS);
    setDestinations(INITIAL_DESTINATIONS);
    setLetters(INITIAL_LETTERS);
  };

  const handleToggleDestination = (destId: string) => {
    setDestinations((prev) =>
      prev.map((d) => {
        if (d.id === destId) {
          const nextCompleted = !d.completed;
          return {
            ...d,
            completed: nextCompleted,
            completedDate: nextCompleted ? new Date().toISOString().split('T')[0] : undefined,
          };
        }
        return d;
      })
    );
  };

  const handleAddDestination = (newDest: Omit<DestinationItem, 'id'>) => {
    const destWithId: DestinationItem = {
      ...newDest,
      id: `dest-${Date.now()}`,
    };
    setDestinations((prev) => [destWithId, ...prev]);
  };

  const handleDeleteDestination = (destId: string) => {
    setDestinations((prev) => prev.filter((d) => d.id !== destId));
  };

  // Handlers for Letters
  const handleSaveLetter = (letter: TravelLetter) => {
    setLetters((prev) => {
      const existsIndex = prev.findIndex((l) => l.id === letter.id);
      if (existsIndex >= 0) {
        const updated = [...prev];
        updated[existsIndex] = letter;
        return updated;
      }
      return [letter, ...prev];
    });
  };

  const handleDeleteLetter = (letterId: string) => {
    setLetters((prev) => prev.filter((l) => l.id !== letterId));
  };

  const openUploadModal = (prefill?: Partial<BoardingTicket>) => {
    setUploadModalState({
      isOpen: true,
      initialData: prefill || null,
      mode: prefill?.id ? 'edit' : 'create',
    });
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Open Manager Page with Date Password Verification (02/12/2026)
  const handleOpenManager = () => {
    if (isUnlocked) {
      setCurrentPage('manager');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIsLockModalOpen(true);
    }
  };

  const handleUnlockSuccess = () => {
    setIsUnlocked(true);
    try {
      sessionStorage.setItem('versal_studio_unlocked', 'true');
    } catch {}
    setIsLockModalOpen(false);
    setCurrentPage('manager');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLockSession = () => {
    setIsUnlocked(false);
    try {
      sessionStorage.removeItem('versal_studio_unlocked');
    } catch {}
    setCurrentPage('main');
  };

  return (
    /* Signature Cobalt Blue Outer Window Border */
    <div className="min-h-screen bg-[#0015ff] p-2 sm:p-3 lg:p-4 selection:bg-[#0015ff] selection:text-white">
      {/* Inner canvas container */}
      <div className="relative min-h-[calc(100vh-16px)] sm:min-h-[calc(100vh-24px)] lg:min-h-[calc(100vh-32px)] bg-[#F5F2EB] text-[#121212] rounded-none sm:rounded-sm overflow-hidden flex flex-col justify-between shadow-2xl">
        {currentPage === 'main' ? (
          /* =================== MAIN PUBLIC SHOWCASE PAGE (No Edit/Upload Buttons) =================== */
          <main className="flex-1 w-full space-y-0 relative">
            {/* Floating Discrete Access Button to Gestor de Boletos */}
            <div className="fixed bottom-6 right-6 z-40">
              <button
                type="button"
                onClick={handleOpenManager}
                title="Acceso Protegido: Estudio & Gestor de Boletos"
                className="group inline-flex items-center gap-2 px-4 py-2.5 bg-neutral-950/90 hover:bg-black text-white rounded-full border border-white/20 shadow-2xl backdrop-blur-md transition-all hover:scale-105 active:scale-95 text-xs font-mono font-bold cursor-pointer"
              >
                {isUnlocked ? (
                  <Unlock className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Lock className="w-4 h-4 text-[#FACC15]" />
                )}
                <span>Estudio & Gestor</span>
              </button>
            </div>

            {/* Section 1: Versal Hero with interactive draggable stickers */}
            <section id="hero" className="w-full">
              <Hero />
            </section>

            {/* Section 2: Infinite 3D Ticket Cover Flow Carousel (No Edit Button) */}
            <section id="tickets-3d" className="w-full">
              <TicketCarousel3D
                tickets={tickets}
                onSwitchToMap={() => scrollToSection('flight-map')}
              />
            </section>

            {/* Section 3: Accurate Neon Glow Global Flight Map */}
            <section id="flight-map" className="w-full">
              <InteractiveFlightMap
                tickets={tickets}
                destinations={destinations}
                onOpenUploadModal={() => {}}
                onSelectTicket={() => scrollToSection('tickets-3d')}
                onToggleDestination={handleToggleDestination}
              />
            </section>

            {/* Section 4: Registro de Cartas Postales & Correspondencia */}
            <LettersRegistrySection
              letters={letters}
              onOpenLetterReader={(letter) => setSelectedLetterForReader(letter)}
            />

            {/* Section 5: Future Destinations & Cities Checklist (Read-only on main page, no add/upload buttons) */}
            <section id="future-destinations" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <FutureDestinationsList
                destinations={destinations}
                tickets={tickets}
                onToggleDestination={handleToggleDestination}
                allowEdit={false} // Clean display on main page!
              />
            </section>
          </main>
        ) : (
          /* =================== SEPARATE PAGE: ESTUDIO & GESTOR DE BOLETOS (Full Editing) =================== */
          <main className="flex-1 w-full bg-[#FAF9F5]">
            <TicketManagerPage
              tickets={tickets}
              destinations={destinations}
              letters={letters}
              onAddTicket={(newTicket) => handleSaveTicket(newTicket)}
              onUpdateTicket={(updated) => handleSaveTicket(updated)}
              onDeleteTicket={handleDeleteTicket}
              onResetTickets={handleResetTickets}
              onSelectTicketFor3D={() => {
                setCurrentPage('main');
                setTimeout(() => scrollToSection('tickets-3d'), 100);
              }}
              onOpenUploadModal={(prefill) => openUploadModal(prefill)}
              onToggleDestination={handleToggleDestination}
              onAddDestination={handleAddDestination}
              onDeleteDestination={handleDeleteDestination}
              onAddLetter={handleSaveLetter}
              onUpdateLetter={handleSaveLetter}
              onDeleteLetter={handleDeleteLetter}
              onOpenLetterEditor={(prefill) => setLetterEditorState({ isOpen: true, initialData: prefill || null })}
              onOpenLetterReader={(letter) => setSelectedLetterForReader(letter)}
              onBackToMain={() => {
                setCurrentPage('main');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onLockSession={handleLockSession}
            />
          </main>
        )}

        {/* Date Password Verification Modal (Key Date: 02/12/2026) */}
        <DateLockModal
          isOpen={isLockModalOpen}
          onClose={() => setIsLockModalOpen(false)}
          onSuccess={handleUnlockSuccess}
        />

        {/* Ticket Photo Upload & Location Editor Modal (Used in Studio Manager) */}
        <TicketUploadModal
          isOpen={uploadModalState.isOpen}
          onClose={() => setUploadModalState({ isOpen: false, initialData: null, mode: 'create' })}
          onSave={handleSaveTicket}
          initialData={uploadModalState.initialData}
          mode={uploadModalState.mode}
        />

        {/* Letter Editor Modal (Create/Edit Travel Letter) */}
        <LetterEditorModal
          isOpen={letterEditorState.isOpen}
          initialData={letterEditorState.initialData}
          onClose={() => setLetterEditorState({ isOpen: false, initialData: null })}
          onSave={handleSaveLetter}
        />

        {/* Letter Reader Modal (Full screen elegant postal reader) */}
        <LetterReaderModal
          letter={selectedLetterForReader}
          isOpen={!!selectedLetterForReader}
          onClose={() => setSelectedLetterForReader(null)}
        />
      </div>
    </div>
  );
}
