'use client';
import type { CelestialObject } from '@/types';

interface TooltipProps {
  obj: CelestialObject | null;
  x: number;
  y: number;
}

export default function Tooltip({ obj, x, y }: TooltipProps) {
  if (!obj) return null;

  const typeColors: Record<string, string> = {
    PLANET: '#EF9F27', STAR: '#B5D4F4', SATELLITE: '#00D4AA',
    ASTEROID: '#F09595', MOON: '#D3D1C7',
  };

  return (
    <div style={{
      position: 'fixed',
      left: x + 14,
      top: y - 10,
      zIndex: 1000,
      pointerEvents: 'none',
      background: 'rgba(3,8,18,0.97)',
      border: `1px solid ${obj.color}44`,
      borderRadius: 10,
      padding: '10px 14px',
      minWidth: 170,
      maxWidth: 220,
      backdropFilter: 'blur(16px)',
      boxShadow: `0 4px 24px rgba(0,0,0,0.6), 0 0 12px ${obj.color}22`,
    }}>
      <div style={{
        fontFamily: 'Orbitron, sans-serif', fontSize: 13, fontWeight: 700,
        color: '#E8F4FF', marginBottom: 3,
      }}>{obj.name}</div>
      <div style={{
        fontSize: 9, color: typeColors[obj.type] ?? '#4A6080',
        fontFamily: 'Space Mono, monospace', letterSpacing: 1.5, marginBottom: 8,
      }}>{obj.type}</div>
      {[
        { l: 'Altitude', v: `${obj.alt.toFixed(1)}°` },
        { l: 'Azimuth', v: `${obj.az.toFixed(1)}°` },
        { l: 'Magnitude', v: String(obj.magnitude) },
        { l: 'Distance', v: obj.distance },
      ].map(r => (
        <div key={r.l} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 4 }}>
          <span style={{ fontSize: 11, color: '#4A6080' }}>{r.l}</span>
          <span style={{ fontSize: 11, color: '#E8F4FF', fontFamily: 'Space Mono, monospace' }}>{r.v}</span>
        </div>
      ))}
      <div style={{ marginTop: 6, fontSize: 9, color: '#2A3F5A', fontFamily: 'Space Mono, monospace' }}>
        Click to select
      </div>
    </div>
  );
}
