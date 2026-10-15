import { Project, ServiceItem } from '../types';

export const PROJECTS_DATA: Project[] = [
  {
    id: 'cerveza-2-monos',
    title: 'Cerveza 2 Monos',
    client: '2 Monos Cervecería Artesanal',
    year: '2024',
    category: 'packaging',
    categoryLabel: {
      es: 'Packaging & Identidad Cervecera',
      en: 'Packaging & Craft Brewery Identity',
    },
    tagline: {
      es: 'Identidad visual y sistema de latas para una cervecería irreverente en Santiago.',
      en: 'Visual identity and can packaging system for an irreverent craft brewery in Santiago.',
    },
    description: {
      es: 'Cerveza 2 Monos nació con el mandato de no parecerse a ninguna otra lata en el estante de cerveza artesanal. Diseñamos un universo gráfico impulsado por dos simios hedonistas, tipografías psicodélicas vibrantes y contrastes cromáticos de alto impacto en azul cobalto y magenta neón.',
      en: 'Cerveza 2 Monos was born with the explicit directive to never look like any other can on the craft shelf. We built a graphic universe driven by hedonistic monkey mascots, vibrant psychedelic lettering, and high-impact cobalt blue and neon magenta contrasts.',
    },
    challenge: {
      es: 'El mercado craft chileno está saturado de latas oscuras o minimalistas monótonas. 2 Monos necesitaba interrumpir la vista del consumidor a 3 metros de distancia.',
      en: 'The Chilean craft beer aisle was flooded with monotonous dark or pseudo-minimalist cans. 2 Monos needed to interrupt consumer sightlines from 10 feet away.',
    },
    solution: {
      es: 'Creamos un emblema central con doble mono brindando, rodeado de tipografía líquida hecha a mano y un barniz mate táctil con detalles en brillo UV localizado en el aluminio.',
      en: 'We engineered an iconic central badge with twin toasting primates framed by fluid hand-drawn lettering and a tactile matte varnish with spot UV gloss accents on aluminum.',
    },
    results: {
      es: [
        '+340% de incremento en ventas en canal retail y taprooms.',
        'Primer lote agotado en menos de 10 días de lanzamiento.',
        'Destacado como Referente de Packaging Craft en Chile.',
      ],
      en: [
        '+340% sales increase across retail shelves and taprooms.',
        'First batch sold out in under 10 days of public launch.',
        'Recognized as a benchmark in Latin American craft packaging.',
      ],
    },
    specs: {
      materials: 'Lata de aluminio 473ml con barniz táctil soft-touch',
      finishes: 'Serigrafía rotativa 6 tintas directas + Barniz UV selectivo',
      deliverables: ['Sistema de 4 variedades', 'Vasos y cristalería de taproom', 'Gráfica ambiental', 'Merchandising'],
    },
    image: '/src/assets/images/cerveza_monos_packaging_1792009459206.jpg',
    awards: 'Chile Diseño 2024 Showcase',
    featured: true,
  },
  {
    id: 'boheme-spirits',
    title: 'Boheme Spirits — Aurora',
    client: 'Destilería Boheme & Co.',
    year: '2024',
    category: 'packaging',
    categoryLabel: {
      es: 'Rebranding & Packaging de Destilados',
      en: 'Spirits Rebranding & Bottle Packaging',
    },
    tagline: {
      es: 'Vermouth botánico chileno fusionando estética vintage y tipografía de vanguardia.',
      en: 'Chilean botanical vermouth fusing vintage heritage with cutting-edge typography.',
    },
    description: {
      es: 'Nominado al premio Chile Diseño 2024 en la categoría Rebranding. Boheme requería rediseñar su vermouth artesanal "Aurora" elaborado con botánicos endémicos del Desierto Florido. La etiqueta rinde homenaje a los boticarios del siglo XIX mediante un grabado contemporáneo y estampado en lámina dorada en bajo relieve.',
      en: 'Nominated for the prestigious Chile Diseño Awards 2024 in the Rebranding category. Boheme required a complete redesign of their artisanal botanical vermouth crafted with flora from the flowering Atacama desert. The label honors 19th-century apothecary botanicals through contemporary engravings and debossed gold foil.',
    },
    challenge: {
      es: 'Elevar la percepción de valor para competir directamente con vermouths y licores importados de Italia y Francia en cartas de coctelería de autor.',
      en: 'Elevate brand prestige to compete directly with premier imported Italian and French vermouths in cocktail bars and boutique cellars.',
    },
    solution: {
      es: 'Botella de vidrio ámbar pesado de hombro marcado, papel de algodón libre de cloro con textura rugosa, tipografía grabada a buril y sello de cera lacrada en el cuello.',
      en: 'Heavy amber glass with sharp architectural shoulders, chlorine-free cotton paper with raw tactile grain, burin-engraved lettering, and hand-stamped sealing wax on the cap.',
    },
    results: {
      es: [
        'Nominación oficial Premios Chile Diseño 2024 en Rebranding.',
        'Entrada a más de 45 barras de coctelería de autor en Santiago y Valparaíso.',
        'Exportación iniciada a mercados de Estados Unidos y España.',
      ],
      en: [
        'Official Nominee for Chile Diseño Awards 2024 in Rebranding.',
        'Selected for 45+ premier signature cocktail bars across Chile.',
        'First export allocation shipped to USA and Spanish distributors.',
      ],
    },
    specs: {
      materials: 'Vidrio ámbar pesado 750ml, papel algodón Fedrigoni 140g',
      finishes: 'Hot stamping oro mate, relieve en seco multinivel, lacre granate',
      deliverables: ['Diseño de botella y etiqueta', 'Caja de presentación rígida', 'Identidad de destilería', 'Fotografía de producto'],
    },
    image: '/src/assets/images/boheme_spirits_bottle_1792009459709.jpg',
    awards: 'Nominado Premios Chile Diseño 2024',
    featured: true,
  },
  {
    id: 'craki-snack',
    title: 'Craki Protein Snack',
    client: 'Craki Foods Chile',
    year: '2023',
    category: 'packaging',
    categoryLabel: {
      es: 'Packaging Disruptivo de Alimentos',
      en: 'Disruptive Snack Packaging System',
    },
    tagline: {
      es: 'Empaque brutalista y enérgico para snacks proteicos crujientes.',
      en: 'Brutalist, energetic packaging for ultra-crispy protein snacks.',
    },
    description: {
      es: 'Craki desafía la sobriedad aburrida del mercado de snacks funcionales. Desarrollamos un isotipo de rayo fragmentado que simboliza el crujido explosivo ("crunch") y una arquitectura tipográfica condensada y brutalista en combinaciones cromáticas de amarillo flúor y azul eléctrico.',
      en: 'Craki challenges the boring sobriety of the functional health snack market. We engineered a fragmented lightning strike insignia symbolizing explosive crunch and a condensed brutalist typographic hierarchy in fluorescent yellow and cobalt electric blue.',
    },
    challenge: {
      es: 'Los snacks saludables suelen verse clínicos o artificialmente rústicos. Craki necesitaba transmitir apetito, energía y actitud callejera.',
      en: 'Healthy snacks often look clinical or artificially rustic. Craki needed to project raw appetite, kinetic energy, and street-smart attitude.',
    },
    solution: {
      es: 'Bolsa pouch doy-pack con acabado ultra-mate táctil, letras de impacto sin serifa y una jerarquía de información limpia que comunica los 15g de proteína sin saturar el diseño.',
      en: 'Ultra-matte tactile doy-pack pouch, high-impact sans lettering, and a clean information hierarchy highlighting 15g protein without cluttering the aesthetic.',
    },
    results: {
      es: [
        'Distribución nacional lograda en cadenas de retail en 90 días.',
        '+210% de recompras en punto de venta.',
        'Premio Packaging Revelación del Sector Snacks.',
      ],
      en: [
        'Nationwide retail shelf placement secured within 90 days.',
        '+210% repeat purchase rate at point of sale.',
        'Breakthrough Packaging Award in food & beverage sector.',
      ],
    },
    specs: {
      materials: 'Pouch barrera mate reciclable 120g con cierre hermético',
      finishes: 'Impresión flexográfica HD con barniz de tacto aterciopelado',
      deliverables: ['Diseño de empaque (3 sabores)', 'Cajas exhibidoras POP', 'Campaña gráfica de lanzamiento'],
    },
    image: '/src/assets/images/craki_protein_snack_1792009459792.jpg',
    featured: true,
  },
  {
    id: 'cool-girls-run',
    title: 'Cool Girls Run',
    client: 'Cool Girls Run Collective',
    year: '2024',
    category: 'branding',
    categoryLabel: {
      es: 'Identidad de Marca & Streetwear',
      en: 'Brand Identity & Sport Streetwear',
    },
    tagline: {
      es: 'Branding y apparel para una comunidad de running femenino en Santiago de Chile.',
      en: 'Branding and apparel for a women running collective in Santiago, Chile.',
    },
    description: {
      es: 'Cool Girls Run es un colectivo que redefine la cultura del running en Santiago, transformando el entrenamiento urbano en un espacio seguro, festivo y empoderado para mujeres. Creamos una identidad visual dinámica que combina tipografía atlética contemporánea con guiños al editorial de moda noventero.',
      en: 'Cool Girls Run is a collective redefining running culture in Santiago, turning urban workouts into a safe, celebratory, and empowered space for women. We built a dynamic visual identity combining athletic modern typography with 90s fashion editorial nuances.',
    },
    challenge: {
      es: 'Alejarse de los clichés del deporte corporativo tradicional y construir una comunidad que se sienta como un club de amigas y moda callejera.',
      en: 'Break free from corporate athletic clichés and build a community that feels like an authentic circle of friends and street fashion.',
    },
    solution: {
      es: 'Sistema modular de logotipos, camisetas técnicas serigrafiadas, gorras de nylon ripstop y un sistema gráfico para redes sociales que mezcla fotografía analógica con tipografía enérgica.',
      en: 'Modular logotype system, screenprinted performance running tees, ripstop nylon caps, and a social graphic system blending 35mm film photography with bold typographic hits.',
    },
    results: {
      es: [
        'Comunidad creció de 40 a más de 1,200 corredoras activas en 6 meses.',
        'Colección de apparel agotada en 3 horas en cada drop.',
        'Alianzas estratégicas con marcas internacionales de calzado.',
      ],
      en: [
        'Community expanded from 40 to 1,200+ active runners within 6 months.',
        'Apparel capsules sold out in under 3 hours with each drop.',
        'Strategic partnerships secured with international footwear brands.',
      ],
    },
    specs: {
      materials: 'Apparel técnico transpirable, merchandising serigrafiado',
      finishes: 'Estampado plastisol reflectivo para carreras nocturnas',
      deliverables: ['Manual de identidad de marca', 'Cápsula de ropa deportiva', 'Contenido editorial y kit digital'],
    },
    image: '/src/assets/images/cool_girls_run_crew_1792009461537.jpg',
    featured: true,
  },
  {
    id: 'gow-art-tools',
    title: 'Gow Creative Tools',
    client: 'Gow Design Labs',
    year: '2023',
    category: 'packaging',
    categoryLabel: {
      es: 'Packaging de Colección & Diseño Editorial',
      en: 'Collectible Packaging & Stationery Design',
    },
    tagline: {
      es: 'Caja de herramientas creativas y marcadores de arte para diseñadores e ilustradores.',
      en: 'Creative tools and art marker collector sets for designers and illustrators.',
    },
    description: {
      es: 'Gow es una startup chilena que reimagina las herramientas de dibujo con foco en calidad insuperable, ergonomía y estética de colección. Diseñamos un estuche de apertura telescópica con patrones geométricos lúdicos, tipografías sólidas y una experiencia de unboxing multisensorial.',
      en: 'Gow is a Chilean startup reimagining drawing tools with high craftsmanship, ergonomic tactility, and collectible design. We designed a telescoping packaging box with playful geometric patterns, solid typography, and a multisensory unboxing experience.',
    },
    challenge: {
      es: 'Crear un empaque que no termine en la basura, sino que se convierta en una pieza de exhibición permanente sobre el escritorio de cualquier creativo.',
      en: 'Engineer packaging that never ends up discarded, becoming a permanent design display piece on any creative professional desk.',
    },
    solution: {
      es: 'Caja rígida en cartón kraft reciclado con cuna termoformada biodegradable, gráfica lúdica inspirada en la Bauhaus y marcadores con tipografía grabada en relieve.',
      en: 'Rigid box in recycled kraft cardboard with biodegradable inner tray, playful Bauhaus-inspired graphics, and markers with debossed tactile typography.',
    },
    results: {
      es: [
        'Financiación en crowdfunding superada en un 280%.',
        'Vendido en librerías de diseño en Santiago, Buenos Aires y Lima.',
        'Premio al Mejor Empaque Sostenible 2023.',
      ],
      en: [
        'Crowdfunding launch goal exceeded by 280%.',
        'Retailed in premier design bookstores across Santiago, Buenos Aires, and Lima.',
        'Sustainable Packaging Innovation Award 2023.',
      ],
    },
    specs: {
      materials: 'Cartón rígido 1200g forrado en papel reciclado teñido en masa',
      finishes: 'Serigrafía al agua 4 colores directos + troquel de apertura',
      deliverables: ['Packaging estructural', 'Diseño de producto de 12 marcadores', 'Guía de color de bolsillo'],
    },
    image: '/src/assets/images/gow_creative_stationery_1792009460791.jpg',
    featured: true,
  },
  {
    id: 'outcider-rebel',
    title: 'Outcider Rebel Cider',
    client: 'Outcider Beverage Co.',
    year: '2023',
    category: 'packaging',
    categoryLabel: {
      es: 'Packaging & Custom Lettering',
      en: 'Packaging & Custom Lettering',
    },
    tagline: {
      es: 'Sidra artesanal del sur de Chile con actitud rebelde y lettering a medida.',
      en: 'Southern Chilean craft cider with rebellious attitude and bespoke lettering.',
    },
    description: {
      es: 'Outcider es una sidra natural fermentada con manzanas orgánicas del sur de Chile. Rompiendo con la estética bucólica tradicional de las sidras campesinas, creamos una propuesta gráfica inspirada en fanzines punk, lettering gótico desarmado y sellos de aprobación sarcásticos.',
      en: 'Outcider is natural cider fermented with wild organic apples from southern Chile. Shatering traditional pastoral cider tropes, we built a visual identity informed by DIY punk zines, deconstructed gothic lettering, and tongue-in-cheek seals of quality.',
    },
    challenge: {
      es: 'Introducir la sidra a un público joven acostumbrado a la cerveza artesanal, eliminando la idea de que la sidra es una bebida anticuada de fin de año.',
      en: 'Introduce cider to young consumers accustomed to craft beer, eliminating the misconception that cider is only for holiday toasts.',
    },
    solution: {
      es: 'Etiqueta envolvente con troquel irregular, contrastes de tintas fluorescentes sobre papel negro mate y caligrafía gestual que proclama "Not your grandma\'s cider".',
      en: 'Wrap-around label with deckled die-cut edges, fluorescent ink contrasts on matte black uncoated stock, and gestural calligraphy asserting "Not your grandma\'s cider".',
    },
    results: {
      es: [
        'Posicionado en los mejores gastro-pubs de Santiago en su primer mes.',
        '+185% de menciones orgánicas en Instagram de clientes fotografiando la botella.',
      ],
      en: [
        'Secured taps and bottles in top Santiago gastropubs within month one.',
        '+185% organic social mentions from consumers photographing the bottle.',
      ],
    },
    specs: {
      materials: 'Botella de vidrio oscuro 330ml, papel enológico impermeable',
      finishes: 'Troquel irregular rasgado + Barniz serigráfico de alto relieve',
      deliverables: ['Etiquetas de 3 variedades', 'Posavasos ilustrados', 'Gráfica para redes y merchandising'],
    },
    image: '/src/assets/images/cerveza_monos_packaging_1792009459206.jpg', // shared aesthetic
    featured: false,
  },
];

