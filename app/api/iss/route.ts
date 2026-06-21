import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Open Notify API for ISS position
    const res = await fetch('http://api.open-notify.org/iss-now.json', {
      next: { revalidate: 5 },
    });

    if (!res.ok) throw new Error('ISS API error');

    const data = await res.json();

    // Also get crew count
    let crewCount = 7;
    try {
      const crewRes = await fetch('http://api.open-notify.org/astros.json', {
        next: { revalidate: 3600 },
      });
      if (crewRes.ok) {
        const crewData = await crewRes.json();
        crewCount = crewData.people?.filter((p: { craft: string }) => p.craft === 'ISS').length ?? 7;
      }
    } catch { /* use default */ }

    return NextResponse.json({
      lat: parseFloat(data.iss_position.latitude),
      lng: parseFloat(data.iss_position.longitude),
      altitude: 408.5,
      velocity: 27600,
      crewCount,
      timestamp: data.timestamp,
      orbitsPerDay: 15.5,
    });
  } catch {
    // Fallback with simulated position
    const t = Date.now() / 1000;
    return NextResponse.json({
      lat: 20 * Math.sin(t / 5400),
      lng: ((t / 15) % 360) - 180,
      altitude: 408 + Math.random() * 2,
      velocity: 27600 + Math.random() * 100,
      crewCount: 7,
      timestamp: Math.floor(t),
      orbitsPerDay: 15.5,
      simulated: true,
    });
  }
}
