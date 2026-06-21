'use client';
import { useEffect, useRef, useCallback } from 'react';
import type { CelestialObject, SkyViewState, ISSData } from '@/types';
import { altAzToCanvas, toRad } from '@/lib/celestial';

interface SkyCanvasProps {
  objects: CelestialObject[];
  skyState: SkyViewState;
  selectedId: string | null;
  onHover: (obj: CelestialObject | null, x: number, y: number) => void;
  onClick: (obj: CelestialObject) => void;
  issData: ISSData | null;
  lat: number;
  timeOffset: number;
}

const STAR_COUNT = 500;

export default function SkyCanvas({
  objects, skyState, selectedId, onHover, onClick, lat, timeOffset
}: SkyCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<{ x: number; y: number; r: number; b: number; phase: number }[]>([]);
  const frameRef = useRef(0);
  const rafRef = useRef<number>(0);
  const objectsRef = useRef(objects);
  const skyStateRef = useRef(skyState);
  const selectedIdRef = useRef(selectedId);

  objectsRef.current = objects;
  skyStateRef.current = skyState;
  selectedIdRef.current = selectedId;

  // Init stars once
  useEffect(() => {
    const stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random(),
        y: Math.random(),
        r: Math.random() * 1.1 + 0.2,
        b: Math.random(),
        phase: Math.random() * Math.PI * 2,
      });
    }
    starsRef.current = stars;
  }, []);

  const draw = useCallback(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;

    const w = cv.width;
    const h = cv.height;
    const cx = w / 2;
    const cy = h * 0.52;
    const radius = Math.min(w, h) * 0.44 * skyStateRef.current.zoom;
    const t = Date.now() / 1000;
    frameRef.current++;

    ctx.clearRect(0, 0, w, h);

    // Sky dome bg
    const skyGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 1.1);
    skyGrad.addColorStop(0, 'rgba(8, 18, 35, 0.98)');
    skyGrad.addColorStop(0.6, 'rgba(5, 12, 25, 0.95)');
    skyGrad.addColorStop(1, 'rgba(3, 8, 18, 0.9)');
    ctx.fillStyle = skyGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.05, 0, Math.PI * 2);
    ctx.fill();

    // Milky Way
    if (skyStateRef.current.showMilkyWay) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-0.35);
      const mw = ctx.createLinearGradient(-w * 0.1, -h * 0.5, w * 0.1, h * 0.5);
      mw.addColorStop(0, 'rgba(160, 180, 255, 0)');
      mw.addColorStop(0.3, 'rgba(180, 190, 255, 0.09)');
      mw.addColorStop(0.5, 'rgba(200, 180, 255, 0.12)');
      mw.addColorStop(0.7, 'rgba(160, 180, 255, 0.08)');
      mw.addColorStop(1, 'rgba(160, 180, 255, 0)');
      ctx.fillStyle = mw;
      ctx.fillRect(-w * 0.08, -h * 0.5, w * 0.16, h * 1.1);
      ctx.restore();
    }

    // Background stars (tiny, twinkling)
    const stars = starsRef.current;
    stars.forEach(s => {
      const sx = cx + (s.x - 0.5) * radius * 2.2;
      const sy = cy + (s.y - 0.5) * radius * 2.2;
      // Only draw if inside dome
      if (Math.hypot(sx - cx, sy - cy) > radius) return;
      const alpha = 0.25 + 0.55 * s.b * (0.5 + 0.5 * Math.sin(t * (0.3 + s.b * 0.5) + s.phase));
      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#E8F4FF';
      ctx.beginPath();
      ctx.arc(sx, sy, s.r * skyStateRef.current.zoom * 0.7, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    // Grid
    if (skyStateRef.current.showGrid) {
      ctx.save();
      ctx.strokeStyle = 'rgba(30, 111, 255, 0.12)';
      ctx.lineWidth = 0.5;
      for (let a = 10; a < 90; a += 15) {
        const r = (1 - a / 90) * radius;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = 'rgba(74, 96, 128, 0.7)';
        ctx.font = '9px Space Mono, monospace';
        ctx.fillText(`${a}°`, cx + 4, cy - r + 10);
      }
      for (let az = 0; az < 360; az += 30) {
        const rad = toRad(az - 90);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + radius * Math.cos(rad), cy + radius * Math.sin(rad));
        ctx.stroke();
      }
      ctx.restore();
    }

    // Constellations
    if (skyStateRef.current.showConstellations) {
      drawConstellationHints(ctx, cx, cy, radius);
    }

    // Horizon ring
    ctx.save();
    const horizGrad = ctx.createRadialGradient(cx, cy + radius * 0.85, radius * 0.7, cx, cy, radius * 1.05);
    horizGrad.addColorStop(0, 'rgba(30, 60, 120, 0.2)');
    horizGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = horizGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.05, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(30, 111, 255, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    // Cardinal directions
    const cardinals = [
      { label: 'N', az: 0 }, { label: 'E', az: 90 },
      { label: 'S', az: 180 }, { label: 'W', az: 270 },
    ];
    ctx.font = 'bold 11px Space Mono, monospace';
    cardinals.forEach(c => {
      const rad = toRad(c.az - 90);
      const x = cx + (radius + 18) * Math.cos(rad);
      const y = cy + (radius + 18) * Math.sin(rad);
      ctx.fillStyle = 'rgba(74, 96, 128, 0.9)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(c.label, x, y);
    });

    // Objects
    objectsRef.current.forEach(obj => {
      if (obj.alt < -5) return;
      const pos = altAzToCanvas(obj.alt, obj.az, cx, cy, radius);
      const sz = obj.size * skyStateRef.current.zoom;
      const isSelected = selectedIdRef.current === obj.id;
      const isBelowHorizon = obj.alt < 0;

      if (isBelowHorizon) {
        // Draw faded at horizon edge
        ctx.globalAlpha = 0.2;
      }

      // Glow effect
      const glow = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, sz * 4);
      glow.addColorStop(0, obj.color + 'CC');
      glow.addColorStop(0.3, obj.color + '44');
      glow.addColorStop(1, obj.color + '00');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, sz * 4, 0, Math.PI * 2);
      ctx.fill();

      // Special Moon rendering
      if (obj.id === 'moon') {
        ctx.fillStyle = '#C8C8C8';
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, sz, 0, Math.PI * 2);
        ctx.fill();
        // Crater texture suggestion
        ctx.fillStyle = 'rgba(160,160,160,0.3)';
        ctx.beginPath();
        ctx.arc(pos.x - sz * 0.3, pos.y - sz * 0.2, sz * 0.25, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(pos.x + sz * 0.2, pos.y + sz * 0.3, sz * 0.15, 0, Math.PI * 2);
        ctx.fill();
      } else if (obj.type === 'PLANET') {
        // Planet with ring for Saturn
        ctx.fillStyle = obj.color;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, sz, 0, Math.PI * 2);
        ctx.fill();
        if (obj.id === 'saturn') {
          ctx.save();
          ctx.strokeStyle = '#FAC77588';
          ctx.lineWidth = sz * 0.4;
          ctx.beginPath();
          ctx.ellipse(pos.x, pos.y, sz * 2.2, sz * 0.5, toRad(20), 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
      } else if (obj.type === 'STAR') {
        // Star spike
        ctx.fillStyle = obj.color;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, sz, 0, Math.PI * 2);
        ctx.fill();
        ctx.save();
        ctx.strokeStyle = obj.color + 'AA';
        ctx.lineWidth = 0.8;
        const spikeLen = sz * 2.5;
        for (let i = 0; i < 4; i++) {
          const angle = (i * Math.PI) / 2;
          ctx.beginPath();
          ctx.moveTo(pos.x, pos.y);
          ctx.lineTo(pos.x + spikeLen * Math.cos(angle), pos.y + spikeLen * Math.sin(angle));
          ctx.stroke();
        }
        ctx.restore();
      } else {
        // Generic object
        ctx.fillStyle = obj.color;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, sz, 0, Math.PI * 2);
        ctx.fill();
      }

      // Satellite orbit pulse ring
      if (obj.orbiting) {
        const pr = sz + 4 + 3 * Math.sin(t * 2.5 + obj.id.charCodeAt(0));
        ctx.save();
        ctx.strokeStyle = obj.color + '55';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, pr, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // Selected ring
      if (isSelected) {
        const pulse = sz + 10 + 4 * Math.sin(t * 3);
        ctx.save();
        ctx.strokeStyle = obj.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, pulse, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([3, 6]);
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, pulse + 8, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;
        ctx.restore();
      }

      ctx.globalAlpha = 1;

      // Label
      if (skyStateRef.current.showLabels) {
        ctx.save();
        ctx.fillStyle = isBelowHorizon ? obj.color + '44' : obj.color + 'DD';
        ctx.font = `${Math.max(9, Math.min(12, 10 * skyStateRef.current.zoom))}px Space Mono, monospace`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(obj.name, pos.x + sz + 5, pos.y - sz / 2);
        ctx.restore();
      }
    });

    // Zenith crosshair
    ctx.save();
    ctx.strokeStyle = 'rgba(0, 212, 170, 0.5)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - 10, cy);
    ctx.lineTo(cx + 10, cy);
    ctx.moveTo(cx, cy - 10);
    ctx.lineTo(cx, cy + 10);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 212, 170, 0.5)';
    ctx.fill();
    ctx.restore();

    // Lat label
    ctx.fillStyle = 'rgba(74, 96, 128, 0.6)';
    ctx.font = '9px Space Mono, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`LAT ${lat.toFixed(2)}°`, cx, cy + radius + 35);

    rafRef.current = requestAnimationFrame(draw);
  }, [lat]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw]);

  // Resize
  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const resize = () => {
      const parent = cv.parentElement;
      if (!parent) return;
      cv.width = parent.clientWidth;
      cv.height = parent.clientHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(cv.parentElement!);
    return () => ro.disconnect();
  }, []);

  const handleMouse = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const cv = canvasRef.current;
    if (!cv) return;
    const rect = cv.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const cx = cv.width / 2;
    const cy = cv.height * 0.52;
    const radius = Math.min(cv.width, cv.height) * 0.44 * skyStateRef.current.zoom;

    let hovered: CelestialObject | null = null;
    objectsRef.current.forEach(obj => {
      const pos = altAzToCanvas(obj.alt, obj.az, cx, cy, radius);
      const d = Math.hypot(mx - pos.x, my - pos.y);
      if (d < obj.size * skyStateRef.current.zoom + 10) hovered = obj;
    });
    onHover(hovered, e.clientX, e.clientY);
    cv.style.cursor = hovered ? 'pointer' : 'default';
  }, [onHover]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const cv = canvasRef.current;
    if (!cv) return;
    const rect = cv.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const cx = cv.width / 2;
    const cy = cv.height * 0.52;
    const radius = Math.min(cv.width, cv.height) * 0.44 * skyStateRef.current.zoom;

    objectsRef.current.forEach(obj => {
      const pos = altAzToCanvas(obj.alt, obj.az, cx, cy, radius);
      const d = Math.hypot(mx - pos.x, my - pos.y);
      if (d < obj.size * skyStateRef.current.zoom + 12) onClick(obj);
    });
  }, [onClick]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      onMouseMove={handleMouse}
      onClick={handleClick}
      onMouseLeave={() => onHover(null, 0, 0)}
      style={{ fontFamily: 'Space Mono, monospace' }}
    />
  );
}

