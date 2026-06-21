'use client';

interface HeaderProps {
  currentTime: Date;
  location: string;
  objectCount: number;
}

export default function Header({ currentTime, location, objectCount }: HeaderProps) {
  const utc = currentTime.toUTCString().slice(17, 25);

  return (
    <header style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '12px 20px',
      background: 'rgba(3,8,18,0.95)',
      borderBottom: '1px solid rgba(30,111,255,0.2)',
      backdropFilter: 'blur(12px)',
      position: 'relative', zIndex: 10, flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 38, height: 38, borderRadius: '50%',
          background: 'linear-gradient(135deg, #1E6FFF, #00D4AA)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, flexShrink: 0, boxShadow: '0 0 16px rgba(30,111,255,0.5)',
        }}>✦</div>
        <div>
          <div style={{
            fontFamily: 'Orbitron, sans-serif', fontSize: 16, fontWeight: 900, letterSpacing: 3,
            background: 'linear-gradient(90deg, #1E6FFF, #00D4AA)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>PROJECT ZENITH</div>
          <div style={{ fontSize: 9, color: '#4A6080', letterSpacing: 3, fontFamily: 'Space Mono, monospace', marginTop: 1 }}>
            THE CELESTIAL EYE
          </div>
        </div>
      </div>

      {/* Center info */}
      <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
        <Chip icon="📍" label={location} />
        <Chip icon="✦" label={`${objectCount} objects`} color="#8B5CF6" />
        <Chip icon="🌐" label="Real-time" color="#00D4AA" />
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{
            width: 7, height: 7, borderRadius: '50%', background: '#00D4AA',
            animation: 'pulse 1.5s ease infinite',
          }} />
          <span style={{ fontSize: 11, color: '#00D4AA', fontFamily: 'Space Mono, monospace', letterSpacing: 1 }}>LIVE TRACKING</span>
        </div>
        <div style={{
          fontFamily: 'Space Mono, monospace', fontSize: 12, color: '#4A6080',
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 6, padding: '5px 10px',
        }}>
          UTC {utc}
        </div>
      </div>
    </header>
  );
}

function Chip({ icon, label, color = '#4A6080' }: { icon: string; label: string; color?: string }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      fontSize: 11, color, fontFamily: 'Space Mono, monospace',
      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 6, padding: '5px 10px',
    }}>
      <span>{icon}</span>
      <span>{label}</span>
    </div>
  );
}
