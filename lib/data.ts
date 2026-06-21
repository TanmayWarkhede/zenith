import type { CelestialObject } from '@/types';

export const LOCATIONS = [
  { name: 'Nagpur, India', lat: 21.1458, lng: 79.0882, timezone: 'Asia/Kolkata', country: 'IN' },
  { name: 'Mumbai, India', lat: 19.0760, lng: 72.8777, timezone: 'Asia/Kolkata', country: 'IN' },
  { name: 'Delhi, India', lat: 28.6139, lng: 77.2090, timezone: 'Asia/Kolkata', country: 'IN' },
  { name: 'New York, USA', lat: 40.7128, lng: -74.0060, timezone: 'America/New_York', country: 'US' },
  { name: 'London, UK', lat: 51.5074, lng: -0.1278, timezone: 'Europe/London', country: 'GB' },
  { name: 'Tokyo, Japan', lat: 35.6762, lng: 139.6503, timezone: 'Asia/Tokyo', country: 'JP' },
  { name: 'Sydney, Australia', lat: -33.8688, lng: 151.2093, timezone: 'Australia/Sydney', country: 'AU' },
  { name: 'Dubai, UAE', lat: 25.2048, lng: 55.2708, timezone: 'Asia/Dubai', country: 'AE' },
];

export const BRIGHT_STARS: Omit<CelestialObject, 'alt' | 'az'>[] = [
  {
    id: 'sirius', name: 'Sirius', type: 'STAR', color: '#B5D4F4', size: 4,
    magnitude: -1.46, distance: '8.6 ly',
    description: 'The brightest star in Earth\'s night sky, part of Canis Major. A binary system with a white dwarf companion.',
    facts: ['Binary star: Sirius A + B', '25× more luminous than Sun', '2.02× solar mass', 'Used by ancient Egyptians for calendar'],
    constellation: 'Canis Major',
  },
  {
    id: 'canopus', name: 'Canopus', type: 'STAR', color: '#E8F0FF', size: 3.5,
    magnitude: -0.72, distance: '310 ly',
    description: 'Second brightest star, a yellow-white supergiant in Carina used as a navigation reference by spacecraft.',
    facts: ['Yellow-white F-type supergiant', '65× solar mass', 'NASA uses it for spacecraft navigation', '15,000× solar luminosity'],
    constellation: 'Carina',
  },
  {
    id: 'arcturus', name: 'Arcturus', type: 'STAR', color: '#FAC775', size: 3.8,
    magnitude: -0.04, distance: '36.7 ly',
    description: 'Brightest star in Boötes, an orange giant that will eventually become a planetary nebula.',
    facts: ['Orange K-type giant', '25× solar radius', 'Among oldest stars in Milky Way', 'Visible in daylight through telescope'],
    constellation: 'Boötes',
  },
  {
    id: 'vega', name: 'Vega', type: 'STAR', color: '#D0E8FF', size: 3.2,
    magnitude: 0.03, distance: '25 ly',
    description: 'Fifth brightest star, the northern anchor of the Summer Triangle. Once was the north star.',
    facts: ['Spins nearly at breakup speed', 'Will be pole star again in 13,727 AD', 'Reference star for magnitude scale', 'Target of SETI observations'],
    constellation: 'Lyra',
  },
  {
    id: 'rigel', name: 'Rigel', type: 'STAR', color: '#C5D8FF', size: 3.4,
    magnitude: 0.13, distance: '860 ly',
    description: 'A blue supergiant marking Orion\'s left foot, one of the most luminous stars known.',
    facts: ['100,000× solar luminosity', 'Blue B8 supergiant', 'Multiple star system', 'Will explode as supernova'],
    constellation: 'Orion',
  },
  {
    id: 'betelgeuse', name: 'Betelgeuse', type: 'STAR', color: '#F09595', size: 3.6,
    magnitude: 0.42, distance: '700 ly',
    description: 'Red supergiant marking Orion\'s right shoulder — expected to go supernova within 100,000 years.',
    facts: ['700× solar diameter', 'Red M2 supergiant', 'Dimmed dramatically in 2019-2020', 'Pre-supernova candidate'],
    constellation: 'Orion',
  },
  {
    id: 'aldebaran', name: 'Aldebaran', type: 'STAR', color: '#F5C4B3', size: 3.0,
    magnitude: 0.85, distance: '65 ly',
    description: 'The red eye of Taurus the Bull — an orange giant 44× the diameter of our Sun.',
    facts: ['44× solar diameter', 'K5 orange giant', 'Hyades cluster foreground star', 'Ancient mariners used for navigation'],
    constellation: 'Taurus',
  },
  {
    id: 'antares', name: 'Antares', type: 'STAR', color: '#E24B4A', size: 3.3,
    magnitude: 1.05, distance: '550 ly',
    description: 'The heart of Scorpius — a red supergiant so large it would engulf Mars\' orbit if placed at our Sun.',
    facts: ['700× solar radius', 'Binary star system', 'Name means "rival of Mars"', 'Inside a nebula it created'],
    constellation: 'Scorpius',
  },
];

