export interface Location {
  name: string;
  lat: number;
  lng: number;
  timezone: string;
  country: string;
}

export type ObjectType = 'PLANET' | 'SATELLITE' | 'STAR' | 'ASTEROID' | 'MOON' | 'CONSTELLATION';

export interface CelestialObject {
  id: string;
  name: string;
  type: ObjectType;
  color: string;
  size: number;
  magnitude: number;
  distance: string;
  distanceKm?: number;
  description: string;
  facts: string[];
  alt: number; // altitude 0-90
  az: number;  // azimuth 0-360
  ra?: number;
  dec?: number;
  orbiting?: boolean;
  speed?: string;
  constellation?: string;
  discoveredBy?: string;
  discoveredYear?: number;
}

export interface ISSData {
  lat: number;
  lng: number;
  altitude: number;
  velocity: number;
  visibility?: string;
  timestamp: number;
  nextPass?: string;
  crewCount?: number;
  orbitsPerDay?: number;
  simulated?: boolean;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  cloudCover: number;
  windSpeed: number;
  visibility: number;
  pressure: number;
  condition: string;
  transparency: number;
  seeing: number;
  lightPollution: number;
}

export interface APODData {
  date: string;
  title: string;
  explanation: string;
  url: string;
  mediaType: string;
  copyright?: string;
}

export interface PlanetData {
  id: string;
  name: string;
  ra: number;
  dec: number;
  magnitude: number;
  distanceAU: number;
  angularDiameter?: number;
  phase?: number;
  illumination?: number;
}

export interface AsteroidData {
  id: string;
  name: string;
  closestApproach: string;
  distanceLunar: number;
  velocity: number;
  diameter: number;
  hazardous: boolean;
}

export interface SkyViewState {
  zoom: number;
  showConstellations: boolean;
  showGrid: boolean;
  showLabels: boolean;
  showMilkyWay: boolean;
  rotation: number;
}

export interface FilterState {
  PLANET: boolean;
  SATELLITE: boolean;
  STAR: boolean;
  ASTEROID: boolean;
  MOON: boolean;
}
