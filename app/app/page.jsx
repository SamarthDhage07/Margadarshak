'use client'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AIChat from '@/components/AIChat'
import { useEffect, useRef } from 'react'

function CursorBg() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    let anim = { x: mouse.x, y: mouse.y }
    let raf
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY })
    const draw = () => {
      anim.x += (mouse.x - anim.x) * 0.05
      anim.y += (mouse.y - anim.y) * 0.05
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      // Warm glow
      const g = ctx.createRadialGradient(anim.x, anim.y, 0, anim.x, anim.y, 400)
      g.addColorStop(0, 'rgba(201,169,110,0.06)')
      g.addColorStop(0.5, 'rgba(201,169,110,0.02)')
      g.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = g; ctx.fillRect(0, 0, canvas.width, canvas.height)
      // Dot grid
      const sp = 36, r = 300
      for (let x = sp; x < canvas.width; x += sp) {
        for (let y = sp; y < canvas.height; y += sp) {
          const d = Math.hypot(x - anim.x, y - anim.y)
          const proximity = Math.max(0, 1 - d / r)
          ctx.globalAlpha = 0.04 + proximity * 0.12
          ctx.fillStyle = d < r ? `rgba(201,169,110,${0.3 + proximity * 0.5})` : '#0d0d0d'
          ctx.beginPath(); ctx.arc(x, y, 1 + proximity * 0.8, 0, Math.PI * 2); ctx.fill()
        }
      }
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} />
}

const STEPS = [
  { n: '01', title: 'Explore Mentors', desc: "Browse real students from COEP, VJTI, IITs who've walked the same path.", icon: '🔍' },
  { n: '02', title: 'Book a Session', desc: 'Schedule a free 1:1 guidance call at your preferred date and time.', icon: '📅' },
  { n: '03', title: 'Get Clarity', desc: 'Walk away with a clear college list, branch strategy, and next steps.', icon: '✨' },
]
const WHY = [
  { icon: '🎯', title: 'Real Mentors', desc: 'Not coaches. Actual students from top colleges who went through the same process as you.' },
  { icon: '🤖', title: 'AI-Powered', desc: 'Instant college suggestions based on your percentile — available 24/7, no waiting.' },
  { icon: '⚡', title: 'Completely Free', desc: 'No paywalls, no subscriptions. Just honest guidance from people who care.' },
]
const MENTORS = [
  { name: 'Aryan Kulkarni', college: 'COEP Pune', branch: 'CS', percentile: '99.4', exam: 'MHT-CET', color: '#eff6ff', tc: '#1d4ed8' },
  { name: 'Sneha Patil', college: 'VJTI Mumbai', branch: 'Electronics', percentile: '98.7', exam: 'MHT-CET', color: '#faf5ff', tc: '#7e22ce' },
  { name: 'Rahul Sharma', college: 'IIT Bombay', branch: 'CS', percentile: '99.9', exam: 'JEE Adv.', color: '#fff7ed', tc: '#c2410c' },
]

