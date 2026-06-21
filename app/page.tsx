'use client';
import { useState, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import type { CelestialObject, Location, FilterState, SkyViewState } from '@/types';
import { LOCATIONS } from '@/lib/data';
import Header from '@/components/ui/Header';
import LeftPanel from '@/components/panels/LeftPanel';
import RightPanel from '@/components/panels/RightPanel';
import SkyControls from '@/components/sky/SkyControls';
import Tooltip from '@/components/ui/Tooltip';
import {
  useISSTracker, useWeather, useAPOD, usePlanets,
  useAsteroids, useCelestialObjects, useClock,
} from '@/hooks/useData';

const SkyCanvas = dynamic(() => import('@/components/sky/SkyCanvas'), { ssr: false });

const DEFAULT_FILTERS: FilterState = {
  PLANET: true, SATELLITE: true, STAR: true, ASTEROID: true, MOON: true,
};

const DEFAULT_SKY_STATE: SkyViewState = {
  zoom: 1, showConstellations: true, showGrid: false,
  showLabels: true, showMilkyWay: true, rotation: 0,
};

export default function ZenithApp() {
  const [location, setLocation] = useState<Location>(LOCATIONS[0]);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [skyState, setSkyState] = useState<SkyViewState>(DEFAULT_SKY_STATE);
  const [selectedObj, setSelectedObj] = useState<CelestialObject | null>(null);
  const [timeOffset, setTimeOffset] = useState(0);
  const [hoveredObj, setHoveredObj] = useState<CelestialObject | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [searchQuery, setSearchQuery] = useState('');

  const { iss } = useISSTracker();
  const { weather } = useWeather(location.lat, location.lng);
  const { apod } = useAPOD();
  const planets = usePlanets(location.lat, location.lng, timeOffset);
  const asteroids = useAsteroids();
  const currentTime = useClock(timeOffset);

  const allObjects = useCelestialObjects(location.lat, location.lng, planets, timeOffset, filters);

  const visibleObjects = searchQuery
    ? allObjects.filter(o => o.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : allObjects;

  const handleHover = useCallback((obj: CelestialObject | null, x: number, y: number) => {
    setHoveredObj(obj);
    setTooltipPos({ x, y });
  }, []);

  const handleClick = useCallback((obj: CelestialObject) => {
    setSelectedObj(obj);
    setSearchQuery('');
  }, []);

  const handleSearch = useCallback((q: string) => {
    setSearchQuery(q);
    if (q) {
      const found = allObjects.find(o => o.name.toLowerCase().includes(q.toLowerCase()));
      if (found) setSelectedObj(found);
    }
  }, [allObjects]);

  const hoveredInfo = hoveredObj
    ? `${hoveredObj.name} — Alt: ${hoveredObj.alt.toFixed(1)}° · Az: ${hoveredObj.az.toFixed(1)}° · Mag: ${hoveredObj.magnitude}`
    : '';

  const skyRef = useRef<HTMLDivElement>(null);

  return (
    <div style={{
      width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column',
      background: '#050A14', color: '#E8F4FF', overflow: 'hidden',
      fontFamily: 'Inter, sans-serif',
    }}>
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(14,30,60,0.6) 0%, #050A14 70%)',
      }} />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Header currentTime={currentTime} location={location.name} objectCount={visibleObjects.length} />

        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <div style={{ width: 256, flexShrink: 0 }}>
            <LeftPanel
              location={location}
              onLocationChange={setLocation}
              filters={filters}
              onFilterChange={setFilters}
              timeOffset={timeOffset}
              onTimeOffsetChange={setTimeOffset}
              skyState={skyState}
              onSkyStateChange={setSkyState}
              currentTime={currentTime}
              weather={weather}
            />
          </div>

          <div
            ref={skyRef}
            style={{ flex: 1, position: 'relative', overflow: 'hidden' }}
            onWheel={e => {
              e.preventDefault();
              setSkyState(s => ({ ...s, zoom: Math.max(0.5, Math.min(2.5, s.zoom - e.deltaY * 0.001)) }));
            }}
          >
            <SkyCanvas
              objects={visibleObjects}
              skyState={skyState}
              selectedId={selectedObj?.id ?? null}
              onHover={handleHover}
              onClick={handleClick}
              issData={iss}
              lat={location.lat}
              timeOffset={timeOffset}
            />
            <SkyControls
              skyState={skyState}
              onSkyStateChange={setSkyState}
              hoveredInfo={hoveredInfo}
            />
          </div>

          <div style={{ width: 256, flexShrink: 0 }}>
            <RightPanel
              selected={selectedObj}
              iss={iss}
              weather={weather}
              apod={apod}
              asteroids={asteroids}
              onSearch={handleSearch}
              searchQuery={searchQuery}
            />
          </div>
        </div>
      </div>

      <Tooltip obj={hoveredObj} x={tooltipPos.x} y={tooltipPos.y} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Inter:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { width: 100%; height: 100%; overflow: hidden; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(30,111,255,0.3); border-radius: 2px; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.8)} }
      `}</style>
    </div>
  );
}
