import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 50%, #1e293b 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
        }}
      >
        <div style={{
          width: 120,
          height: 120,
          background: 'rgba(255,255,255,0.1)',
          borderRadius: 28,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px solid rgba(255,255,255,0.2)',
        }}>
          <span style={{
            color: 'white',
            fontSize: 52,
            fontWeight: 700,
            letterSpacing: -2,
          }}>EI</span>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            color: 'white',
            fontSize: 56,
            fontWeight: 700,
            letterSpacing: -2,
            lineHeight: 1,
          }}>
            Experiment Intelligence
          </div>
          <div style={{
            color: 'rgba(255,255,255,0.6)',
            fontSize: 24,
            fontWeight: 400,
            marginTop: 12,
          }}>
            AI-powered experiment recommendations for product teams
          </div>
        </div>
      </div>
    )
  )
}