export default function Home() {
  return (
    <main style={{ minHeight: '100vh', background: '#faf8f5', position: 'relative' }}>
      <CursorBg />
      <div style={{ position: 'relative', zIndex: 10 }}>
        <Navbar />

        {/* ── HERO ── */}
        <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 24px 60px', position: 'relative' }}>
          {/* Decorative circles */}
          <div style={{ position: 'absolute', top: '15%', right: '8%', width: 320, height: 320, borderRadius: '50%', border: '1px solid rgba(201,169,110,0.15)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: '18%', right: '11%', width: 200, height: 200, borderRadius: '50%', border: '1px solid rgba(201,169,110,0.1)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '15%', left: '5%', width: 250, height: 250, borderRadius: '50%', border: '1px solid rgba(201,169,110,0.1)', pointerEvents: 'none' }} />

          <div style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto' }}>
            {/* Badge */}
            <div className="fade-up" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.3)', borderRadius: 999, padding: '7px 18px', fontSize: 12, color: '#a07840', marginBottom: 36, fontWeight: 500, letterSpacing: '0.04em' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#c9a96e', display: 'inline-block' }} />
              For JEE &amp; MHT-CET 2025 Aspirants
            </div>

            {/* Title */}
            <h1 className="fade-up d1" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(64px,12vw,120px)', fontWeight: 600, lineHeight: 0.95, letterSpacing: '-2px', marginBottom: 28, color: '#0d0d0d' }}>
              Marga
              <span style={{ fontStyle: 'italic', fontWeight: 300, color: '#c9a96e' }}>Darshak</span>
            </h1>

            {/* Subtitle */}
            <p className="fade-up d2" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(20px,3.5vw,28px)', color: '#6b6b6b', fontWeight: 300, fontStyle: 'italic', lineHeight: 1.5, marginBottom: 14 }}>
              Find the Right College with Real Guidance
            </p>
            <p className="fade-up d2" style={{ fontSize: 15, color: '#8a8a8a', maxWidth: 440, margin: '0 auto 44px', lineHeight: 1.7, fontWeight: 400 }}>
              Connect with real mentors from top colleges. Get honest, experience-based guidance for your JEE & MHT-CET journey.
            </p>

            {/* CTAs */}
            <div className="fade-up d3" style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 72 }}>
              <Link href="/mentors" style={{
                padding: '15px 36px', background: '#0d0d0d', color: '#faf8f5',
                borderRadius: 999, fontSize: 14, fontWeight: 500, textDecoration: 'none',
                boxShadow: '0 8px 32px rgba(13,13,13,0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
                letterSpacing: '0.02em', transition: 'all 0.3s',
              }}>
                Explore Mentors →
              </Link>
              <button onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })} style={{
                padding: '15px 36px', background: 'transparent', color: '#0d0d0d',
                border: '1px solid #e8e4de', borderRadius: 999, fontSize: 14, fontWeight: 500,
                cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '0.02em',
                transition: 'all 0.3s',
              }}>
                How it works
              </button>
            </div>

            {/* Stats */}
            <div className="fade-up d4" style={{ display: 'flex', justifyContent: 'center', gap: 0, flexWrap: 'wrap', borderTop: '1px solid #e8e4de', paddingTop: 40 }}>
              {[['50+', 'Mentors'], ['1,200+', 'Students Guided'], ['Top 10', 'Colleges Covered']].map(([n, l], i) => (
                <div key={l} style={{ textAlign: 'center', padding: '0 40px', borderRight: i < 2 ? '1px solid #e8e4de' : 'none' }}>
                  <p style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 40, fontWeight: 600, color: '#0d0d0d', lineHeight: 1 }}>{n}</p>
                  <p style={{ fontSize: 12, color: '#9a9a9a', marginTop: 6, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{l}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section id="how-it-works" style={{ padding: '100px 24px', background: '#fff', borderTop: '1px solid #e8e4de', borderBottom: '1px solid #e8e4de', position: 'relative', overflow: 'hidden' }}>
          {/* BG decoration */}
          <div style={{ position: 'absolute', top: -60, right: -60, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,169,110,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

          <div style={{ maxWidth: 960, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#c9a96e', marginBottom: 14 }}>
                <span className="deco-line" />Simple Process
              </p>
              <h2 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 'clamp(36px,5vw,56px)', fontWeight: 600, color: '#0d0d0d', lineHeight: 1.1 }}>
                How it <span style={{ fontStyle: 'italic', fontWeight: 300 }}>works</span>
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 2 }}>
              {STEPS.map((step, i) => (
                <div key={i} className="hover-card" style={{ background: i === 1 ? '#0d0d0d' : '#faf8f5', borderRadius: 24, padding: '40px 32px', border: '1px solid #e8e4de', position: 'relative', overflow: 'hidden' }}>
                  {/* Number watermark */}
                  <span style={{ position: 'absolute', top: 16, right: 24, fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 80, fontWeight: 700, color: i === 1 ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)', lineHeight: 1, userSelect: 'none' }}>{step.n}</span>
                  <span style={{ fontSize: 28, display: 'block', marginBottom: 20 }}>{step.icon}</span>
                  <h3 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontWeight: 600, fontSize: 22, marginBottom: 12, color: i === 1 ? '#fff' : '#0d0d0d' }}>{step.title}</h3>
                  <p style={{ fontSize: 14, color: i === 1 ? 'rgba(255,255,255,0.6)' : '#8a8a8a', lineHeight: 1.75 }}>{step.desc}</p>
                  {i === 1 && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, #c9a96e, transparent)' }} />}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHY US ── */}
        <section style={{ padding: '100px 24px', background: '#faf8f5' }}>
          <div style={{ maxWidth: 960, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#c9a96e', marginBottom: 14 }}>
                <span className="deco-line" />Why Us
              </p>
              <h2 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 'clamp(36px,5vw,56px)', fontWeight: 600, color: '#0d0d0d', lineHeight: 1.1 }}>
                Why students choose <span style={{ fontStyle: 'italic', fontWeight: 300 }}>MargaDarshak</span>
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 20 }}>
              {WHY.map((item, i) => (
                <div key={i} className="hover-card" style={{ padding: '36px 28px', borderRadius: 24, border: '1px solid #e8e4de', background: '#fff', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, rgba(201,169,110,0.4), transparent)' }} />
                  <span style={{ fontSize: 32, display: 'block', marginBottom: 20 }}>{item.icon}</span>
                  <h3 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontWeight: 600, fontSize: 20, marginBottom: 10, color: '#0d0d0d' }}>{item.title}</h3>
                  <p style={{ fontSize: 14, color: '#8a8a8a', lineHeight: 1.75 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURED MENTORS ── */}
        <section style={{ padding: '0 24px 100px', background: '#fff', borderTop: '1px solid #e8e4de' }}>
          <div style={{ maxWidth: 960, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '72px 0 44px', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#c9a96e', marginBottom: 14 }}>
                  <span className="deco-line" />Real People
                </p>
                <h2 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 'clamp(32px,5vw,52px)', fontWeight: 600, color: '#0d0d0d', lineHeight: 1.1 }}>
                  Featured <span style={{ fontStyle: 'italic', fontWeight: 300 }}>Mentors</span>
                </h2>
              </div>
              <Link href="/mentors" style={{ fontSize: 13, fontWeight: 500, color: '#6b6b6b', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, letterSpacing: '0.02em', borderBottom: '1px solid #e8e4de', paddingBottom: 2 }}>
                View all mentors →
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20 }}>
              {MENTORS.map((m, i) => (
                <div key={i} className="hover-card" style={{ background: '#faf8f5', borderRadius: 24, padding: '28px', border: '1px solid #e8e4de', display: 'flex', flexDirection: 'column', gap: 18 }}>
                  {/* Avatar + name */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 52, height: 52, borderRadius: 16, background: 'linear-gradient(135deg, #1a1a1a, #3a3a3a)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}>
                      <span style={{ color: '#c9a96e', fontSize: 22, fontFamily: "'Cormorant Garamond',Georgia,serif", fontWeight: 600 }}>{m.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: 15, color: '#0d0d0d', fontFamily: "'Outfit',sans-serif" }}>{m.name}</p>
                      <p style={{ fontSize: 13, color: '#8a8a8a', marginTop: 2 }}>{m.college}</p>
                    </div>
                  </div>
                  {/* Tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 500, padding: '4px 12px', borderRadius: 999, background: m.color, color: m.tc, letterSpacing: '0.02em' }}>{m.branch}</span>
                    <span style={{ fontSize: 11, fontWeight: 500, padding: '4px 12px', borderRadius: 999, background: 'rgba(201,169,110,0.12)', color: '#a07840', letterSpacing: '0.02em' }}>{m.percentile}%ile</span>
                    <span style={{ fontSize: 11, padding: '4px 12px', borderRadius: 999, background: '#f0ede8', color: '#8a8a8a' }}>{m.exam}</span>
                  </div>
                  <Link href="/mentors" style={{ display: 'block', textAlign: 'center', padding: '12px 0', background: '#0d0d0d', color: '#faf8f5', borderRadius: 14, fontSize: 13, fontWeight: 500, textDecoration: 'none', letterSpacing: '0.02em', transition: 'background 0.2s' }}>
                    Book Session
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA BANNER ── */}
        <section style={{ padding: '0 24px 100px', background: '#faf8f5' }}>
          <div style={{ maxWidth: 900, margin: '0 auto', background: '#0d0d0d', borderRadius: 32, padding: '80px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            {/* Decorative elements */}
            <div style={{ position: 'absolute', top: -80, left: -80, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,169,110,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: -60, right: -60, width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,169,110,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', inset: 0, opacity: 0.04, backgroundImage: 'radial-gradient(circle, rgba(201,169,110,0.8) 1px, transparent 1px)', backgroundSize: '24px 24px', pointerEvents: 'none' }} />

            <div style={{ position: 'relative' }}>
              <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#c9a96e', marginBottom: 16 }}>AI-Powered Guidance</p>
              <h2 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 'clamp(32px,5vw,56px)', fontWeight: 600, color: '#faf8f5', marginBottom: 16, lineHeight: 1.1 }}>
                Still <span style={{ fontStyle: 'italic', fontWeight: 300, color: '#c9a96e' }}>confused?</span>
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15, marginBottom: 40, maxWidth: 420, margin: '0 auto 40px', lineHeight: 1.7 }}>
                Let our AI help you shortlist the perfect colleges in under 60 seconds.
              </p>
              <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
                <button onClick={() => document.querySelector('[aria-label="Toggle AI Chat"]')?.click()} style={{ padding: '15px 36px', background: '#c9a96e', color: '#0d0d0d', borderRadius: 999, fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '0.02em', boxShadow: '0 8px 32px rgba(201,169,110,0.3)' }}>
                  Chat with AI Guide →
                </button>
                <Link href="/onboarding" style={{ padding: '15px 36px', background: 'transparent', color: 'rgba(255,255,255,0.7)', borderRadius: 999, fontSize: 14, fontWeight: 500, border: '1px solid rgba(255,255,255,0.15)', textDecoration: 'none', letterSpacing: '0.02em' }}>
                  Get Started Free
                </Link>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
      <AIChat />
    </main>
  )
}
