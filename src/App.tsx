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
import { LetterCountdownLockModal } from './components/LetterCountdownLockModal';
import { isLetterLocked } from './components/LetterCard';
import { DateLockModal } from './components/DateLockModal';
import { INITIAL_LETTERS } from './data/lettersData';
import { INITIAL_TICKETS } from './data/ticketsData';
import { INITIAL_DESTINATIONS } from './data/destinationsData';
import { compressImage } from './utils/imageCompressor';

import { BoardingTicket, DestinationItem, TravelLetter, WorldRegion } from './types';
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

  // 1. Tickets state with Firestore persistence (starts empty, no auto-seeding)
  const [tickets, setTickets] = useState<BoardingTicket[]>([]);
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'tickets'), (snapshot) => {
      if (snapshot.empty) {
        setTickets([]);
      } else {
        const data = snapshot.docs.map((doc) => doc.data() as BoardingTicket);
        setTickets(data);
      }
    }, (error) => {
      console.error('Firestore tickets listener error:', error);
    });
    return unsub;
  }, []);

  // 2. Destinations state with Firestore persistence (starts empty, no auto-seeding)
  const [destinations, setDestinations] = useState<DestinationItem[]>([]);
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'destinations'), (snapshot) => {
      if (snapshot.empty) {
        setDestinations([]);
      } else {
        const data = snapshot.docs.map((doc) => doc.data() as DestinationItem);
        setDestinations(data);
      }
    }, (error) => {
      console.error('Firestore destinations listener error:', error);
    });
    return unsub;
  }, []);

  // 3. Letters state with Firestore persistence (starts empty, no auto-seeding)
  const [letters, setLetters] = useState<TravelLetter[]>([]);
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'letters'), (snapshot) => {
      if (snapshot.empty) {
        setLetters([]);
      } else {
        const data = snapshot.docs.map((doc) => doc.data() as TravelLetter);
        setLetters(data);
      }
    }, (error) => {
      console.error('Firestore letters listener error:', error);
    });
    return unsub;
  }, []);

  // 4. Hero image state with Firestore settings sync & localStorage fallback
  const [heroImage, setHeroImage] = useState<string>(() => {
    try {
      return localStorage.getItem('principe_hero_image') || heroImgFile;
    } catch {
      return heroImgFile;
    }
  });

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'hero'), (docSnap) => {
      if (docSnap.exists() && docSnap.data()?.heroImage) {
        const cloudImg = docSnap.data().heroImage;
        setHeroImage(cloudImg);
        try {
          localStorage.setItem('principe_hero_image', cloudImg);
        } catch {}
      }
    }, (error) => {
      console.error('Firestore settings listener error:', error);
    });
    return unsub;
  }, []);

  // Handler to persist hero image directly in Firestore
  const handleUpdateHeroImage = async (newImage: string) => {
    try {
      let finalImg = newImage;
      if (finalImg.startsWith('data:image') && finalImg.length > 500000) {
        finalImg = await compressImage(finalImg, 1200, 1200, 0.7);
      }
      setHeroImage(finalImg);
      try {
        localStorage.setItem('principe_hero_image', finalImg);
      } catch {}

      await setDoc(doc(db, 'settings', 'hero'), {
        id: 'hero',
        heroImage: finalImg,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error saving hero image to Firestore:', error);
    }
  };

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

  // Letter Reader, Countdown Lock & Editor Modal States
  const [selectedLetterForReader, setSelectedLetterForReader] = useState<TravelLetter | null>(null);
  const [lockedLetterForCountdown, setLockedLetterForCountdown] = useState<TravelLetter | null>(null);
  const [letterEditorState, setLetterEditorState] = useState<{
    isOpen: boolean;
    initialData?: Partial<TravelLetter> | null;
  }>({
    isOpen: false,
    initialData: null,
  });

  // Handle opening letter: check if locked with countdown or unlocked
  const handleOpenLetter = (letter: TravelLetter) => {
    if (isLetterLocked(letter)) {
      setLockedLetterForCountdown(letter);
    } else {
      setSelectedLetterForReader(letter);
    }
  };

  // Handlers for Tickets with Firestore persistence & image safety
  const handleSaveTicket = async (ticket: BoardingTicket) => {
    try {
      let finalTicket = { ...ticket };

      // Ensure photoUrl is compressed if it exceeds 500KB to prevent Firestore 1MB document errors
      if (finalTicket.photoUrl && finalTicket.photoUrl.startsWith('data:image') && finalTicket.photoUrl.length > 500000) {
        finalTicket.photoUrl = await compressImage(finalTicket.photoUrl, 900, 900, 0.65);
      }

      // Optimistic local update
      setTickets((prev) => {
        const idx = prev.findIndex((t) => t.id === finalTicket.id);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = finalTicket;
          return updated;
        }
        return [finalTicket, ...prev];
      });

      // Remove undefined values to prevent Firestore errors
      const sanitizedTicket = JSON.parse(JSON.stringify(finalTicket));
      await setDoc(doc(db, 'tickets', finalTicket.id), sanitizedTicket);

      // Also ensure corresponding destination exists and is synced in destinations collection
      if (finalTicket.destinationCode && finalTicket.destinationCity) {
        const destCodeUpper = finalTicket.destinationCode.toUpperCase().trim();
        const existingDest = destinations.find(
          (d) => d.associatedTicketId === finalTicket.id || d.code.toUpperCase() === destCodeUpper
        );

        if (existingDest) {
          const updatedDest = {
            ...existingDest,
            city: finalTicket.destinationCity,
            code: destCodeUpper,
            country: finalTicket.destinationCountry || existingDest.country,
            region: (finalTicket.destinationRegion as WorldRegion) || existingDest.region,
            associatedTicketId: finalTicket.id,
            completed: true,
            completedDate: existingDest.completedDate || new Date().toISOString().split('T')[0],
            lat: finalTicket.destinationLat ?? finalTicket.lat ?? existingDest.lat,
            lng: finalTicket.destinationLng ?? finalTicket.lng ?? existingDest.lng,
          };
          await setDoc(doc(db, 'destinations', existingDest.id), JSON.parse(JSON.stringify(updatedDest)));
        } else {
          const newDestId = `dest-${finalTicket.id}`;
          const newDest: DestinationItem = {
            id: newDestId,
            city: finalTicket.destinationCity,
            code: destCodeUpper,
            country: finalTicket.destinationCountry || 'International',
            region: (finalTicket.destinationRegion as WorldRegion) || 'Europe',
            completed: true,
            completedDate: new Date().toISOString().split('T')[0],
            associatedTicketId: finalTicket.id,
            experienceNotes: 'Boleto registrado y experiencia de viaje.',
            lat: finalTicket.destinationLat ?? finalTicket.lat ?? 0,
            lng: finalTicket.destinationLng ?? finalTicket.lng ?? 0,
          };
          await setDoc(doc(db, 'destinations', newDestId), JSON.parse(JSON.stringify(newDest)));
        }
      }
    } catch (error) {
      console.error('Error saving ticket to Firestore:', error);
      alert('Error al guardar el boleto en la base de datos. Por favor verifica tu conexión.');
    }
  };

  const handleDeleteTicket = async (ticketId: string) => {
    try {
      setTickets((prev) => prev.filter((t) => t.id !== ticketId));
      await deleteDoc(doc(db, 'tickets', ticketId));
      // Delete any destination that was exclusively tied to this ticket
      const tiedDest = destinations.find((d) => d.associatedTicketId === ticketId || d.id === `dest-${ticketId}`);
      if (tiedDest) {
        setDestinations((prev) => prev.filter((d) => d.id !== tiedDest.id));
        await deleteDoc(doc(db, 'destinations', tiedDest.id));
      }
    } catch (error) {
      console.error('Error deleting ticket from Firestore:', error);
    }
  };

  const handleToggleDestination = async (destId: string) => {
    const dest = destinations.find((d) => d.id === destId);
    if (!dest) return;
    try {
      const updatedDest = {
        ...dest,
        completed: !dest.completed,
        completedDate: !dest.completed ? new Date().toISOString().split('T')[0] : null,
      };
      setDestinations((prev) => prev.map((d) => (d.id === destId ? updatedDest : d)));
      const sanitizedDest = JSON.parse(JSON.stringify(updatedDest));
      await setDoc(doc(db, 'destinations', destId), sanitizedDest);
    } catch (error) {
      console.error('Error toggling destination in Firestore:', error);
    }
  };

  const handleAddDestination = async (newDest: Omit<DestinationItem, 'id'>) => {
    const id = `dest-${Date.now()}`;
    try {
      const fullDest = { ...newDest, id };
      setDestinations((prev) => [...prev, fullDest]);
      const sanitizedDest = JSON.parse(JSON.stringify(fullDest));
      await setDoc(doc(db, 'destinations', id), sanitizedDest);
    } catch (error) {
      console.error('Error adding destination to Firestore:', error);
    }
  };

  const handleDeleteDestination = async (destId: string) => {
    try {
      setDestinations((prev) => prev.filter((d) => d.id !== destId));
      await deleteDoc(doc(db, 'destinations', destId));
    } catch (error) {
      console.error('Error deleting destination from Firestore:', error);
    }
  };

  const handleSaveLetter = async (letter: TravelLetter) => {
    try {
      let finalLetter = { ...letter };
      if (finalLetter.photoUrl && finalLetter.photoUrl.startsWith('data:image') && finalLetter.photoUrl.length > 500000) {
        finalLetter.photoUrl = await compressImage(finalLetter.photoUrl, 900, 900, 0.65);
      }

      setLetters((prev) => {
        const idx = prev.findIndex((l) => l.id === finalLetter.id);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = finalLetter;
          return updated;
        }
        return [finalLetter, ...prev];
      });

      const sanitizedLetter = JSON.parse(JSON.stringify(finalLetter));
      await setDoc(doc(db, 'letters', finalLetter.id), sanitizedLetter);
    } catch (error) {
      console.error('Error saving letter to Firestore:', error);
      alert('Error al guardar la carta en la base de datos.');
    }
  };

  const handleDeleteLetter = async (letterId: string) => {
    try {
      setLetters((prev) => prev.filter((l) => l.id !== letterId));
      await deleteDoc(doc(db, 'letters', letterId));
    } catch (error) {
      console.error('Error deleting letter from Firestore:', error);
    }
  };

  const handleDeleteAllDestinations = async () => {
    try {
      const promises = destinations.map((d) => deleteDoc(doc(db, 'destinations', d.id)));
      await Promise.all(promises);
      setDestinations([]);
    } catch (e) {
      console.error('Error deleting all destinations:', e);
    }
  };

  const handleDeleteAllTickets = async () => {
    try {
      const promises = tickets.map((t) => deleteDoc(doc(db, 'tickets', t.id)));
      await Promise.all(promises);
      setTickets([]);
    } catch (e) {
      console.error('Error deleting all tickets:', e);
    }
  };

  const handleDeleteAllLetters = async () => {
    try {
      const promises = letters.map((l) => deleteDoc(doc(db, 'letters', l.id)));
      await Promise.all(promises);
      setLetters([]);
    } catch (e) {
      console.error('Error deleting all letters:', e);
    }
  };

  const handleClearDemoContent = async () => {
    await handleDeleteAllDestinations();
    await handleDeleteAllTickets();
    await handleDeleteAllLetters();
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
                onEditTicket={undefined}
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
              onOpenLetterReader={(letter) => handleOpenLetter(letter)}
            />

            {/* Section 5: Future Destinations & Cities Checklist (Read-only on main page, no add/upload buttons) */}
            <section id="future-destinations" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <FutureDestinationsList
                destinations={destinations}
                tickets={tickets}
                onToggleDestination={handleToggleDestination}
                onOpenUploadForDestination={undefined}
                onAddDestination={undefined}
                onDeleteDestination={undefined}
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
              onUpdateHeroImage={handleUpdateHeroImage}
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
              onDeleteAllDestinations={handleDeleteAllDestinations}
              onDeleteAllTickets={handleDeleteAllTickets}
              onDeleteAllLetters={handleDeleteAllLetters}
              onClearDemoContent={handleClearDemoContent}
              onAddLetter={handleSaveLetter}
              onUpdateLetter={handleSaveLetter}
              onDeleteLetter={handleDeleteLetter}
              onOpenLetterEditor={(prefill) => setLetterEditorState({ isOpen: true, initialData: prefill || null })}
              onOpenLetterReader={(letter) => handleOpenLetter(letter)}
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

        {/* Letter Editor Modal (Create/Edit Travel Letter with Apple Music & Countdown Lock) */}
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

        {/* Letter Countdown Lock Modal (Enforces lock until specified date) */}
        <LetterCountdownLockModal
          letter={lockedLetterForCountdown}
          isOpen={!!lockedLetterForCountdown}
          onClose={() => setLockedLetterForCountdown(null)}
          onOpenLetter={(letter) => {
            setLockedLetterForCountdown(null);
            setSelectedLetterForReader(letter);
          }}
        />
      </div>
    </div>
  );
}
