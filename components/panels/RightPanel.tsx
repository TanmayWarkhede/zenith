'use client';
import { useState } from 'react';
import type { CelestialObject, ISSData, WeatherData, APODData } from '@/types';

interface RightPanelProps {
  selected: CelestialObject | null;
  iss: ISSData | null;
  weather: WeatherData | null;
  apod: APODData | null;
  asteroids: {
    id: string; name: string; diameter: number; velocity: number;
    distanceLunar: number; closestApproach: string; hazardous: boolean;
  }[];
  onSearch: (q: string) => void;
  searchQuery: string;
}

export default function RightPanel({ selected, iss, weather, apod, asteroids, onSearch, searchQuery }: RightPanelProps) {
  const [tab, setTab] = useState<'object' | 'iss' | 'neo' | 'apod'>('object');

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: 'rgba(5,10,20,0.93)', borderLeft: '1px solid rgba(30,111,255,0.2)' }}>
      {/* Search */}
      <div style={{ padding: '10px 12px', borderBottom: '1px solid rgba(30,111,255,0.1)', display: 'flex', gap: 6 }}>
        <input
          value={searchQuery}
          onChange={e => onSearch(e.target.value)}
          placeholder="Search objects..."
          style={{
            flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 6, padding: '7px 10px', color: '#E8F4FF', fontSize: 12,
            fontFamily: 'Inter, sans-serif', outline: 'none',
          }}
        />
        <div style={{
          background: 'rgba(30,111,255,0.15)', border: '1px solid rgba(30,111,255,0.4)',
          borderRadius: 6, padding: '7px 10px', color: '#1E6FFF', fontSize: 12, cursor: 'pointer',
        }}>🔍</div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(30,111,255,0.1)' }}>
        {[
          { key: 'object', label: '✦ Object' },
          { key: 'iss', label: '🛸 ISS' },
          { key: 'neo', label: '☄ NEO' },
          { key: 'apod', label: '🌌 APOD' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key as typeof tab)}
            style={{
              flex: 1, padding: '8px 4px', fontSize: 10, cursor: 'pointer',
              fontFamily: 'Space Mono, monospace', letterSpacing: 0.5,
              background: tab === t.key ? 'rgba(30,111,255,0.12)' : 'transparent',
              border: 'none', borderBottom: tab === t.key ? '2px solid #1E6FFF' : '2px solid transparent',
              color: tab === t.key ? '#1E6FFF' : '#4A6080', transition: 'all 0.2s',
            }}
          >{t.label}</button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {tab === 'object' && <ObjectTab selected={selected} />}
        {tab === 'iss' && <ISSTab iss={iss} weather={weather} />}
        {tab === 'neo' && <NEOTab asteroids={asteroids} />}
        {tab === 'apod' && <APODTab apod={apod} />}
      </div>
    </div>
  );
}

