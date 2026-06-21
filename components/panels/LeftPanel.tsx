'use client';
import { useState } from 'react';
import type { Location, FilterState, SkyViewState } from '@/types';
import { LOCATIONS } from '@/lib/data';

interface LeftPanelProps {
  location: Location;
  onLocationChange: (loc: Location) => void;
  filters: FilterState;
  onFilterChange: (f: FilterState) => void;
  timeOffset: number;
  onTimeOffsetChange: (v: number) => void;
  skyState: SkyViewState;
  onSkyStateChange: (s: SkyViewState) => void;
  currentTime: Date;
  weather: { transparency: number; seeing: number; lightPollution: number; cloudCover: number } | null;
}

const CATEGORIES = [
  { key: 'PLANET' as keyof FilterState, label: 'Planets', color: '#EF9F27', icon: '⬤' },
  { key: 'STAR' as keyof FilterState, label: 'Stars', color: '#B5D4F4', icon: '✦' },
  { key: 'SATELLITE' as keyof FilterState, label: 'Satellites', color: '#00D4AA', icon: '◈' },
  { key: 'MOON' as keyof FilterState, label: 'Moon', color: '#D3D1C7', icon: '◎' },
  { key: 'ASTEROID' as keyof FilterState, label: 'Asteroids', color: '#F09595', icon: '◆' },
];

