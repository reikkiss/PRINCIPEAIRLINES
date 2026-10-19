import React, { useState, useMemo } from 'react';
import { BoardingTicket, DestinationItem } from '../types';
import { getAirportByCode, getAirportByCity } from '../utils/airportLookup';

interface InteractiveFlightMapProps {
  tickets: BoardingTicket[];
  destinations: DestinationItem[];
  onOpenUploadModal: (prefill?: Partial<BoardingTicket>) => void;
  onSelectTicket?: (ticket: BoardingTicket) => void;
  onToggleDestination?: (destId: string) => void;
}

export const InteractiveFlightMap: React.FC<InteractiveFlightMapProps> = ({
  tickets,
  destinations,
  onSelectTicket,
}) => {
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);

  // Helper to find ticket by airport code or associated ID
  const getTicketForCode = (dest: DestinationItem) => {
    return tickets.find(
      (t) =>
        t.id === dest.associatedTicketId ||
        t.destinationCode.toUpperCase() === dest.code.toUpperCase()
    );
  };

  // Dynamic Flight Arcs and Nodes computed strictly from real tickets and destinations in database
  const { flightRoutes, mapNodes } = useMemo(() => {
    const routes: {
      id: string;
      ox: number;
      oy: number;
      dx: number;
      dy: number;
      mx: number;
      my: number;
      ticket: BoardingTicket;
    }[] = [];

    const nodesMap = new Map<string, {
      code: string;
      city: string;
      country?: string;
      x: number;
      y: number;
      isOrigin: boolean;
      ticket?: BoardingTicket;
    }>();

    // Helper to calculate SVG (x, y) from coordinates
    const toCoords = (lat: number, lng: number) => {
      const x = ((lng + 180) / 360) * 1000;
      const y = ((90 - lat) / 180) * 500;
      return { x, y };
    };

    // Helper to get coordinates for city/code
    const getCoords = (code: string, city: string, savedLat?: number, savedLng?: number) => {
      if (savedLat !== undefined && savedLng !== undefined && (savedLat !== 0 || savedLng !== 0)) {
        return { lat: savedLat, lng: savedLng };
      }
      const fromCode = getAirportByCode(code);
      if (fromCode) return { lat: fromCode.lat, lng: fromCode.lng };
      const fromCity = getAirportByCity(city);
      if (fromCity) return { lat: fromCity.lat, lng: fromCity.lng };
      return null;
    };

    // 1. Process all tickets in the database
    tickets.forEach((ticket) => {
      const origin = getCoords(
        ticket.departingCode,
        ticket.departingCity,
        ticket.departingLat,
        ticket.departingLng
      );
      const dest = getCoords(
        ticket.destinationCode,
        ticket.destinationCity,
        ticket.destinationLat ?? ticket.lat,
        ticket.destinationLng ?? ticket.lng
      );

      if (origin) {
        const { x, y } = toCoords(origin.lat, origin.lng);
        const origCode = ticket.departingCode.toUpperCase();
        if (!nodesMap.has(origCode)) {
          nodesMap.set(origCode, {
            code: origCode,
            city: ticket.departingCity,
            country: ticket.departingCountry,
            x,
            y,
            isOrigin: true,
            ticket,
          });
        }
      }

      if (dest) {
        const { x, y } = toCoords(dest.lat, dest.lng);
        const destCode = ticket.destinationCode.toUpperCase();
        nodesMap.set(destCode, {
          code: destCode,
          city: ticket.destinationCity,
          country: ticket.destinationCountry,
          x,
          y,
          isOrigin: false,
          ticket,
        });
      }

      if (origin && dest) {
        const oSvg = toCoords(origin.lat, origin.lng);
        const dSvg = toCoords(dest.lat, dest.lng);
        const mx = (oSvg.x + dSvg.x) / 2;
        const distance = Math.hypot(dSvg.x - oSvg.x, dSvg.y - oSvg.y);
        const curveOffset = Math.min(80, Math.max(25, distance * 0.22));
        const my = Math.min(oSvg.y, dSvg.y) - curveOffset;

        routes.push({
          id: ticket.id,
          ox: oSvg.x,
          oy: oSvg.y,
          dx: dSvg.x,
          dy: dSvg.y,
          mx,
          my,
          ticket,
        });
      }
    });

    // 2. Process all destinations in the database
    destinations.forEach((dest) => {
      const coords = getCoords(dest.code, dest.city, dest.lat, dest.lng);
      if (coords) {
        const { x, y } = toCoords(coords.lat, coords.lng);
        const codeUpper = dest.code.toUpperCase();
        if (!nodesMap.has(codeUpper)) {
          const matchedTicket = tickets.find(
            (t) => t.id === dest.associatedTicketId || t.destinationCode.toUpperCase() === codeUpper
          );
          nodesMap.set(codeUpper, {
            code: codeUpper,
            city: dest.city,
            country: dest.country,
            x,
            y,
            isOrigin: false,
            ticket: matchedTicket,
          });
        }
      }
    });

    return {
      flightRoutes: routes,
      mapNodes: Array.from(nodesMap.values()),
    };
  }, [tickets, destinations]);

  return (
    <div className="relative w-full min-h-[75vh] sm:min-h-[85vh] bg-[#000000] text-white overflow-hidden flex flex-col justify-center items-center py-6 px-2 sm:px-6">
      {/* Accurate Neon Glow World Map Canvas */}
      <div className="relative w-full max-w-7xl flex items-center justify-center overflow-hidden">
        <svg
          viewBox="0 0 1000 500"
          className="w-full h-full max-h-[720px] select-none"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Multi-stage Electric Blue Neon Glow Filters matching the reference image */}
            <filter id="neon-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="1.5" result="coloredBlur1" />
              <feGaussianBlur stdDeviation="4.5" result="coloredBlur2" />
              <feGaussianBlur stdDeviation="9" result="coloredBlur3" />
              <feMerge>
                <feMergeNode in="coloredBlur3" />
                <feMergeNode in="coloredBlur2" />
                <feMergeNode in="coloredBlur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Flight Arc Trajectory Gradient */}
            <linearGradient id="neon-route-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FACC15" />
              <stop offset="50%" stopColor="#FB923C" />
              <stop offset="100%" stopColor="#F43F5E" />
            </linearGradient>

            <filter id="arc-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* ACCURATE WORLD MAP CONTINENTS & ISLAND OUTLINES (Matching User Image) */}
          <g
            fill="none"
            stroke="#3B82F6"
            strokeWidth="1.6"
            strokeLinejoin="round"
            strokeLinecap="round"
            filter="url(#neon-glow)"
          >
            {/* North America: Alaska, Canada, USA, Mexico, Baja, Florida */}
            <path
              d="M 90,85 
                 L 115,75 L 140,82 L 155,70 L 175,76 L 195,68 L 220,72 L 235,62 L 255,75 
                 L 275,85 L 290,110 L 295,135 L 280,148 L 290,170 L 265,185 L 250,210 
                 L 240,240 L 220,250 L 205,275 L 190,295 L 175,290 L 180,265 L 165,240 
                 L 155,200 L 142,165 L 125,140 L 105,120 L 90,95 Z
                 M 160,245 L 170,270 L 165,285 L 158,260 Z
                 M 260,205 L 285,215 L 288,235 L 272,235 Z"
            />

            {/* Greenland */}
            <path
              d="M 320,40 L 365,30 L 385,55 L 360,95 L 340,90 L 315,65 Z"
            />

            {/* Canadian Arctic Archipelago Islands */}
            <path
              d="M 190,45 L 210,40 L 225,50 L 205,58 Z
                 M 235,35 L 255,42 L 245,55 Z
                 M 270,45 L 290,52 L 280,62 Z"
            />

            {/* Caribbean Islands */}
            <path
              d="M 235,245 L 260,242 L 275,248 M 285,250 L 305,255"
            />

            {/* South America: Colombia, Brazil, Peru, Chile, Argentina, Tierra del Fuego */}
            <path
              d="M 225,295 
                 L 245,285 L 275,290 L 315,310 L 345,335 L 352,365 L 335,400 L 310,440 
                 L 290,480 L 275,475 L 280,440 L 260,390 L 245,345 L 235,325 L 225,295 Z
                 M 280,485 L 292,492 L 282,496 Z"
            />

            {/* Europe: Scandinavia, UK, Ireland, Iberia, France, Italy, Greece, Balkans */}
            <path
              d="M 440,165 
                 L 460,150 L 485,155 L 505,145 L 525,155 L 540,140 L 565,145 L 580,160 
                 L 570,185 L 550,195 L 530,190 L 515,205 L 490,205 L 475,225 L 450,225 
                 L 435,200 L 440,165 Z"
            />
            {/* British Isles (UK & Ireland) */}
            <path
              d="M 445,120 L 460,115 L 458,142 L 442,148 Z
                 M 430,128 L 440,126 L 438,142 L 428,138 Z"
            />
            {/* Scandinavia (Norway, Sweden, Finland) */}
            <path
              d="M 485,65 L 515,55 L 535,70 L 530,115 L 510,135 L 490,120 L 478,85 Z"
            />
            {/* Italy Boot & Sicily */}
            <path
              d="M 495,190 L 508,205 L 518,225 L 508,228 Z
                 M 505,235 L 515,238 L 508,242 Z"
            />

            {/* Africa: North Africa, West Africa, Horn of Africa, South Africa, Madagascar */}
            <path
              d="M 435,225 
                 L 485,220 L 545,230 L 575,260 L 590,300 L 560,345 L 540,410 L 515,445 
                 L 495,440 L 485,385 L 455,340 L 435,295 L 415,275 L 418,245 L 435,225 Z
                 M 580,370 L 595,360 L 602,405 L 588,415 Z"
            />

            {/* Middle East & Arabian Peninsula */}
            <path
              d="M 545,225 L 580,225 L 610,250 L 600,285 L 575,280 L 555,250 Z"
            />

            {/* Asia: Russia, Central Asia, China, India, Indochina, Korea, Japan */}
            <path
              d="M 580,140 
                 L 640,120 L 720,95 L 810,85 L 860,105 L 895,130 L 880,175 L 840,195 
                 L 810,240 L 775,255 L 745,245 L 720,285 L 680,290 L 665,240 L 630,220 
                 L 590,200 L 580,140 Z"
            />
            {/* Indian Subcontinent & Sri Lanka */}
            <path
              d="M 665,240 L 705,245 L 715,295 L 685,330 L 660,285 Z
                 M 700,340 L 708,342 L 704,355 Z"
            />
            {/* Korean Peninsula */}
            <path
              d="M 808,195 L 820,198 L 818,220 L 808,215 Z"
            />
            {/* Japanese Archipelago (Honshu, Hokkaido, Kyushu) */}
            <path
              d="M 855,160 L 870,165 L 862,185 Z
                 M 845,185 L 860,200 L 848,225 L 835,215 Z"
            />

            {/* Southeast Asia Archipelago: Sumatra, Java, Borneo, Philippines */}
            <path
              d="M 725,305 L 755,335 L 740,355 Z
                 M 750,360 L 790,365 L 775,375 Z
                 M 770,315 L 795,310 L 790,340 Z
                 M 805,275 L 820,290 L 810,325 Z
                 M 825,330 L 870,335 L 850,360 Z"
            />

            {/* Australia & Tasmania */}
            <path
              d="M 760,380 
                 L 810,365 L 855,385 L 870,430 L 830,465 L 775,455 L 755,420 Z
                 M 840,480 L 852,482 L 846,495 Z"
            />

            {/* New Zealand (North Island & South Island) */}
            <path
              d="M 895,430 L 912,438 L 902,455 Z
                 M 880,458 L 898,470 L 888,495 L 872,485 Z"
            />
          </g>

          {/* DYNAMIC GLOWING FLIGHT TRAJECTORIES (Computed strictly from tickets in database) */}
          <g filter="url(#arc-glow)">
            {flightRoutes.map((route) => (
              <g key={`route-${route.id}`} className="group cursor-pointer" onClick={() => onSelectTicket?.(route.ticket)}>
                {/* Outer Glow Arc */}
                <path
                  d={`M ${route.ox},${route.oy} Q ${route.mx},${route.my} ${route.dx},${route.dy}`}
                  fill="none"
                  stroke="url(#neon-route-grad)"
                  strokeWidth="2.5"
                  className="opacity-90 group-hover:opacity-100 transition-opacity"
                />
                {/* Animated Dash Trajectory */}
                <path
                  d={`M ${route.ox},${route.oy} Q ${route.mx},${route.my} ${route.dx},${route.dy}`}
                  fill="none"
                  stroke="#60A5FA"
                  strokeWidth="1.2"
                  strokeDasharray="5 5"
                  className="opacity-80"
                />
              </g>
            ))}
          </g>

          {/* DYNAMIC NODES & GLOWING PINS (Computed strictly from database) */}
          {mapNodes.map((node) => {
            const isHovered = hoveredCity === node.code;

            return (
              <g
                key={`node-${node.code}`}
                className="cursor-pointer group"
                onMouseEnter={() => setHoveredCity(node.code)}
                onMouseLeave={() => setHoveredCity(null)}
                onClick={() => {
                  if (node.ticket && onSelectTicket) {
                    onSelectTicket(node.ticket);
                  }
                }}
              >
                {/* Pulsing Radar Ring for Origins and Active Hubs */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isHovered ? 14 : 9}
                  fill="none"
                  stroke={node.isOrigin ? '#60A5FA' : '#FACC15'}
                  strokeWidth="1.5"
                  opacity="0.8"
                >
                  <animate attributeName="r" values="5;15;5" dur="3s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.8;0.2;0.8" dur="3s" repeatCount="indefinite" />
                </circle>

                {/* Core Node Circle */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isHovered ? 6 : 4.5}
                  fill={node.isOrigin ? '#60A5FA' : '#FACC15'}
                  stroke="#FFF"
                  strokeWidth="1.5"
                  className="transition-all duration-200"
                />

                {/* Permanent Airport Code Badge */}
                <text
                  x={node.x}
                  y={node.y + 14}
                  fill={node.isOrigin ? '#60A5FA' : '#FACC15'}
                  fontSize="9"
                  fontWeight="bold"
                  fontFamily="monospace"
                  textAnchor="middle"
                  className="select-none drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]"
                >
                  {node.code}
                </text>

                {/* City name popup on hover */}
                {isHovered && (
                  <g>
                    <rect
                      x={node.x - 55}
                      y={node.y - 30}
                      width="110"
                      height="20"
                      rx="4"
                      fill="#0F172A"
                      stroke="#FACC15"
                      strokeWidth="1"
                    />
                    <text
                      x={node.x}
                      y={node.y - 16}
                      fill="#FFF"
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {`${node.city} (${node.code})`}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
