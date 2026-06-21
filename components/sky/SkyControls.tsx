'use client';
import type { SkyViewState } from '@/types';

interface SkyControlsProps {
  skyState: SkyViewState;
  onSkyStateChange: (s: SkyViewState) => void;
  hoveredInfo: string;
}

export default function SkyControls({ skyState, onSkyStateChange, hoveredInfo }: SkyControlsProps) {
  const zoom = (delta: number) => {
    onSkyStateChange({ ...skyState, zoom: Math.max(0.5, Math.min(2.5, skyState.zoom + delta)) });
  };

  return (
    <>
      {/* Compass rose */}
      <div style={{ position: 'absolute', top: 14, right: 14 }}>
        <svg width="62" height="62" viewBox="0 0 62 62">
          <circle cx="31" cy="31" r="29" fill="rgba(3,8,18,0.75)" stroke="rgba(30,111,255,0.3)" strokeWidth="1"/>
          <text x="31" y="13" fontFamily="Space Mono, monospace" fontSize="9" fill="#4A6080" textAnchor="middle">N</text>
          <text x="51" y="34" fontFamily="Space Mono, monospace" fontSize="9" fill="#4A6080" textAnchor="middle">E</text>
          <text x="31" y="54" fontFamily="Space Mono, monospace" fontSize="9" fill="#4A6080" textAnchor="middle">S</text>
          <text x="11" y="34" fontFamily="Space Mono, monospace" fontSize="9" fill="#4A6080" textAnchor="middle">W</text>
          <polygon points="31,16 28.5,28 33.5,28" fill="#1E6FFF"/>
          <polygon points="31,46 28.5,34 33.5,34" fill="#4A6080" opacity="0.5"/>
          <circle cx="31" cy="31" r="3" fill="rgba(30,111,255,0.6)"/>
        </svg>
      </div>

      {/* View buttons */}
      <div style={{
        position: 'absolute', bottom: 50, right: 14,
        display: 'flex', flexDirection: 'column', gap: 6,
      }}>
        {[
          { label: '+', title: 'Zoom in', action: () => zoom(0.2) },
          { label: '−', title: 'Zoom out', action: () => zoom(-0.2) },
          {
            label: '✦', title: 'Constellations',
            action: () => onSkyStateChange({ ...skyState, showConstellations: !skyState.showConstellations }),
            active: skyState.showConstellations, activeColor: '#8B5CF6',
          },
          {
            label: '#', title: 'Grid',
            action: () => onSkyStateChange({ ...skyState, showGrid: !skyState.showGrid }),
            active: skyState.showGrid, activeColor: '#1E6FFF',
          },
          {
            label: 'A', title: 'Labels',
            action: () => onSkyStateChange({ ...skyState, showLabels: !skyState.showLabels }),
            active: skyState.showLabels, activeColor: '#00D4AA',
          },
        ].map(b => (
          <button key={b.label} onClick={b.action} title={b.title}
            style={{
              width: 34, height: 34, borderRadius: 8,
              background: b.active ? `rgba(${b.activeColor === '#8B5CF6' ? '139,92,246' : b.activeColor === '#1E6FFF' ? '30,111,255' : '0,212,170'},0.2)` : 'rgba(3,8,18,0.85)',
              border: `1px solid ${b.active ? (b.activeColor ?? 'rgba(30,111,255,0.5)') : 'rgba(30,111,255,0.2)'}`,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: b.active ? (b.activeColor ?? '#E8F4FF') : '#4A6080',
              fontSize: b.label === '+' || b.label === '−' ? 18 : 13,
              fontWeight: 700, backdropFilter: 'blur(8px)',
              transition: 'all 0.2s',
              fontFamily: b.label === 'A' ? 'Space Mono, monospace' : undefined,
            }}
          >{b.label}</button>
        ))}
      </div>

      {/* Zoom indicator */}
      <div style={{
        position: 'absolute', bottom: 50, left: 14,
        fontFamily: 'Space Mono, monospace', fontSize: 10, color: '#2A3F5A',
        background: 'rgba(3,8,18,0.7)', borderRadius: 6, padding: '4px 8px',
      }}>
        {skyState.zoom.toFixed(1)}× zoom
      </div>

      {/* Info bar */}
      <div style={{
        position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)',
        background: 'rgba(3,8,18,0.85)', border: '1px solid rgba(30,111,255,0.2)',
        borderRadius: 20, padding: '6px 18px',
        fontFamily: 'Space Mono, monospace', fontSize: 11, color: '#4A6080',
        backdropFilter: 'blur(8px)', whiteSpace: 'nowrap', pointerEvents: 'none',
      }}>
        {hoveredInfo || 'Hover to explore · Click to select · Scroll to zoom'}
      </div>
    </>
  );
}
