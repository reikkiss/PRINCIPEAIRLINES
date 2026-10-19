import airportsRaw from '../data/airportsList.json';
import { WorldRegion } from '../types';

export interface AirportItem {
  iata: string;
  city: string;
  country: string;
  name: string;
  lat: number;
  lng: number;
  region: WorldRegion;
}

// Country -> WorldRegion classification
const REGION_MAP: Record<string, WorldRegion> = {
  // Europe
  'United Kingdom': 'Europe',
  'France': 'Europe',
  'Germany': 'Europe',
  'Italy': 'Europe',
  'Spain': 'Europe',
  'Portugal': 'Europe',
  'Greece': 'Europe',
  'Netherlands': 'Europe',
  'Belgium': 'Europe',
  'Switzerland': 'Europe',
  'Austria': 'Europe',
  'Ireland': 'Europe',
  'Sweden': 'Europe',
  'Norway': 'Europe',
  'Denmark': 'Europe',
  'Finland': 'Europe',
  'Iceland': 'Europe',
  'Poland': 'Europe',
  'Czech Republic': 'Europe',
  'Hungary': 'Europe',
  'Romania': 'Europe',
  'Croatia': 'Europe',
  'Turkey': 'Europe',
  'Cyprus': 'Europe',
  'Russia': 'Europe',
  'Ukraine': 'Europe',
  'Slovakia': 'Europe',
  'Slovenia': 'Europe',
  'Bulgaria': 'Europe',
  'Serbia': 'Europe',
  'Montenegro': 'Europe',
  'Bosnia and Herzegovina': 'Europe',
  'Albania': 'Europe',
  'North Macedonia': 'Europe',
  'Estonia': 'Europe',
  'Latvia': 'Europe',
  'Lithuania': 'Europe',
  'Malta': 'Europe',
  'Luxembourg': 'Europe',

  // Americas
  'United States': 'Americas',
  'Canada': 'Americas',
  'Mexico': 'Americas',
  'Brazil': 'Americas',
  'Argentina': 'Americas',
  'Colombia': 'Americas',
  'Chile': 'Americas',
  'Peru': 'Americas',
  'Ecuador': 'Americas',
  'Bolivia': 'Americas',
  'Paraguay': 'Americas',
  'Uruguay': 'Americas',
  'Venezuela': 'Americas',
  'Panama': 'Americas',
  'Costa Rica': 'Americas',
  'Nicaragua': 'Americas',
  'Honduras': 'Americas',
  'El Salvador': 'Americas',
  'Guatemala': 'Americas',
  'Belize': 'Americas',
  'Cuba': 'Americas',
  'Dominican Republic': 'Americas',
  'Puerto Rico': 'Americas',
  'Jamaica': 'Americas',
  'Bahamas': 'Americas',
  'Haiti': 'Americas',
  'Trinidad and Tobago': 'Americas',
  'Barbados': 'Americas',
  'Aruba': 'Americas',
  'Curacao': 'Americas',

  // Asia
  'Japan': 'Asia',
  'South Korea': 'Asia',
  'Korea': 'Asia',
  'China': 'Asia',
  'Taiwan': 'Asia',
  'Hong Kong': 'Asia',
  'India': 'Asia',
  'Thailand': 'Asia',
  'Vietnam': 'Asia',
  'Singapore': 'Asia',
  'Malaysia': 'Asia',
  'Indonesia': 'Asia',
  'Philippines': 'Asia',
  'United Arab Emirates': 'Asia',
  'Qatar': 'Asia',
  'Saudi Arabia': 'Asia',
  'Oman': 'Asia',
  'Kuwait': 'Asia',
  'Bahrain': 'Asia',
  'Israel': 'Asia',
  'Jordan': 'Asia',
  'Lebanon': 'Asia',
  'Maldives': 'Asia',
  'Nepal': 'Asia',
  'Sri Lanka': 'Asia',
  'Cambodia': 'Asia',
  'Laos': 'Asia',
  'Myanmar': 'Asia',
  'Kazakhstan': 'Asia',
  'Uzbekistan': 'Asia',
  'Pakistan': 'Asia',
  'Bangladesh': 'Asia',

  // Oceania
  'Australia': 'Oceania',
  'New Zealand': 'Oceania',
  'Fiji': 'Oceania',
  'Papua New Guinea': 'Oceania',
  'Samoa': 'Oceania',
  'French Polynesia': 'Oceania',
  'Tonga': 'Oceania',
  'Vanuatu': 'Oceania',
  'New Caledonia': 'Oceania',
  'Guam': 'Oceania',
  'Cook Islands': 'Oceania',
  'Solomon Islands': 'Oceania',

  // Africa
  'South Africa': 'Africa',
  'Egypt': 'Africa',
  'Morocco': 'Africa',
  'Kenya': 'Africa',
  'Tanzania': 'Africa',
  'Nigeria': 'Africa',
  'Ghana': 'Africa',
  'Ethiopia': 'Africa',
  'Uganda': 'Africa',
  'Rwanda': 'Africa',
  'Mauritius': 'Africa',
  'Seychelles': 'Africa',
  'Madagascar': 'Africa',
  'Tunisia': 'Africa',
  'Algeria': 'Africa',
  'Senegal': 'Africa',
  'Ivory Coast': 'Africa',
  'Namibia': 'Africa',
  'Zimbabwe': 'Africa',
  'Botswana': 'Africa',
};