export const PLANETS_DATA = [
  {
    id: 'mercury', name: 'Mercury', color: '#B4B2A9', size: 2.5,
    distance: '0.39 AU', description: 'Closest planet to the Sun, with extreme temperature swings and no atmosphere to speak of.',
    facts: ['Smallest planet', 'No atmosphere', '−180°C to 430°C', 'Covered in craters'],
  },
  {
    id: 'venus', name: 'Venus', color: '#FAC775', size: 3.5,
    distance: '0.72 AU', description: 'The hottest planet due to a runaway greenhouse effect. Brighter than any star at magnitude −4.9.',
    facts: ['Hottest planet: 465°C', 'Rotates backwards', 'Day longer than year', 'No moons'],
  },
  {
    id: 'mars', name: 'Mars', color: '#D85A30', size: 3.0,
    distance: '1.52 AU', description: 'The Red Planet hosts Olympus Mons, the largest volcano in the solar system, and evidence of ancient water.',
    facts: ['Two moons: Phobos & Deimos', 'Largest volcano in solar system', 'Day: 24h 37min', 'Sub-zero temperatures'],
  },
  {
    id: 'jupiter', name: 'Jupiter', color: '#EF9F27', size: 5.5,
    distance: '5.2 AU', description: 'The largest planet — a gas giant with 95 known moons and a storm (Great Red Spot) active for 350+ years.',
    facts: ['95 known moons', 'Great Red Spot: 350+ years', 'Strongest magnetic field', '2.5× all other planets combined'],
  },
  {
    id: 'saturn', name: 'Saturn', color: '#FAC775', size: 5.0,
    distance: '9.5 AU', description: 'The ringed giant. Saturn\'s rings are made of ice and rock, spanning 282,000 km but only 1 km thick.',
    facts: ['Ring system: 282,000 km wide', 'Only 1 km ring thickness', '83 confirmed moons', 'Least dense planet — floats on water'],
  },
];

export const SATELLITES_DATA: Omit<CelestialObject, 'alt' | 'az'>[] = [
  {
    id: 'iss', name: 'ISS', type: 'SATELLITE', color: '#00D4AA', size: 5, orbiting: true,
    magnitude: -4.2, distance: '408 km', speed: '27,600 km/h',
    description: 'The International Space Station is a habitable artificial satellite in low Earth orbit, continuously crewed since 2000.',
    facts: ['Orbits Earth every 90 min', 'Size of a football field', 'Crew of 7 astronauts', 'Visible to naked eye'],
  },
  {
    id: 'starlink-1', name: 'Starlink-4821', type: 'SATELLITE', color: '#8B5CF6', size: 2, orbiting: true,
    magnitude: 4.8, distance: '550 km', speed: '27,100 km/h',
    description: 'SpaceX Starlink broadband satellite providing global internet coverage from low Earth orbit.',
    facts: ['Gen2 shell: 550 km altitude', 'Part of 5000+ constellation', '100 Mbps per beam', 'Krypton ion thrusters'],
  },
  {
    id: 'starlink-2', name: 'Starlink-5103', type: 'SATELLITE', color: '#8B5CF6', size: 2, orbiting: true,
    magnitude: 5.1, distance: '550 km', speed: '27,100 km/h',
    description: 'SpaceX Starlink broadband satellite, part of the largest commercial constellation in history.',
    facts: ['VisorSat anti-glare feature', 'Orbital lifetime: 5 years', 'Laser inter-satellite links', '260 kg dry mass'],
  },
  {
    id: 'hubble', name: 'Hubble ST', type: 'SATELLITE', color: '#1E6FFF', size: 3, orbiting: true,
    magnitude: 1.5, distance: '538 km', speed: '27,300 km/h',
    description: 'The Hubble Space Telescope has been observing the universe since 1990, revolutionizing astronomy.',
    facts: ['Launched April 24, 1990', '2.4m primary mirror', '>1.5 million observations', 'Serviced 5 times by astronauts'],
  },
];

export const ASTEROIDS_DATA: Omit<CelestialObject, 'alt' | 'az'>[] = [
  {
    id: 'neo-2026ja1', name: '2026 JA₁', type: 'ASTEROID', color: '#F09595', size: 2.5, orbiting: true,
    magnitude: 14.2, distance: '0.8 AU',
    description: 'Near-Earth asteroid making a safe close approach this month, offering a rare naked-eye opportunity.',
    facts: ['Diameter: ~120 m', 'Aten-class asteroid', 'Closest approach: Jun 28', 'Not hazardous'],
    discoveredBy: 'Catalina Sky Survey', discoveredYear: 2026,
  },
];

export const CONSTELLATION_LINES: Record<string, [number, number][]> = {
  orion: [[83.8, -5.9], [81.3, 6.35], [78.6, -0.3], [84.05, -1.2], [88.8, 7.4], [84.05, -1.2], [83.8, -5.9], [78.6, -0.3], [81.3, 6.35]],
  scorpius: [[247.4, -26.4], [252.2, -19.0], [244.0, -15.9], [241.4, -19.8], [247.4, -26.4], [252.2, -33.0], [253.5, -37.1]],
  ursa_major: [[165.9, 61.8], [183.9, 57.0], [193.5, 55.9], [206.9, 49.3], [193.5, 55.9], [200.9, 54.9]],
};
