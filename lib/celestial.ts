// Celestial mechanics calculations

export function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function toDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

export function julianDate(date: Date): number {
  return date.getTime() / 86400000 + 2440587.5;
}

export function lstDeg(date: Date, longitude: number): number {
  const jd = julianDate(date);
  const t = (jd - 2451545.0) / 36525;
  let gst = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * t * t;
  gst = ((gst % 360) + 360) % 360;
  return ((gst + longitude) % 360 + 360) % 360;
}

export function raDecToAltAz(
  ra: number,
  dec: number,
  lat: number,
  lng: number,
  date: Date
): { alt: number; az: number } {
  const lst = lstDeg(date, lng);
  const ha = toRad(lst - ra);
  const decR = toRad(dec);
  const latR = toRad(lat);

  const sinAlt = Math.sin(decR) * Math.sin(latR) + Math.cos(decR) * Math.cos(latR) * Math.cos(ha);
  const alt = toDeg(Math.asin(Math.max(-1, Math.min(1, sinAlt))));

  const cosAz =
    (Math.sin(decR) - Math.sin(toRad(alt)) * Math.sin(latR)) /
    (Math.cos(toRad(alt)) * Math.cos(latR));
  let az = toDeg(Math.acos(Math.max(-1, Math.min(1, cosAz))));
  if (Math.sin(ha) > 0) az = 360 - az;

  return { alt, az };
}

export function solarPosition(date: Date): { ra: number; dec: number } {
  const jd = julianDate(date);
  const n = jd - 2451545.0;
  const L = ((280.46 + 0.9856474 * n) % 360 + 360) % 360;
  const g = toRad(((357.528 + 0.9856003 * n) % 360 + 360) % 360);
  const lambda = toRad(L + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g));
  const epsilon = toRad(23.439 - 0.0000004 * n);

  const ra = toDeg(Math.atan2(Math.cos(epsilon) * Math.sin(lambda), Math.cos(lambda)));
  const dec = toDeg(Math.asin(Math.sin(epsilon) * Math.sin(lambda)));

  return { ra: ((ra % 360) + 360) % 360, dec };
}

export function moonPosition(date: Date): { ra: number; dec: number; phase: number } {
  const jd = julianDate(date);
  const d = jd - 2451545.0;

  const L = ((218.316 + 13.176396 * d) % 360 + 360) % 360;
  const M = toRad(((134.963 + 13.064993 * d) % 360 + 360) % 360);
  const F = toRad(((93.272 + 13.229350 * d) % 360 + 360) % 360);

  const lon = L + 6.289 * Math.sin(M);
  const lat = 5.128 * Math.sin(F);

  const lonR = toRad(lon);
  const latR = toRad(lat);
  const epsilon = toRad(23.439);

  const ra = toDeg(Math.atan2(Math.sin(lonR) * Math.cos(epsilon) - Math.tan(latR) * Math.sin(epsilon), Math.cos(lonR)));
  const dec = toDeg(Math.asin(Math.sin(latR) * Math.cos(epsilon) + Math.cos(latR) * Math.sin(epsilon) * Math.sin(lonR)));

  const sunPos = solarPosition(date);
  const elongation = ((lon - sunPos.ra) % 360 + 360) % 360;
  const phase = (1 - Math.cos(toRad(elongation))) / 2;

  return { ra: ((ra % 360) + 360) % 360, dec, phase };
}

// Approximate planet positions (mean elements)
const PLANET_ELEMENTS: Record<string, { L0: number; L1: number; a: number; e: number; I: number; omega: number; mag0: number }> = {
  mercury: { L0: 252.251, L1: 149474.0722, a: 0.387, e: 0.206, I: 7.005, omega: 77.456, mag0: -0.42 },
  venus:   { L0: 181.980, L1: 58519.2130,  a: 0.723, e: 0.007, I: 3.395, omega: 131.564, mag0: -4.67 },
  mars:    { L0: 355.433, L1: 19141.6964,  a: 1.524, e: 0.093, I: 1.850, omega: 336.060, mag0: -1.52 },
  jupiter: { L0: 34.351,  L1: 3036.3027,   a: 5.203, e: 0.049, I: 1.303, omega: 14.330, mag0: -9.25 },
  saturn:  { L0: 50.077,  L1: 1223.5110,   a: 9.537, e: 0.057, I: 2.489, omega: 93.057, mag0: -8.88 },
};

