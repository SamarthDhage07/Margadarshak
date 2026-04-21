import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid #e8e4de', background: '#0d0d0d' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '64px 28px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 48, marginBottom: 48 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 30, height: 30, background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#c9a96e', fontSize: 13, fontFamily: "'Cormorant Garamond',Georgia,serif", fontWeight: 700 }}>M</span>
              </div>
              <span style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontWeight: 600, fontSize: 18, color: '#faf8f5' }}>MargaDarshak</span>
            </div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', lineHeight: 1.8, maxWidth: 240 }}>
              Helping JEE &amp; CET students find the right college through real guidance and AI.
            </p>
            {/* Gold line */}
            <div style={{ width: 40, height: 1, background: 'linear-gradient(90deg, #c9a96e, transparent)', marginTop: 20 }} />
          </div>
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#c9a96e', marginBottom: 20 }}>Navigate</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[['/', 'Home'], ['/mentors', 'Mentors'], ['/onboarding', 'Get Started']].map(([href, label]) => (
                <Link key={href} href={href} style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', textDecoration: 'none', transition: 'color 0.2s' }}>{label}</Link>
              ))}
            </div>
          </div>
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#c9a96e', marginBottom: 20 }}>Contact</p>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>hello@margadarshak.in</p>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 8 }}>For JEE / MHT-CET Students</p>
          </div>
        </div>
        <div style={{ paddingTop: 28, borderTop: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>© {new Date().getFullYear()} MargaDarshak. All rights reserved.</p>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>Built for Indian engineering aspirants 🇮🇳</p>
        </div>
      </div>
    </footer>
  )
}
