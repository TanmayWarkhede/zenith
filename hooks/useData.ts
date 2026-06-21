'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import type { ISSData, WeatherData, APODData, CelestialObject, FilterState } from '@/types';
import {
  raDecToAltAz, moonPosition, getMoonPhaseName, getMoonPhaseEmoji,
  solarPosition
} from '@/lib/celestial';
import { BRIGHT_STARS, SATELLITES_DATA, ASTEROIDS_DATA } from '@/lib/data';

export function useISSTracker() {
  const [iss, setIss] = useState<ISSData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetch_ = useCallback(async () => {
    try {
      const res = await fetch('/api/iss');
      const data = await res.json();
      setIss(data);
    } catch { /* keep previous */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    fetch_();
    const id = setInterval(fetch_, 5000);
    return () => clearInterval(id);
  }, [fetch_]);

  return { iss, loading };
}

export function useWeather(lat: number, lng: number) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/weather?lat=${lat}&lng=${lng}`)
      .then(r => r.json())
      .then(setWeather)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [lat, lng]);

  return { weather, loading };
}

export function useAPOD() {
  const [apod, setApod] = useState<APODData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/apod')
      .then(r => r.json())
      .then(setApod)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { apod, loading };
}

export function usePlanets(lat: number, lng: number, timeOffset: number) {
  const [planets, setPlanets] = useState<CelestialObject[]>([]);

  useEffect(() => {
    fetch(`/api/planets?lat=${lat}&lng=${lng}&offset=${timeOffset / 3600}`)
      .then(r => r.json())
      .then(setPlanets)
      .catch(() => {});
  }, [lat, lng, Math.floor(timeOffset / 300)]);

  return planets;
}

export function useAsteroids() {
  const [asteroids, setAsteroids] = useState<{
    id: string; name: string; diameter: number; velocity: number;
    distanceLunar: number; closestApproach: string; hazardous: boolean;
  }[]>([]);

  useEffect(() => {
    fetch('/api/asteroids')
      .then(r => r.json())
      .then(setAsteroids)
      .catch(() => {});
  }, []);

  return asteroids;
}

export function useCelestialObjects(
  lat: number, lng: number,
  planets: CelestialObject[],
  timeOffset: number,
  filters: FilterState
): CelestialObject[] {
  const [objects, setObjects] = useState<CelestialObject[]>([]);
  const animRef = useRef(0);

  useEffect(() => {
    let raf: number;

    function update() {
      const date = new Date(Date.now() + timeOffset * 1000);
      const result: CelestialObject[] = [];
      const t = Date.now() / 1000;

      // Stars
      if (filters.STAR) {
        BRIGHT_STARS.forEach(star => {
          const ra = (star.id === 'sirius' ? 101.3 :
            star.id === 'canopus' ? 95.9 :
            star.id === 'arcturus' ? 213.9 :
            star.id === 'vega' ? 279.2 :
            star.id === 'rigel' ? 78.6 :
            star.id === 'betelgeuse' ? 88.8 :
            star.id === 'aldebaran' ? 68.98 :
            star.id === 'antares' ? 247.4 : 120);
          const dec = (star.id === 'sirius' ? -16.7 :
            star.id === 'canopus' ? -52.7 :
            star.id === 'arcturus' ? 19.2 :
            star.id === 'vega' ? 38.8 :
            star.id === 'rigel' ? -8.2 :
            star.id === 'betelgeuse' ? 7.4 :
            star.id === 'aldebaran' ? 16.5 :
            star.id === 'antares' ? -26.4 : 0);
          const { alt, az } = raDecToAltAz(ra, dec, lat, lng, date);
          result.push({ ...star, alt, az } as CelestialObject);
        });
      }

      // Planets (from API)
      if (filters.PLANET) {
        result.push(...planets);
      }

      // Moon
      if (filters.MOON) {
        const moon = moonPosition(date);
        const { alt, az } = raDecToAltAz(moon.ra, moon.dec, lat, lng, date);
        const phase = getMoonPhaseName(moon.phase);
        const emoji = getMoonPhaseEmoji(moon.phase);
        result.push({
          id: 'moon', name: 'Moon', type: 'MOON', color: '#D3D1C7',
          size: 8, magnitude: -12.6, distance: '384,400 km',
          alt, az, orbiting: false,
          description: `Earth\'s only natural satellite. ${emoji} ${phase} (${Math.round(moon.phase * 100)}% illuminated).`,
          facts: [`Phase: ${emoji} ${phase}`, `${Math.round(moon.phase * 100)}% illuminated`, 'Distance: 384,400 km', 'Orbital period: 27.3 days'],
        });
      }

      // Satellites
      if (filters.SATELLITE) {
        SATELLITES_DATA.forEach((sat, i) => {
          const speed = 0.0007 + i * 0.0002;
          const baseAz = (t * speed * 360 + i * 120) % 360;
          const altOsc = 45 + 30 * Math.sin(t * speed * 2 * Math.PI + i);
          result.push({ ...sat, alt: Math.max(5, altOsc), az: baseAz } as CelestialObject);
        });
      }

      // Asteroids (fixed position — simplification)
      if (filters.ASTEROID) {
        ASTEROIDS_DATA.forEach((ast, i) => {
          result.push({ ...ast, alt: 55 + i * 10, az: 130 + i * 40 } as CelestialObject);
        });
      }

      setObjects(result);
      animRef.current++;
      raf = requestAnimationFrame(update);
    }

    update();
    return () => cancelAnimationFrame(raf);
  }, [lat, lng, planets, timeOffset, filters]);

  return objects;
}

export function useClock(timeOffset: number) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date(Date.now() + timeOffset * 1000)), 1000);
    return () => clearInterval(id);
  }, [timeOffset]);

  return time;
}
