import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#0f0f10',
          color: 'white',
          fontSize: 56,
          fontWeight: 600,
          fontFamily: 'Arial',
          padding: 60,
        }}
      >
        <div style={{ fontSize: 24, letterSpacing: 4, textTransform: 'uppercase', opacity: 0.75 }}>
          Vijetha Digital
        </div>
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          Printing, Signage & Vehicle Branding
        </div>
      </div>
    ),
    size,
  );
}
