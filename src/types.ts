export type Language = 'es' | 'en';

export interface Project {
  id: string;
  title: string;
  client: string;
  year: string;
  category: 'packaging' | 'branding' | 'lettering' | 'creative-direction';
  categoryLabel: { es: string; en: string };
  tagline: { es: string; en: string };
  description: { es: string; en: string };
  challenge: { es: string; en: string };
  solution: { es: string; en: string };
  results: { es: string[]; en: string[] };
  specs: {
    materials?: string;
    finishes?: string;
    deliverables: string[];
  };
  image: string;
  secondaryImages?: string[];
  awards?: string;
  featured?: boolean;
}

export interface ServiceItem {
  number: string;
  title: { es: string; en: string };
  subtitle: { es: string; en: string };
  description: { es: string; en: string };
  deliverables: { es: string[]; en: string[] };
}

export type TicketStatus = 'WINNER' | 'ORDERED' | 'VIP' | 'IN TRANSIT' | 'BOARDING' | string;

export interface BoardingTicket {
  id: string;
  status: TicketStatus;
  statusColor?: string;
  departingCode: string;
  departingCity: string;
  departingCountry?: string;
  departingRegion?: string;
  destinationCode: string;
  destinationCity: string;
  destinationCountry?: string;
  destinationRegion?: string;
  departingDate: string;
  returnDate?: string;
  packageContents: string; // Passenger or package name
  forRecipient: string;    // Recipient name
  photoUrl: string;        // URL or base64 data
  photoFilter?: 'halftone' | 'grayscale' | 'contrast' | 'none';
  barcode1: string;
  barcode2: string;
  carrierName?: string;
  campaignLabel?: string;
  seatOrGate?: string;
  flightNumber?: string;
  experienceStory?: string;
  lat?: number;
  lng?: number;
  departingLat?: number;
  departingLng?: number;
  destinationLat?: number;
  destinationLng?: number;
  createdAt: string;
}

export type WorldRegion = 'Europe' | 'Asia' | 'Africa' | 'Americas' | 'Oceania';

export interface DestinationItem {
  id: string;
  city: string;
  country: string;
  code: string;
  region: WorldRegion;
  completed: boolean;
  targetDate?: string;
  completedDate?: string;
  experienceNotes?: string;
  associatedTicketId?: string;
  lat: number;
  lng: number;
}

export interface AppleMusicTrack {
  id: string | number;
  title: string;
  artist: string;
  album?: string;
  artworkUrl?: string;
  previewUrl?: string; // 30s AAC audio preview
  appleMusicUrl?: string; // Link to song in Apple Music
}

export interface LoveLetter {
  id: string;
  title: string;
  recipient: string;       // Para (ej: "Mi amor", "Mi príncipe", "Para ti mi vida")
  sender: string;          // De (ej: "Tu novia", "Tu amor")
  date: string;            // Fecha especial
  originCity?: string;     // Ciudad de origen o recuerdo
  destinationCity?: string;// Ciudad de destino o soñada juntos
  content: string;         // Mensaje / Cuerpo de la carta de amor
  photoUrl?: string;       // Foto romántica de recuerdo juntos
  paperStyle?: 'linen' | 'parchment' | 'airmail' | 'kraft' | 'rose';
  stampType?: 'kiwi50' | 'versal' | 'airmail' | 'wax' | 'heart-crown';
  waxSealColor?: 'crimson' | 'gold' | 'rose' | 'navy';
  mood?: 'romantica' | 'nostalgica' | 'divertida' | 'para-siempre' | 'aniversario';
  specialSong?: string;
  appleMusicTrack?: AppleMusicTrack; // Apple Music track information & playable preview
  isLockedUntilDate?: boolean;       // Bloquear carta con cuenta regresiva
  unlockDate?: string;              // Fecha y hora exacta de desbloqueo (ISO string)
  createdAt: string;
}

// Backward-compatible alias so existing imports work seamlessly
export type TravelLetter = LoveLetter;