// Spanish <-> English common city aliases
const SPANISH_CITY_ALIASES: Record<string, string> = {
  'florencia': 'florence',
  'tokio': 'tokyo',
  'nueva york': 'new york',
  'londres': 'london',
  'paris': 'paris',
  'parís': 'paris',
  'roma': 'rome',
  'atenas': 'athens',
  'viena': 'vienna',
  'munich': 'munich',
  'múnich': 'munich',
  'berlin': 'berlin',
  'berlín': 'berlin',
  'praga': 'prague',
  'amsterdam': 'amsterdam',
  'ámsterdam': 'amsterdam',
  'seul': 'seoul',
  'seúl': 'seoul',
  'pekin': 'beijing',
  'pekín': 'beijing',
  'moscu': 'moscow',
  'moscú': 'moscow',
  'ginebra': 'geneva',
  'bruselas': 'brussels',
  'venecia': 'venice',
  'milan': 'milan',
  'milán': 'milan',
  'lisboa': 'lisbon',
  'cancun': 'cancun',
  'cancún': 'cancun',
  'bogota': 'bogota',
  'bogotá': 'bogota',
  'medellin': 'medellin',
  'medellín': 'medellin',
  'santiago': 'santiago',
  'lima': 'lima',
  'cartagena': 'cartagena',
  'buenos aires': 'buenos aires',
  'rio de janeiro': 'rio de janeiro',
  'río de janeiro': 'rio de janeiro',
  'san pablo': 'sao paulo',
  'sao paulo': 'sao paulo',
  'sidney': 'sydney',
  'sídney': 'sydney',
  'auckland': 'auckland',
  'el cairo': 'cairo',
  'cairo': 'cairo',
  'dubai': 'dubai',
  'dubái': 'dubai',
  'doha': 'doha',
  'madrid': 'madrid',
  'barcelona': 'barcelona',
  'varsovia': 'warsaw',
  'estambul': 'istanbul',
  'edimburgo': 'edinburgh',
  'dublin': 'dublin',
  'dublín': 'dublin',
  'reikiavik': 'reykjavik',
  'los angeles': 'los angeles',
  'los ángeles': 'los angeles',
  'san francisco': 'san francisco',
  'miami': 'miami',
  'chicago': 'chicago',
  'toronto': 'toronto',
  'vancouver': 'vancouver',
};

// Normalize string (remove diacritics / accents, lowercase)
export const normalizeText = (text: string): string => {
  return (text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
};

export const getRegionForCountry = (country: string): WorldRegion => {
  if (!country) return 'Europe';
  const clean = country.trim();
  if (REGION_MAP[clean]) return REGION_MAP[clean];

  const lower = clean.toLowerCase();
  if (lower.includes('island') || lower.includes('zealand') || lower.includes('australia')) return 'Oceania';
  if (lower.includes('america') || lower.includes('states') || lower.includes('canada') || lower.includes('mexico')) return 'Americas';
  if (lower.includes('asia') || lower.includes('china') || lower.includes('japan') || lower.includes('korea')) return 'Asia';
  if (lower.includes('africa') || lower.includes('egypt') || lower.includes('congo')) return 'Africa';
  return 'Europe';
};

// Pre-load and transform airports
const AIRPORTS: AirportItem[] = (airportsRaw as unknown as [string, string, string, string, number, number][]).map(
  ([iata, city, country, name, lat, lng]) => ({
    iata,
    city,
    country,
    name,
    lat,
    lng,
    region: getRegionForCountry(country),
  })
);

/**
 * Searches airports by query (matching city, IATA code, name, country).
 * Supports both Spanish and English city names with accent-insensitive search.
 */
export const searchAirports = (rawQuery: string, limit: number = 8): AirportItem[] => {
  const q = normalizeText(rawQuery);
  if (!q) return [];

  const alias = SPANISH_CITY_ALIASES[q] || q;

  // Score matches for natural ranking
  const matched: { item: AirportItem; score: number }[] = [];

  for (const item of AIRPORTS) {
    const normIata = item.iata.toLowerCase();
    const normCity = normalizeText(item.city);
    const normName = normalizeText(item.name);
    const normCountry = normalizeText(item.country);

    let score = 0;

    // 1. Exact IATA match
    if (normIata === q) {
      score += 100;
    } else if (normIata.startsWith(q)) {
      score += 50;
    }

    // 2. Exact City match (Spanish alias or English)
    if (normCity === q || normCity === alias) {
      score += 80;
    } else if (normCity.startsWith(q) || normCity.startsWith(alias)) {
      score += 40;
    } else if (normCity.includes(q) || normCity.includes(alias)) {
      score += 20;
    }

    // 3. Name or Country match
    if (normName.includes(q) || normName.includes(alias)) {
      score += 15;
    }
    if (normCountry === q || normCountry.startsWith(q)) {
      score += 10;
    }

    if (score > 0) {
      // Prioritize primary/intl airports
      if (item.name.toLowerCase().includes('intl') || item.name.toLowerCase().includes('international')) {
        score += 5;
      }
      matched.push({ item, score });
    }
  }

  // Sort by highest score first
  matched.sort((a, b) => b.score - a.score);

  return matched.slice(0, limit).map((m) => m.item);
};

/**
 * Lookup by exact 3-letter IATA code
 */
export const getAirportByCode = (code: string): AirportItem | null => {
  if (!code) return null;
  const clean = code.trim().toUpperCase();
  return AIRPORTS.find((a) => a.iata === clean) || null;
};

/**
 * Lookup by City name (best match)
 */
export const getAirportByCity = (cityName: string): AirportItem | null => {
  if (!cityName) return null;
  const results = searchAirports(cityName, 1);
  return results.length > 0 ? results[0] : null;
};