export default function LeftPanel({
  location, onLocationChange, filters, onFilterChange,
  timeOffset, onTimeOffsetChange, skyState, onSkyStateChange,
  currentTime, weather
}: LeftPanelProps) {
  const [locOpen, setLocOpen] = useState(false);

  const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  const timeStr = [
    String(currentTime.getHours()).padStart(2, '0'),
    String(currentTime.getMinutes()).padStart(2, '0'),
    String(currentTime.getSeconds()).padStart(2, '0'),
  ].join(':');
  const dateStr = `${String(currentTime.getDate()).padStart(2,'0')} ${months[currentTime.getMonth()]} ${currentTime.getFullYear()}`;

  return (
    <div className="flex flex-col overflow-y-auto h-full" style={{ background: 'rgba(5,10,20,0.93)', borderRight: '1px solid rgba(30,111,255,0.2)' }}>

      {/* Location */}
      <div style={{ padding: '14px 14px 12px', borderBottom: '1px solid rgba(30,111,255,0.1)' }}>
        <div style={{ fontSize: 9, letterSpacing: 2, color: '#4A6080', fontFamily: 'Space Mono, monospace', textTransform: 'uppercase', marginBottom: 8 }}>
          📍 Observer Location
        </div>
        <button
          onClick={() => setLocOpen(!locOpen)}
          style={{
            width: '100%', background: 'rgba(30,111,255,0.08)', border: '1px solid rgba(30,111,255,0.25)',
            borderRadius: 8, padding: '10px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(30,111,255,0.15)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(30,111,255,0.08)')}
        >
          <span style={{ color: '#00D4AA', fontSize: 18 }}>◎</span>
          <div style={{ flex: 1, textAlign: 'left' }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: '#E8F4FF' }}>{location.name}</div>
            <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: '#4A6080', marginTop: 2 }}>
              {location.lat.toFixed(4)}° N · {location.lng.toFixed(4)}° E
            </div>
          </div>
          <span style={{ color: '#4A6080', fontSize: 12, transform: locOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
        </button>

        {locOpen && (
          <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {LOCATIONS.map(loc => (
              <button
                key={loc.name}
                onClick={() => { onLocationChange(loc); setLocOpen(false); }}
                style={{
                  background: loc.name === location.name ? 'rgba(30,111,255,0.2)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${loc.name === location.name ? 'rgba(30,111,255,0.5)' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: 6, padding: '7px 10px', cursor: 'pointer', textAlign: 'left',
                  color: loc.name === location.name ? '#E8F4FF' : '#4A6080',
                  fontSize: 12, transition: 'all 0.15s',
                }}
              >
                {loc.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Filters */}
      <div style={{ padding: '12px 14px', borderBottom: '1px solid rgba(30,111,255,0.1)' }}>
        <div style={{ fontSize: 9, letterSpacing: 2, color: '#4A6080', fontFamily: 'Space Mono, monospace', textTransform: 'uppercase', marginBottom: 8 }}>
          🛰 Object Filters
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {CATEGORIES.map(cat => (
            <div key={cat.key} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '7px 10px', borderRadius: 7, cursor: 'pointer',
              border: `1px solid ${filters[cat.key] ? 'rgba(30,111,255,0.2)' : 'transparent'}`,
              background: filters[cat.key] ? 'rgba(30,111,255,0.07)' : 'transparent',
              transition: 'all 0.2s',
            }}
              onClick={() => onFilterChange({ ...filters, [cat.key]: !filters[cat.key] })}
            >
              <span style={{ color: cat.color, fontSize: 10 }}>{cat.icon}</span>
              <span style={{ fontSize: 12, fontWeight: 500, flex: 1, color: filters[cat.key] ? '#E8F4FF' : '#4A6080' }}>{cat.label}</span>
              <div style={{
                width: 30, height: 16, borderRadius: 8,
                background: filters[cat.key] ? cat.color : 'rgba(255,255,255,0.1)',
                border: `1px solid ${filters[cat.key] ? cat.color : 'rgba(255,255,255,0.15)'}`,
                position: 'relative', transition: 'all 0.25s',
              }}>
                <div style={{
                  width: 10, height: 10, borderRadius: '50%', background: 'white',
                  position: 'absolute', top: 2,
                  left: filters[cat.key] ? 16 : 2,
                  transition: 'left 0.25s',
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* View Options */}
      <div style={{ padding: '12px 14px', borderBottom: '1px solid rgba(30,111,255,0.1)' }}>
        <div style={{ fontSize: 9, letterSpacing: 2, color: '#4A6080', fontFamily: 'Space Mono, monospace', textTransform: 'uppercase', marginBottom: 8 }}>
          👁 View Options
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          {[
            { key: 'showConstellations', label: 'Constellations' },
            { key: 'showGrid', label: 'Alt/Az Grid' },
            { key: 'showLabels', label: 'Labels' },
            { key: 'showMilkyWay', label: 'Milky Way' },
          ].map(opt => (
            <button key={opt.key}
              onClick={() => onSkyStateChange({ ...skyState, [opt.key]: !skyState[opt.key as keyof SkyViewState] })}
              style={{
                background: skyState[opt.key as keyof SkyViewState] ? 'rgba(30,111,255,0.2)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${skyState[opt.key as keyof SkyViewState] ? 'rgba(30,111,255,0.5)' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: 6, padding: '7px 6px', cursor: 'pointer',
                fontSize: 10, color: skyState[opt.key as keyof SkyViewState] ? '#1E6FFF' : '#4A6080',
                fontFamily: 'Space Mono, monospace', transition: 'all 0.2s',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Time Controls */}
      <div style={{ padding: '12px 14px', borderBottom: '1px solid rgba(30,111,255,0.1)' }}>
        <div style={{ fontSize: 9, letterSpacing: 2, color: '#4A6080', fontFamily: 'Space Mono, monospace', textTransform: 'uppercase', marginBottom: 10 }}>
          ⏱ Time Control
        </div>
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 24, fontWeight: 700, color: '#00D4AA', letterSpacing: 2 }}>
            {timeStr}
          </div>
          <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: '#4A6080', marginTop: 2 }}>
            {dateStr}
          </div>
          {timeOffset !== 0 && (
            <div style={{ fontSize: 10, color: '#FAC775', fontFamily: 'Space Mono, monospace', marginTop: 4 }}>
              {timeOffset > 0 ? '+' : ''}{Math.round(timeOffset / 3600 * 10) / 10}h from now
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: 4, justifyContent: 'center', marginBottom: 10 }}>
          {[{l:'−6H',v:-21600},{l:'−1H',v:-3600},{l:'NOW',v:0},{l:'+1H',v:3600},{l:'+6H',v:21600}].map(b => (
            <button key={b.l} onClick={() => { b.v === 0 ? onTimeOffsetChange(0) : onTimeOffsetChange(timeOffset + b.v) }}
              style={{
                background: (b.v === 0 && timeOffset === 0) ? 'rgba(0,212,170,0.2)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${(b.v === 0 && timeOffset === 0) ? '#00D4AA' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: 6, padding: '5px 7px', cursor: 'pointer', fontSize: 10,
                color: (b.v === 0 && timeOffset === 0) ? '#00D4AA' : '#4A6080',
                fontFamily: 'Space Mono, monospace', transition: 'all 0.2s',
              }}
            >{b.l}</button>
          ))}
        </div>
        <input type="range" min={-24} max={24} step={0.5} value={timeOffset / 3600}
          onChange={e => onTimeOffsetChange(parseFloat(e.target.value) * 3600)}
          style={{ width: '100%', accentColor: '#1E6FFF' }}
        />
        <div style={{ fontSize: 9, color: '#2A3F5A', textAlign: 'center', fontFamily: 'Space Mono, monospace', marginTop: 4 }}>
          ±24 hours
        </div>
      </div>

      {/* Sky Visibility */}
      <div style={{ padding: '12px 14px' }}>
        <div style={{ fontSize: 9, letterSpacing: 2, color: '#4A6080', fontFamily: 'Space Mono, monospace', textTransform: 'uppercase', marginBottom: 10 }}>
          👁 Sky Conditions
        </div>
        {[
          { label: 'Transparency', value: weather?.transparency ?? 85, color: '#1E6FFF' },
          { label: 'Seeing', value: weather?.seeing ?? 74, color: '#00D4AA' },
          { label: 'Light Pollution', value: weather?.lightPollution ?? 55, color: '#8B5CF6' },
          { label: 'Cloud Cover', value: weather?.cloudCover ?? 15, color: '#4A6080', invert: true },
        ].map(bar => (
          <div key={bar.label} style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
              <span style={{ fontSize: 10, color: '#4A6080' }}>{bar.label}</span>
              <span style={{ fontSize: 10, color: '#E8F4FF', fontFamily: 'Space Mono, monospace' }}>
                {bar.invert ? bar.value : bar.value}%
              </span>
            </div>
            <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 3,
                background: `linear-gradient(90deg, ${bar.color}88, ${bar.color})`,
                width: `${bar.invert ? 100 - bar.value : bar.value}%`,
                transition: 'width 0.5s ease',
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