function ObjectTab({ selected }: { selected: CelestialObject | null }) {
  if (!selected) {
    return (
      <div style={{ padding: 20, textAlign: 'center' }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>✦</div>
        <div style={{ color: '#4A6080', fontSize: 13, lineHeight: 1.7 }}>
          Click any object in the sky view to explore it
        </div>
        <div style={{ marginTop: 16, color: '#2A3F5A', fontSize: 11, fontFamily: 'Space Mono, monospace' }}>
          Planets · Stars · Satellites<br />Asteroids · Moon
        </div>
      </div>
    );
  }

  const typeColors: Record<string, string> = {
    PLANET: '#EF9F27', STAR: '#B5D4F4', SATELLITE: '#00D4AA',
    ASTEROID: '#F09595', MOON: '#D3D1C7',
  };

  return (
    <div>
      {/* Header */}
      <div style={{
        padding: '14px 14px 12px',
        background: `linear-gradient(135deg, rgba(30,111,255,0.1), rgba(0,212,170,0.06))`,
        borderBottom: '1px solid rgba(30,111,255,0.15)',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
            background: selected.color + '33', border: `2px solid ${selected.color}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16,
          }}>
            {selected.type === 'PLANET' ? '⬤' : selected.type === 'STAR' ? '✦' :
             selected.type === 'SATELLITE' ? '◈' : selected.type === 'MOON' ? '◎' : '◆'}
          </div>
          <div>
            <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 16, fontWeight: 700, color: '#E8F4FF' }}>
              {selected.name}
            </div>
            <div style={{ fontSize: 10, color: typeColors[selected.type] ?? '#4A6080', fontFamily: 'Space Mono, monospace', letterSpacing: 1.5, marginTop: 3 }}>
              {selected.type}
              {selected.constellation && ` · ${selected.constellation}`}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ padding: '12px 14px', borderBottom: '1px solid rgba(30,111,255,0.08)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[
            { label: 'Altitude', value: `${selected.alt.toFixed(1)}°`, sub: selected.alt > 0 ? 'visible' : 'below horizon' },
            { label: 'Azimuth', value: `${selected.az.toFixed(1)}°`, sub: azLabel(selected.az) },
            { label: 'Distance', value: selected.distance, sub: '' },
            { label: 'Magnitude', value: String(selected.magnitude), sub: selected.magnitude < 0 ? 'very bright' : selected.magnitude < 3 ? 'visible' : 'binoculars' },
          ].map(s => (
            <div key={s.label} style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 8, padding: '9px 10px',
            }}>
              <div style={{ fontSize: 10, color: '#4A6080', marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 14, fontWeight: 700, color: '#E8F4FF' }}>{s.value}</div>
              {s.sub && <div style={{ fontSize: 9, color: '#2A3F5A', marginTop: 2 }}>{s.sub}</div>}
            </div>
          ))}
        </div>

        {/* Altitude indicator */}
        <div style={{ marginTop: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 10, color: '#4A6080' }}>Sky position</span>
            <span style={{ fontSize: 10, color: '#E8F4FF', fontFamily: 'Space Mono, monospace' }}>
              {selected.alt < 0 ? 'Below horizon' : selected.alt < 20 ? 'Near horizon' : selected.alt < 50 ? 'Mid sky' : 'High sky'}
            </span>
          </div>
          <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 3,
              background: `linear-gradient(90deg, ${selected.color}66, ${selected.color})`,
              width: `${Math.max(0, Math.min(100, ((selected.alt + 10) / 100) * 100))}%`,
              transition: 'width 0.5s ease',
            }} />
          </div>
        </div>
      </div>

      {/* Speed (satellites) */}
      {selected.speed && (
        <div style={{ padding: '10px 14px', borderBottom: '1px solid rgba(30,111,255,0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: '#4A6080' }}>Orbital velocity</span>
            <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 12, color: '#00D4AA' }}>{selected.speed}</span>
          </div>
        </div>
      )}

      {/* Description */}
      <div style={{ padding: '12px 14px', borderBottom: '1px solid rgba(30,111,255,0.08)' }}>
        <div style={{ fontSize: 10, letterSpacing: 1.5, color: '#4A6080', fontFamily: 'Space Mono, monospace', marginBottom: 7 }}>DESCRIPTION</div>
        <p style={{ fontSize: 12, color: 'rgba(232,244,255,0.7)', lineHeight: 1.8 }}>{selected.description}</p>
      </div>

      {/* Facts */}
      {selected.facts?.length > 0 && (
        <div style={{ padding: '12px 14px' }}>
          <div style={{ fontSize: 10, letterSpacing: 1.5, color: '#4A6080', fontFamily: 'Space Mono, monospace', marginBottom: 8 }}>KEY FACTS</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {selected.facts.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <div style={{ width: 4, height: 4, borderRadius: '50%', background: selected.color, marginTop: 6, flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: 'rgba(232,244,255,0.65)', lineHeight: 1.6 }}>{f}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ISSTab({ iss, weather }: { iss: ISSData | null; weather: WeatherData | null }) {
  return (
    <div>
      {/* Live header */}
      <div style={{
        padding: '12px 14px', borderBottom: '1px solid rgba(0,212,170,0.2)',
        background: 'linear-gradient(135deg, rgba(0,212,170,0.08), rgba(0,212,170,0.02))',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 13, fontWeight: 700, color: '#00D4AA' }}>International Space Station</div>
          <div style={{ fontSize: 10, color: '#4A6080', fontFamily: 'Space Mono, monospace', marginTop: 2 }}>ISS / ZARYA · NORAD 25544</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: '#00D4AA', fontFamily: 'Space Mono, monospace' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#00D4AA', animation: 'pulse 1.5s infinite' }} />
          LIVE
        </div>
      </div>

      <div style={{ padding: '12px 14px' }}>
        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
          {[
            { label: 'Altitude', value: iss ? `${iss.altitude.toFixed(1)} km` : '408 km', color: '#00D4AA' },
            { label: 'Velocity', value: iss ? `${(iss.velocity / 1000).toFixed(1)} km/s` : '7.66 km/s', color: '#1E6FFF' },
            { label: 'Latitude', value: iss ? `${iss.lat.toFixed(2)}°` : '—', color: '#E8F4FF' },
            { label: 'Longitude', value: iss ? `${iss.lng.toFixed(2)}°` : '—', color: '#E8F4FF' },
            { label: 'Crew', value: iss ? `${iss.crewCount ?? 7} members` : '7 members', color: '#FAC775' },
            { label: 'Orbits/day', value: '15.5', color: '#8B5CF6' },
          ].map(s => (
            <div key={s.label} style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 8, padding: '9px 10px',
            }}>
              <div style={{ fontSize: 10, color: '#4A6080', marginBottom: 3 }}>{s.label}</div>
              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 13, fontWeight: 700, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Orbit visualization */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 10, color: '#4A6080', fontFamily: 'Space Mono, monospace', marginBottom: 8, letterSpacing: 1 }}>ORBITAL PROGRESS</div>
          <div style={{ position: 'relative', height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{
              height: '100%', background: 'linear-gradient(90deg, #00D4AA44, #00D4AA)',
              borderRadius: 3, animation: 'issOrbit 5400s linear infinite',
              width: `${((Date.now() / 1000) % 5400) / 54}%`,
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
            <span style={{ fontSize: 9, color: '#2A3F5A', fontFamily: 'Space Mono, monospace' }}>Orbit start</span>
            <span style={{ fontSize: 9, color: '#2A3F5A', fontFamily: 'Space Mono, monospace' }}>90 min</span>
          </div>
        </div>

        {/* Observing conditions */}
        <div style={{
          background: 'rgba(0,212,170,0.06)', border: '1px solid rgba(0,212,170,0.2)',
          borderRadius: 8, padding: '10px 12px',
        }}>
          <div style={{ fontSize: 11, color: '#00D4AA', marginBottom: 8, fontFamily: 'Space Mono, monospace', letterSpacing: 1 }}>OBSERVING CONDITIONS</div>
          <div style={{ fontSize: 12, color: 'rgba(232,244,255,0.7)', lineHeight: 1.8 }}>
            {weather?.cloudCover !== undefined && weather.cloudCover < 30
              ? '✓ Good conditions for ISS observation tonight.'
              : '⚠ Cloud cover may affect visibility.'}
          </div>
          <div style={{ marginTop: 6, fontSize: 11, color: '#4A6080' }}>
            Look for a bright, fast-moving point of light crossing the sky in ~2–5 minutes.
          </div>
        </div>

        <div style={{ marginTop: 12, padding: '10px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: 10, color: '#4A6080', lineHeight: 1.7 }}>
            The ISS orbits Earth at approximately 408 km altitude and is visible to the naked eye as a bright moving star — often the third brightest object in the night sky.
          </div>
        </div>
      </div>
    </div>
  );
}

function NEOTab({ asteroids }: { asteroids: { id: string; name: string; diameter: number; velocity: number; distanceLunar: number; closestApproach: string; hazardous: boolean }[] }) {
  return (
    <div>
      <div style={{
        padding: '12px 14px', borderBottom: '1px solid rgba(240,149,149,0.2)',
        background: 'rgba(240,149,149,0.05)',
      }}>
        <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 12, fontWeight: 700, color: '#F09595' }}>Near-Earth Objects</div>
        <div style={{ fontSize: 10, color: '#4A6080', fontFamily: 'Space Mono, monospace', marginTop: 2 }}>NASA NeoWs · Next 7 days</div>
      </div>

      <div style={{ padding: '10px 14px' }}>
        {asteroids.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 20, color: '#4A6080', fontSize: 12 }}>Loading asteroid data...</div>
        ) : asteroids.map(ast => (
          <div key={ast.id} style={{
            marginBottom: 10, padding: '10px 12px',
            background: 'rgba(255,255,255,0.02)', border: `1px solid ${ast.hazardous ? 'rgba(240,60,60,0.3)' : 'rgba(255,255,255,0.07)'}`,
            borderRadius: 8,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 12, color: '#E8F4FF' }}>{ast.name}</div>
              {ast.hazardous && (
                <span style={{ fontSize: 9, color: '#F04444', background: 'rgba(240,68,68,0.15)', border: '1px solid rgba(240,68,68,0.3)', borderRadius: 4, padding: '2px 6px', fontFamily: 'Space Mono, monospace' }}>
                  PHA
                </span>
              )}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
              {[
                { l: 'Diameter', v: `~${ast.diameter}m` },
                { l: 'Distance', v: `${ast.distanceLunar} LD` },
                { l: 'Approach', v: ast.closestApproach },
              ].map(s => (
                <div key={s.l}>
                  <div style={{ fontSize: 9, color: '#4A6080', marginBottom: 2 }}>{s.l}</div>
                  <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: '#E8F4FF' }}>{s.v}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div style={{ marginTop: 6, fontSize: 10, color: '#2A3F5A', fontFamily: 'Space Mono, monospace', lineHeight: 1.6 }}>
          LD = Lunar Distance (384,400 km)<br />
          PHA = Potentially Hazardous Asteroid
        </div>
      </div>
    </div>
  );
}

function APODTab({ apod }: { apod: APODData | null }) {
  return (
    <div>
      <div style={{
        padding: '12px 14px', borderBottom: '1px solid rgba(30,111,255,0.15)',
        background: 'rgba(30,111,255,0.05)',
      }}>
        <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 12, fontWeight: 700, color: '#1E6FFF' }}>Astronomy Picture of the Day</div>
        <div style={{ fontSize: 10, color: '#4A6080', fontFamily: 'Space Mono, monospace', marginTop: 2 }}>NASA APOD</div>
      </div>

      <div style={{ padding: '12px 14px' }}>
        {/* Image */}
        {apod?.url && apod.mediaType === 'image' ? (
          <img src={apod.url} alt={apod.title}
            style={{ width: '100%', borderRadius: 8, marginBottom: 12, maxHeight: 140, objectFit: 'cover', border: '1px solid rgba(30,111,255,0.2)' }}
          />
        ) : (
          <div style={{
            width: '100%', height: 120, borderRadius: 8, marginBottom: 12,
            background: 'linear-gradient(135deg, #0a0f1a, #0d2040, #0a1628)',
            border: '1px solid rgba(30,111,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="70" height="70" viewBox="0 0 70 70">
              <circle cx="35" cy="35" r="30" fill="none" stroke="rgba(30,111,255,0.3)" strokeWidth="1"/>
              <circle cx="35" cy="35" r="16" fill="rgba(30,111,255,0.08)" stroke="rgba(0,212,170,0.4)" strokeWidth="1"/>
              <circle cx="35" cy="35" r="6" fill="rgba(0,212,170,0.25)" stroke="rgba(0,212,170,0.7)" strokeWidth="1.5"/>
              <ellipse cx="35" cy="35" rx="28" ry="7" fill="none" stroke="rgba(139,92,246,0.3)" strokeWidth="1" transform="rotate(-20 35 35)"/>
            </svg>
          </div>
        )}

        <div style={{ fontSize: 9, color: '#4A6080', fontFamily: 'Space Mono, monospace', marginBottom: 5, letterSpacing: 1 }}>
          {apod?.date ?? new Date().toISOString().split('T')[0]}
          {apod?.copyright && ` · © ${apod.copyright}`}
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#E8F4FF', marginBottom: 8, lineHeight: 1.4 }}>
          {apod?.title ?? 'Saturn at Opposition 2026'}
        </div>
        <p style={{ fontSize: 12, color: 'rgba(232,244,255,0.6)', lineHeight: 1.8 }}>
          {apod?.explanation ?? 'Saturn reaches opposition tonight, positioning Earth directly between the ringed giant and the Sun, offering the best views of the year.'}
        </p>

        <a href="https://apod.nasa.gov" target="_blank" rel="noopener noreferrer"
          style={{
            display: 'block', marginTop: 12, padding: '8px 12px', textAlign: 'center',
            background: 'rgba(30,111,255,0.15)', border: '1px solid rgba(30,111,255,0.4)',
            borderRadius: 7, color: '#1E6FFF', fontSize: 11, textDecoration: 'none',
            fontFamily: 'Space Mono, monospace', letterSpacing: 1,
          }}>
          VIEW ON NASA APOD →
        </a>
      </div>
    </div>
  );
}

function azLabel(az: number): string {
  if (az < 22.5 || az >= 337.5) return 'North';
  if (az < 67.5) return 'NE';
  if (az < 112.5) return 'East';
  if (az < 157.5) return 'SE';
  if (az < 202.5) return 'South';
  if (az < 247.5) return 'SW';
  if (az < 292.5) return 'West';
  return 'NW';
}