export function planetPosition(
  name: string,
  date: Date,
  lat: number,
  lng: number
): { alt: number; az: number; magnitude: number; distanceAU: number } {
  const el = PLANET_ELEMENTS[name.toLowerCase()];
  if (!el) return { alt: 30, az: 180, magnitude: 0, distanceAU: 1 };

  const jd = julianDate(date);
  const T = (jd - 2451545.0) / 36525;
  const L = toRad(((el.L0 + el.L1 * T / 100) % 360 + 360) % 360);
  const M = L; // simplified mean anomaly
  const v = M + 2 * el.e * Math.sin(M);
  const r = el.a * (1 - el.e * el.e) / (1 + el.e * Math.cos(v));

  // Heliocentric ecliptic
  const lonHel = toDeg(v) + el.omega;
  const latHel = 0;

  // Approximate geocentric: subtract Earth's position
  const earthL = ((100.464 + 36000.7698 * T) % 360 + 360) % 360;
  const earthR = 1.0; // AU

  const lRad = toRad(lonHel);
  const eRad = toRad(earthL);
  const x = r * Math.cos(lRad) - earthR * Math.cos(eRad);
  const y = r * Math.sin(lRad) - earthR * Math.sin(eRad);

  const lambda = toDeg(Math.atan2(y, x));
  const delta = Math.sqrt(x * x + y * y);

  const ra = ((lambda % 360) + 360) % 360;
  const dec = latHel;

  const { alt, az } = raDecToAltAz(ra, dec, lat, lng, date);
  const magnitude = el.mag0 + 5 * Math.log10(r * delta);

  return { alt, az, magnitude: Math.round(magnitude * 10) / 10, distanceAU: Math.round(delta * 100) / 100 };
}

export function getMoonPhaseEmoji(phase: number): string {
  if (phase < 0.0625) return '🌑';
  if (phase < 0.1875) return '🌒';
  if (phase < 0.3125) return '🌓';
  if (phase < 0.4375) return '🌔';
  if (phase < 0.5625) return '🌕';
  if (phase < 0.6875) return '🌖';
  if (phase < 0.8125) return '🌗';
  if (phase < 0.9375) return '🌘';
  return '🌑';
}

export function getMoonPhaseName(phase: number): string {
  if (phase < 0.05) return 'New Moon';
  if (phase < 0.20) return 'Waxing Crescent';
  if (phase < 0.30) return 'First Quarter';
  if (phase < 0.45) return 'Waxing Gibbous';
  if (phase < 0.55) return 'Full Moon';
  if (phase < 0.70) return 'Waning Gibbous';
  if (phase < 0.80) return 'Last Quarter';
  if (phase < 0.95) return 'Waning Crescent';
  return 'New Moon';
}

export function altAzToCanvas(
  alt: number,
  az: number,
  cx: number,
  cy: number,
  radius: number
): { x: number; y: number } {
  const r = (1 - Math.max(0, alt) / 90) * radius;
  const azRad = toRad(az - 90);
  return {
    x: cx + r * Math.cos(azRad),
    y: cy + r * Math.sin(azRad),
  };
}

export function isSatelliteVisible(issLat: number, issLng: number, obsLat: number, obsLng: number): boolean {
  const dlat = toRad(issLat - obsLat);
  const dlng = toRad(issLng - obsLng);
  const a = Math.sin(dlat / 2) ** 2 + Math.cos(toRad(obsLat)) * Math.cos(toRad(issLat)) * Math.sin(dlng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const dist = 6371 * c;
  return dist < 2000;
}
