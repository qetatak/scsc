import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'تدريبك Tadreebak — المختبرات العملية وبناء البروفايل المهني';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#0A1630',
          padding: '64px 72px',
          color: '#FAFBFC',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(227, 232, 240, 0.16)',
            paddingBottom: '28px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: '#2F6BFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                fontWeight: 700,
                color: '#FAFBFC',
              }}
            >
              T
            </div>
            <span style={{ fontSize: '28px', fontWeight: 600, letterSpacing: '-0.02em' }}>
              Tadreebak — تدريبك
            </span>
          </div>
          <span
            style={{
              fontSize: '18px',
              color: '#94A3B8',
              border: '1px solid rgba(227, 232, 240, 0.2)',
              borderRadius: '8px',
              padding: '8px 16px',
            }}
          >
            4 Interactive Simulation Labs
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            style={{
              fontSize: '56px',
              fontWeight: 600,
              lineHeight: 1.15,
              color: '#FAFBFC',
            }}
          >
            تدرّب في مختبرات حية. ابنِ بروفايلك بالنتائج. دع الشركات تجدك.
          </div>
          <div style={{ fontSize: '24px', color: '#94A3B8' }}>
            المحاسبة المالية · التسويق الرقمي · إدارة الأعمال · برمجة Python
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(227, 232, 240, 0.16)',
            paddingTop: '24px',
            fontSize: '18px',
            color: '#94A3B8',
          }}
        >
          <span>Virtual Company Simulation Engine</span>
          <span style={{ color: '#2F6BFF', fontWeight: 600 }}>tadreebak.com</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