function drawConstellationHints(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number) {
  // Simplified constellation outlines for visual effect
  const consts = [
    {
      name: 'ORION', color: 'rgba(139, 92, 246, 0.25)',
      points: [
        [85, 7], [82, 2], [80, -3], [78, -8], [72, -9],
        [84, -1], [90, 4], [94, 8],
      ],
    },
    {
      name: 'SCORPIUS', color: 'rgba(139, 92, 246, 0.2)',
      points: [[247, -26], [252, -19], [244, -16], [241, -20], [247, -26], [252, -33], [254, -37]],
    },
  ];

  ctx.save();
  consts.forEach(c => {
    if (c.points.length < 2) return;
    ctx.beginPath();
    ctx.strokeStyle = c.color;
    ctx.lineWidth = 0.8;
    c.points.forEach((p, i) => {
      // These are fake alt/az for visual decoration
      const az = ((p[0] - 90) * Math.PI) / 180;
      const r = (1 - (p[1] + 30) / 120) * radius * 0.8;
      const x = cx + r * Math.cos(az);
      const y = cy + r * Math.sin(az);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Name
    const mid = c.points[Math.floor(c.points.length / 2)];
    const az = ((mid[0] - 90) * Math.PI) / 180;
    const r = (1 - (mid[1] + 30) / 120) * radius * 0.8;
    ctx.fillStyle = 'rgba(139, 92, 246, 0.5)';
    ctx.font = '8px Space Mono, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(c.name, cx + r * Math.cos(az) + 5, cy + r * Math.sin(az) - 8);
  });
  ctx.restore();
}
