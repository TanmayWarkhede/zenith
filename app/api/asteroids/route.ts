import { NextResponse } from 'next/server';

interface NeoObject {
  id: string;
  name: string;
  estimated_diameter: {
    meters: { estimated_diameter_min: number; estimated_diameter_max: number };
  };
  is_potentially_hazardous_asteroid: boolean;
  close_approach_data: Array<{
    close_approach_date: string;
    miss_distance: { lunar: string };
    relative_velocity: { kilometers_per_hour: string };
  }>;
}

export async function GET() {
  try {
    const apiKey = process.env.NASA_API_KEY || 'DEMO_KEY';
    const today = new Date().toISOString().split('T')[0];
    const end = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];

    const res = await fetch(
      `https://api.nasa.gov/neo/rest/v1/feed?start_date=${today}&end_date=${end}&api_key=${apiKey}`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) throw new Error('NeoWs error');
    const data = await res.json();

    const asteroids: {
      id: string; name: string; diameter: number; velocity: number;
      distanceLunar: number; closestApproach: string; hazardous: boolean;
    }[] = [];

    const days = data.near_earth_objects as Record<string, NeoObject[]>;
    for (const dayData of Object.values(days)) {
      for (const neo of dayData) {
        const ca = neo.close_approach_data[0];
        asteroids.push({
          id: neo.id,
          name: neo.name.replace(/[()]/g, ''),
          diameter: Math.round(
            (neo.estimated_diameter.meters.estimated_diameter_min +
              neo.estimated_diameter.meters.estimated_diameter_max) / 2
          ),
          velocity: Math.round(parseFloat(ca.relative_velocity.kilometers_per_hour)),
          distanceLunar: Math.round(parseFloat(ca.miss_distance.lunar) * 10) / 10,
          closestApproach: ca.close_approach_date,
          hazardous: neo.is_potentially_hazardous_asteroid,
        });
      }
    }

    asteroids.sort((a, b) => a.distanceLunar - b.distanceLunar);
    return NextResponse.json(asteroids.slice(0, 5));
  } catch {
    return NextResponse.json([
      { id: 'sim-1', name: '2026 JA₁', diameter: 120, velocity: 28400, distanceLunar: 3.2,
        closestApproach: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0], hazardous: false },
      { id: 'sim-2', name: '418094 2007 WV4', diameter: 340, velocity: 42100, distanceLunar: 8.7,
        closestApproach: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0], hazardous: false },
    ]);
  }
}
