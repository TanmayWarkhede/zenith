import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Project Zenith — The Celestial Eye',
  description: 'Real-time sky exploration platform — track satellites, planets, stars, and more above any location on Earth.',
  keywords: ['astronomy', 'satellites', 'ISS', 'planets', 'sky map', 'celestial', 'space'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Inter:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, padding: 0, background: '#050A14', overflow: 'hidden' }}>
        {children}
      </body>
    </html>
  );
}
