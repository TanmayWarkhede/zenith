import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.NASA_API_KEY || 'DEMO_KEY';
    const res = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) throw new Error('APOD API error');
    const data = await res.json();

    return NextResponse.json({
      date: data.date,
      title: data.title,
      explanation: data.explanation?.slice(0, 300) + '...',
      url: data.url,
      hdUrl: data.hdurl,
      mediaType: data.media_type,
      copyright: data.copyright,
    });
  } catch {
    // Fallback APOD data
    return NextResponse.json({
      date: new Date().toISOString().split('T')[0],
      title: 'Saturn at Opposition 2026',
      explanation: 'Saturn reaches opposition tonight, positioning Earth directly between the ringed giant and the Sun. This offers the best views of the year — Saturn appears 135% brighter than average, with ring tilt at 9° revealing the Cassini Division clearly...',
      url: null,
      mediaType: 'image',
      copyright: 'NASA/JPL',
      fallback: true,
    });
  }
}
