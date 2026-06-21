import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get('lat') || '21.1458';
  const lng = searchParams.get('lng') || '79.0882';

  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,cloud_cover,wind_speed_10m,surface_pressure,visibility,weather_code&timezone=auto&forecast_days=1`,
      { next: { revalidate: 900 } }
    );

    if (!res.ok) throw new Error('Weather API error');
    const data = await res.json();
    const c = data.current;

    const cloudCover = c.cloud_cover ?? 20;
    const transparency = Math.max(20, 100 - cloudCover);
    const seeing = Math.max(20, 85 - cloudCover * 0.5 - (c.wind_speed_10m ?? 0) * 0.8);

    return NextResponse.json({
      temperature: Math.round(c.temperature_2m ?? 25),
      humidity: Math.round(c.relative_humidity_2m ?? 60),
      cloudCover: Math.round(cloudCover),
      windSpeed: Math.round(c.wind_speed_10m ?? 10),
      visibility: Math.round((c.visibility ?? 10000) / 1000),
      pressure: Math.round(c.surface_pressure ?? 1013),
      transparency: Math.round(transparency),
      seeing: Math.round(seeing),
      lightPollution: 55,
      condition: getCondition(c.weather_code ?? 0),
    });
  } catch {
    return NextResponse.json({
      temperature: 26,
      humidity: 62,
      cloudCover: 15,
      windSpeed: 8,
      visibility: 10,
      pressure: 1013,
      transparency: 85,
      seeing: 74,
      lightPollution: 55,
      condition: 'Clear',
      fallback: true,
    });
  }
}

function getCondition(code: number): string {
  if (code === 0) return 'Clear';
  if (code <= 3) return 'Partly Cloudy';
  if (code <= 48) return 'Cloudy';
  if (code <= 67) return 'Rain';
  if (code <= 77) return 'Snow';
  if (code <= 82) return 'Showers';
  return 'Thunderstorm';
}