export const SERVICES_DATA: ServiceItem[] = [
  {
    number: '01',
    title: {
      es: 'Branding & Estrategia de Marca',
      en: 'Branding & Strategic Identity',
    },
    subtitle: {
      es: 'Construimos identidades con espina dorsal que nadie puede ignorar.',
      en: 'We build visual identities with a spine that no consumer can ignore.',
    },
    description: {
      es: 'Tu marca no necesita otro logo genérico en una plantilla minimalista. Necesita una voz inconfundible, una postura desafiante y un sistema gráfico elástico que funcione con la misma fuerza en una valla publicitaria, un avatar de Instagram o un empaque físico.',
      en: 'Your brand does not need another bland template logo. It needs an unmistakable voice, an uncompromising attitude, and a flexible design system that performs just as powerfully on a billboard as on Instagram or a tangible package.',
    },
    deliverables: {
      es: [
        'Auditoría y posicionamiento contra lo aburrido',
        'Naming y tono de voz de marca',
        'Logotipo principal, submarchas y sellos',
        'Sistema cromático y combinaciones tipográficas',
        'Manual de identidad exhaustivo para tu equipo',
      ],
      en: [
        'Anti-boring brand positioning & market audit',
        'Brand naming & disruptive tone of voice',
        'Primary logotype, secondary marks & brand seals',
        'Bespoke color palettes & typographic hierarchy',
        'Comprehensive brand guidelines system',
      ],
    },
  },
  {
    number: '02',
    title: {
      es: 'Packaging Disruptivo & Producción',
      en: 'Disruptive Packaging & Production',
    },
    subtitle: {
      es: 'Diseño de empaques concebidos para dominar la góndola y generar deseo táctil.',
      en: 'Packaging engineered to dominate retail shelves and evoke tactile desire.',
    },
    description: {
      es: 'El 70% de las decisiones de compra ocurren frente al estante en menos de tres segundos. Diseñamos botellas, latas, cajas, bolsas y etiquetas que interrumpen el piloto automático del consumidor, seducen al tacto y cuentan una historia memorable antes del primer uso.',
      en: '70% of retail purchasing decisions happen at the shelf in less than three seconds. We design bottles, cans, boxes, pouches, and labels that interrupt autopilot shopping, seduce the hands, and tell an unforgettable story before the first taste or touch.',
    },
    deliverables: {
      es: [
        'Arquitectura estructural y selección de envases',
        'Diseño de etiquetas, latas, cajas y bolsas',
        'Especificación de papeles enológicos, sustratos y tintas Pantone',
        'Acabados especiales: folia en caliente, relieve en seco, barniz UV',
        'Supervisión y control de calidad en imprenta',
      ],
      en: [
        'Structural packaging architecture & vessel selection',
        'Label art, aluminum can wraps, folding cartons & bags',
        'Substrate curation, eco-stocks & Pantone formulations',
        'Special finishes: hot foil stamping, debossing, spot UV',
        'Prepress prep & direct print shop press-check oversight',
      ],
    },
  },
  {
    number: '03',
    title: {
      es: 'Custom Lettering & Tipografía a Medida',
      en: 'Custom Lettering & Bespoke Typography',
    },
    subtitle: {
      es: 'Letras dibujadas a mano para marcas que no se conforman con fuentes comerciales.',
      en: 'Hand-crafted letterforms for brands that refuse off-the-shelf fonts.',
    },
    description: {
      es: 'El lettering es el alma de Versal. Dibujamos cada letra con intencionalidad escultórica, desde caligrafías expresivas y orgánicas hasta tipografías condensadas de estilo brutalista. Ningún competidor podrá comprar tu fuente en internet porque fue creada exclusivamente para ti.',
      en: 'Lettering is the beating heart of Versal. We draw every character with sculptural intent, from expressive organic scripts to heavy condensed brutalist typefaces. No competitor can ever purchase your font online because it was drafted purely for your brand.',
    },
    deliverables: {
      es: [
        'Logotipos caligráficos y de autor',
        'Titulares y números de edición limitada',
        'Monogramas y sellos de cera personalizados',
        'Tipografías display para productos o campañas',
      ],
      en: [
        'Calligraphic wordmarks and signature logotypes',
        'Limited edition headline and numeral lettering',
        'Bespoke monograms and tactile seal marks',
        'Custom display fonts for products and campaigns',
      ],
    },
  },
  {
    number: '04',
    title: {
      es: 'Dirección Creativa & Dirección de Arte',
      en: 'Creative & Art Direction',
    },
    subtitle: {
      es: 'Traducimos la identidad de tu marca en un mundo visual cinematográfico.',
      en: 'We translate your brand identity into a cinematic visual universe.',
    },
    description: {
      es: 'Un gran empaque necesita imágenes a la altura. Dirigimos sesiones de fotografía de producto, campañas de lanzamiento y narrativas visuales que elevan el valor percibido y alimentan tus canales comerciales con contenido irresistible.',
      en: 'Extraordinary packaging requires photography to match. We direct commercial product shoots, launch campaigns, and visual storytelling that elevate perceived value and equip your marketing channels with magnetic creative content.',
    },
    deliverables: {
      es: [
        'Concepto visual y guion de lanzamiento',
        'Dirección de arte en sesiones de foto y video de producto',
        'Estilismo de bodegones y escenografía comercial',
        'Kits de lanzamiento para prensa e influencers',
      ],
      en: [
        'Visual launch concept and storytelling scripts',
        'On-set art direction for photo and video shoots',
        'Commercial still-life styling and prop design',
        'Press kits and influencer unboxing collateral',
      ],
    },
  },
];
