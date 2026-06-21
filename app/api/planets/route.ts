import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { planetPosition } from '@/lib/celestial';
import { PLANETS_DATA } from '@/lib/data';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = parseFloat(searchParams.get('lat') || '21.1458');
  const lng = parseFloat(searchParams.get('lng') || '79.0882');
  const offsetHours = parseFloat(searchParams.get('offset') || '0');

  const date = new Date(Date.now() + offsetHours * 3600000);

  const results = PLANETS_DATA.map((p) => {
    const pos = planetPosition(p.id, date, lat, lng);
    return {
      ...p,
      type: 'PLANET' as const,
      orbiting: false,
      alt: pos.alt,
      az: ((pos.az % 360) + 360) % 360,
      magnitude: pos.magnitude,
      distanceAU: pos.distanceAU,
      distance: `${pos.distanceAU} AU`,
    };
  });

  return NextResponse.json(results);
}
