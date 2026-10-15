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
import { db } from './firebase';
import { collection, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';
import heroImgFile from './assets/images/IMG_4154.jpg';



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

  // Tickets state with Firestore persistence
  const [tickets, setTickets] = useState<BoardingTicket[]>([]);
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'tickets'), (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data() as BoardingTicket);
      setTickets(data.length > 0 ? data : INITIAL_TICKETS);
    });
    return unsub;
  }, []);

  // Destinations state with Firestore persistence
  const [destinations, setDestinations] = useState<DestinationItem[]>([]);
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'destinations'), (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data() as DestinationItem);
      setDestinations(data.length > 0 ? data : INITIAL_DESTINATIONS);
    });
    return unsub;
  }, []);

  // Letters state with Firestore persistence
  const [letters, setLetters] = useState<TravelLetter[]>([]);
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'letters'), (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data() as TravelLetter);
      setLetters(data.length > 0 ? data : INITIAL_LETTERS);
    });
    return unsub;
  }, []);

  // Hero image state
const [heroImage, setHeroImage] = useState<string>(heroImgFile);
  // Save hero image to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('principe_hero_image', heroImage);
    } catch (e) {
      console.error('Error saving hero image', e);
    }
  }, [heroImage]);
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

  // Handlers for Tickets




  const handleSaveTicket = async (ticket: BoardingTicket) => {
    try {
      await setDoc(doc(db, 'tickets', ticket.id), ticket);
    } catch (error) {
      console.error("Error saving ticket", error);
    }
  };

  const handleDeleteTicket = async (ticketId: string) => {
    try {
      await deleteDoc(doc(db, 'tickets', ticketId));
    } catch (error) {
      console.error("Error deleting ticket", error);
    }
  };

  const handleToggleDestination = async (destId: string) => {
    const dest = destinations.find(d => d.id === destId);
    if (!dest) return;
    try {
      await setDoc(doc(db, 'destinations', destId), {
        ...dest,
        completed: !dest.completed,
        completedDate: !dest.completed ? new Date().toISOString().split('T')[0] : undefined,
      });
    } catch (error) {
      console.error("Error toggling destination", error);
    }
  };

  const handleAddDestination = async (newDest: Omit<DestinationItem, 'id'>) => {
    const id = `dest-${Date.now()}`;
    try {
      await setDoc(doc(db, 'destinations', id), { ...newDest, id });
    } catch (error) {
      console.error("Error adding destination", error);
    }
  };

  const handleDeleteDestination = async (destId: string) => {
    try {
      await deleteDoc(doc(db, 'destinations', destId));
    } catch (error) {
      console.error("Error deleting destination", error);
    }
  };

  const handleSaveLetter = async (letter: TravelLetter) => {
    try {
      await setDoc(doc(db, 'letters', letter.id), letter);
    } catch (error) {
      console.error("Error saving letter", error);
    }
  };

  const handleDeleteLetter = async (letterId: string) => {
    try {
      await deleteDoc(doc(db, 'letters', letterId));
    } catch (error) {
      console.error("Error deleting letter", error);
    }
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
    /* Mediterranean Navy Luxury Outer Window Frame */
    <div className="min-h-screen bg-[#0E2340] p-2 sm:p-3 lg:p-4 selection:bg-[#E05A36] selection:text-white">
      {/* Inner canvas container */}
      <div className="relative min-h-[calc(100vh-16px)] sm:min-h-[calc(100vh-24px)] lg:min-h-[calc(100vh-32px)] bg-[#FAF6EE] text-[#121212] rounded-none sm:rounded-sm overflow-hidden flex flex-col justify-between shadow-2xl">
        {currentPage === 'main' ? (
          /* =================== MAIN PUBLIC SHOWCASE PAGE (No Edit/Upload Buttons) =================== */
          <main className="flex-1 w-full space-y-0 relative">
            {/* Floating Discrete Access Button to Gestor de Boletos */}
            <div className="fixed bottom-6 right-6 z-40">
              <button
                type="button"
                onClick={handleOpenManager}
                title="Acceso Protegido: Estudio & Gestor de Boletos"
                className="group inline-flex items-center gap-2 px-4 py-2.5 bg-[#0E2340]/95 hover:bg-[#071426] text-white rounded-full border border-amber-300/40 shadow-2xl backdrop-blur-md transition-all hover:scale-105 active:scale-95 text-xs font-mono font-bold cursor-pointer"
              >
                {isUnlocked ? (
                  <Unlock className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Lock className="w-4 h-4 text-amber-300" />
                )}
                <span>Estudio & Gestor</span>
              </button>
            </div>

            {/* Section 1: Hero with Mediterranean Love Stationery Layout */}
            <section id="hero" className="w-full">
              <Hero
                onScrollToSection={scrollToSection}
                customHeroImage={heroImage}
              />
            </section>

            {/* Section 2: Infinite 3D Ticket Cover Flow Carousel (No Edit Button) */}
            <section id="tickets-3d" className="w-full">
              <TicketCarousel3D
                tickets={tickets}
                onOpenUploadModal={openUploadModal}
                onEditTicket={handleSaveTicket}
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
                onOpenUploadForDestination={(dest) => openUploadModal({
                    destinationCity: dest.city,
                    destinationCode: dest.code,
                    departingDate: dest.targetDate || new Date().toISOString().split('T')[0],
                })}
                onAddDestination={handleAddDestination}
                onDeleteDestination={handleDeleteDestination}
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
              heroImage={heroImage}
              onUpdateHeroImage={setHeroImage}
              onAddTicket={(newTicket) => handleSaveTicket(newTicket)}
              onUpdateTicket={(updated) => handleSaveTicket(updated)}
              onDeleteTicket={handleDeleteTicket}
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
