import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid #f3f4f6', background: '#fff' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 32, marginBottom: 36 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{ width: 24, height: 24, background: '#0a0a0a', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#fff', fontSize: 11, fontWeight: 700 }}>M</span>
              </div>
              <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 600, fontSize: 16 }}>MargaDarshak</span>
            </div>
            <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.7, maxWidth: 240 }}>
              Helping JEE &amp; CET students find the right college through real guidance and AI.
            </p>
          </div>
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#9ca3af', marginBottom: 14 }}>Navigate</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[['/', 'Home'], ['/mentors', 'Mentors'], ['/onboarding', 'Get Started']].map(([href, label]) => (
                <Link key={href} href={href} style={{ fontSize: 14, color: '#6b7280', textDecoration: 'none' }}>{label}</Link>
              ))}
            </div>
          </div>
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#9ca3af', marginBottom: 14 }}>Contact</p>
            <p style={{ fontSize: 14, color: '#6b7280' }}>hello@margadarshak.in</p>
            <p style={{ fontSize: 14, color: '#6b7280', marginTop: 6 }}>For JEE / MHT-CET students</p>
          </div>
        </div>
        <div style={{ paddingTop: 24, borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <p style={{ fontSize: 12, color: '#9ca3af' }}>© {new Date().getFullYear()} MargaDarshak. All rights reserved.</p>
          <p style={{ fontSize: 12, color: '#9ca3af' }}>Built for Indian engineering aspirants 🇮🇳</p>
        </div>
      </div>
    </footer>
  )
}
