'use client'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AIChat from '@/components/AIChat'
import { useEffect, useRef, useState } from 'react'

// Cursor-reactive animated background
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
      anim.x += (mouse.x - anim.x) * 0.06
      anim.y += (mouse.y - anim.y) * 0.06
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const g = ctx.createRadialGradient(anim.x, anim.y, 0, anim.x, anim.y, 350)
      g.addColorStop(0, 'rgba(0,0,0,0.035)')
      g.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      const sp = 40, r = 260
      for (let x = sp; x < canvas.width; x += sp) {
        for (let y = sp; y < canvas.height; y += sp) {
          const d = Math.hypot(x - anim.x, y - anim.y)
          ctx.globalAlpha = d < r ? 0.07 + (1 - d / r) * 0.13 : 0.04
          ctx.fillStyle = '#0a0a0a'
          ctx.beginPath(); ctx.arc(x, y, 1, 0, Math.PI * 2); ctx.fill()
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
  { n: '01', title: 'Explore Mentors', desc: "Browse real students from COEP, VJTI, IITs who've been exactly where you are." },
  { n: '02', title: 'Book a Session', desc: 'Schedule a free 1:1 guidance call at your preferred date and time.' },
  { n: '03', title: 'Get Clarity', desc: 'Walk away with a clear college list, branch strategy, and a concrete next step.' },
]
const WHY = [
  { icon: '🎯', title: 'Real Mentors', desc: 'Not coaches. Actual students from top colleges who went through the same process.' },
  { icon: '🤖', title: 'AI-Powered', desc: 'Instant college suggestions based on your percentile — available 24/7.' },
  { icon: '⚡', title: 'Completely Free', desc: 'No paywalls, no subscriptions. Just honest guidance from real people.' },
]
const SAMPLE_MENTORS = [
  { name: 'Aryan Kulkarni', college: 'COEP Pune', branch: 'CS', percentile: '99.4', exam: 'MHT-CET' },
  { name: 'Sneha Patil', college: 'VJTI Mumbai', branch: 'Electronics', percentile: '98.7', exam: 'MHT-CET' },
  { name: 'Rahul Sharma', college: 'IIT Bombay', branch: 'CS', percentile: '99.9', exam: 'JEE' },
]
const BRANCH_COLORS = { 'CS': { bg: '#eff6ff', color: '#1d4ed8' }, 'Electronics': { bg: '#faf5ff', color: '#7e22ce' } }

export default function Home() {
  return (
    <main style={{ minHeight: '100vh', background: '#fafafa', position: 'relative' }}>
      <CursorBg />
      <div style={{ position: 'relative', zIndex: 10 }}>
        <Navbar />

        {/* ── HERO ── */}
        <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 24px 40px' }}>
          <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto' }}>

            {/* Badge */}
            <div className="fade-up" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 999, padding: '6px 16px', fontSize: 12, color: '#6b7280', marginBottom: 32, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
              For JEE &amp; MHT-CET 2025 aspirants
            </div>

            {/* Title */}
            <h1 className="fade-up d1" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(60px,11vw,108px)', fontWeight: 700, lineHeight: 1.0, letterSpacing: '-3px', marginBottom: 24, color: '#0a0a0a' }}>
              Marga<span style={{ fontStyle: 'italic', fontWeight: 400, color: '#9ca3af' }}>Darshak</span>
            </h1>

            {/* Subtitle */}
            <p className="fade-up d2" style={{ fontSize: 'clamp(18px,3vw,24px)', color: '#6b7280', fontWeight: 300, lineHeight: 1.6, marginBottom: 40, maxWidth: 500, margin: '0 auto 40px' }}>
              Find the Right College with{' '}
              <span style={{ color: '#0a0a0a', fontWeight: 600 }}>Real Guidance</span>
            </p>

            {/* CTAs */}
            <div className="fade-up d3" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 64 }}>
              <Link href="/mentors" style={{ padding: '14px 32px', background: '#0a0a0a', color: '#fff', borderRadius: 999, fontSize: 14, fontWeight: 500, textDecoration: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
                Explore Mentors →
              </Link>
              <button onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })} style={{ padding: '14px 32px', background: 'transparent', color: '#374151', border: '1px solid #e5e7eb', borderRadius: 999, fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
                How it works
              </button>
            </div>

            {/* Stats */}
            <div className="fade-up d4" style={{ display: 'flex', justifyContent: 'center', gap: 48, flexWrap: 'wrap' }}>
              {[['50+', 'Mentors'], ['1200+', 'Students Guided'], ['Top 10', 'Colleges Covered']].map(([n, l]) => (
                <div key={l} style={{ textAlign: 'center' }}>
                  <p style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 34, fontWeight: 700, color: '#0a0a0a' }}>{n}</p>
                  <p style={{ fontSize: 13, color: '#9ca3af', marginTop: 4 }}>{l}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section id="how-it-works" style={{ padding: '80px 24px', background: '#fff', borderTop: '1px solid #f3f4f6', borderBottom: '1px solid #f3f4f6' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#9ca3af', marginBottom: 12 }}>Simple Process</p>
              <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 'clamp(30px,5vw,48px)', fontWeight: 700 }}>How it works</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 20 }}>
              {STEPS.map((step, i) => (
                <div key={i} style={{ background: '#fafafa', borderRadius: 20, padding: 28, border: '1px solid #f3f4f6' }}>
                  <span style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 52, fontWeight: 700, color: '#e5e7eb', display: 'block', marginBottom: 16 }}>{step.n}</span>
                  <h3 style={{ fontWeight: 600, fontSize: 17, marginBottom: 8 }}>{step.title}</h3>
                  <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.7 }}>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHY US ── */}
        <section style={{ padding: '80px 24px' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#9ca3af', marginBottom: 12 }}>Why Us</p>
              <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 'clamp(30px,5vw,48px)', fontWeight: 700 }}>Why students choose<br />MargaDarshak</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 20 }}>
              {WHY.map((item, i) => (
                <div key={i} style={{ padding: 24, borderRadius: 20, border: '1px solid #f3f4f6', background: '#fff' }}>
                  <span style={{ fontSize: 32, display: 'block', marginBottom: 16 }}>{item.icon}</span>
                  <h3 style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>{item.title}</h3>
                  <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.7 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURED MENTORS ── */}
        <section style={{ padding: '0 24px 80px', background: '#fff', borderTop: '1px solid #f3f4f6' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '56px 0 36px', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#9ca3af', marginBottom: 12 }}>Real People</p>
                <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 'clamp(30px,5vw,44px)', fontWeight: 700 }}>Featured Mentors</h2>
              </div>
              <Link href="/mentors" style={{ fontSize: 14, fontWeight: 500, color: '#6b7280', textDecoration: 'none' }}>View all →</Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 20 }}>
              {SAMPLE_MENTORS.map((m, i) => {
                const bc = BRANCH_COLORS[m.branch] || { bg: '#f3f4f6', color: '#374151' }
                return (
                  <div key={i} style={{ background: '#fafafa', borderRadius: 20, padding: 24, border: '1px solid #f3f4f6', display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,#374151,#111827)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ color: '#fff', fontSize: 18, fontFamily: "'Playfair Display',Georgia,serif", fontWeight: 600 }}>{m.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: 14 }}>{m.name}</p>
                        <p style={{ fontSize: 12, color: '#6b7280' }}>{m.college}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      <span style={{ fontSize: 11, fontWeight: 500, padding: '3px 9px', borderRadius: 999, background: bc.bg, color: bc.color }}>{m.branch}</span>
                      <span style={{ fontSize: 11, fontWeight: 500, padding: '3px 9px', borderRadius: 999, background: '#f3f4f6', color: '#374151' }}>{m.percentile}%ile</span>
                      <span style={{ fontSize: 11, padding: '3px 9px', borderRadius: 999, background: '#f9fafb', color: '#6b7280' }}>{m.exam}</span>
                    </div>
                    <Link href="/mentors" style={{ display: 'block', textAlign: 'center', padding: '10px 0', background: '#0a0a0a', color: '#fff', borderRadius: 12, fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>Book Session</Link>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── CTA BANNER ── */}
        <section style={{ padding: '0 24px 80px' }}>
          <div style={{ maxWidth: 860, margin: '0 auto', background: '#0a0a0a', borderRadius: 28, padding: '64px 32px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            {/* Decorative dots */}
            <div style={{ position: 'absolute', inset: 0, opacity: 0.08, backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
            <div style={{ position: 'relative' }}>
              <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 'clamp(28px,5vw,46px)', fontWeight: 700, color: '#fff', marginBottom: 14 }}>Still confused?</h2>
              <p style={{ color: '#9ca3af', fontSize: 16, marginBottom: 32, maxWidth: 400, margin: '0 auto 32px' }}>Let our AI help you shortlist colleges in under 60 seconds.</p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <button onClick={() => document.querySelector('[aria-label="Toggle AI Chat"]')?.click()} style={{ padding: '14px 32px', background: '#fff', color: '#0a0a0a', borderRadius: 999, fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                  Chat with AI Guide →
                </button>
                <Link href="/onboarding" style={{ padding: '14px 32px', background: 'transparent', color: '#fff', borderRadius: 999, fontSize: 14, fontWeight: 500, border: '1px solid rgba(255,255,255,0.25)', textDecoration: 'none' }}>
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
