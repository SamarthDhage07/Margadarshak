'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/AuthContext'
import { logout } from '@/lib/auth'

export default function Navbar() {
  const { user, profile } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)
  const router = useRouter()
  const dropRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const h = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const handleSignOut = async () => { setDropOpen(false); await logout(); router.push('/') }
  const dashLink = profile?.role === 'mentor' ? '/mentor-dashboard' : '/dashboard'

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      background: scrolled ? 'rgba(250,248,245,0.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(16px)' : 'none',
      borderBottom: scrolled ? '1px solid #e8e4de' : '1px solid transparent',
      transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 28px', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 32, height: 32, background: '#0d0d0d', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
            <span style={{ color: '#c9a96e', fontSize: 14, fontWeight: 700, fontFamily: "'Cormorant Garamond',Georgia,serif" }}>M</span>
          </div>
          <span style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontWeight: 600, fontSize: 20, color: '#0d0d0d', letterSpacing: '-0.3px' }}>MargaDarshak</span>
        </Link>

        {/* Desktop */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="hidden md:flex">
          {[['/', 'Home'], ['/mentors', 'Mentors']].map(([href, label]) => (
            <Link key={href} href={href} style={{ fontSize: 14, fontWeight: 500, color: '#6b6b6b', textDecoration: 'none', letterSpacing: '0.02em', transition: 'color 0.2s' }}>{label}</Link>
          ))}
          {!user ? (
            <Link href="/onboarding" style={{ padding: '9px 22px', background: '#0d0d0d', color: '#faf8f5', borderRadius: 999, fontSize: 13, fontWeight: 500, textDecoration: 'none', letterSpacing: '0.03em', boxShadow: '0 2px 12px rgba(0,0,0,0.15)', transition: 'all 0.2s' }}>
              Get Started
            </Link>
          ) : (
            <div style={{ position: 'relative' }} ref={dropRef}>
              <button onClick={() => setDropOpen(!dropOpen)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: '1px solid #e8e4de', borderRadius: 999, padding: '5px 14px 5px 5px', cursor: 'pointer', transition: 'border-color 0.2s' }}>
                {user.photoURL
                  ? <img src={user.photoURL} style={{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover' }} alt="" />
                  : <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#0d0d0d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ color: '#c9a96e', fontSize: 13, fontFamily: "'Cormorant Garamond',Georgia,serif", fontWeight: 600 }}>{user.displayName?.charAt(0)}</span></div>
                }
                <span style={{ fontSize: 13, fontWeight: 500, color: '#3a3a3a' }}>{user.displayName?.split(' ')[0]}</span>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#9a9a9a" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              {dropOpen && (
                <div className="scale-in" style={{ position: 'absolute', right: 0, top: 'calc(100% + 10px)', background: '#fff', border: '1px solid #e8e4de', borderRadius: 16, boxShadow: '0 12px 40px rgba(0,0,0,0.1)', minWidth: 170, overflow: 'hidden' }}>
                  <Link href={dashLink} style={{ display: 'block', padding: '12px 18px', fontSize: 13, color: '#0d0d0d', textDecoration: 'none', fontWeight: 500 }} onClick={() => setDropOpen(false)}>Dashboard</Link>
                  <div style={{ height: 1, background: '#f0ede8' }} />
                  <button onClick={handleSignOut} style={{ width: '100%', textAlign: 'left', padding: '12px 18px', fontSize: 13, color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Sign Out</button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, display: 'flex', flexDirection: 'column', gap: 5 }}>
          <span style={{ display: 'block', width: 20, height: 1.5, background: '#0d0d0d', borderRadius: 2, transition: 'all 0.3s', transform: menuOpen ? 'rotate(45deg) translate(4px, 4px)' : 'none' }} />
          <span style={{ display: 'block', width: 20, height: 1.5, background: '#0d0d0d', borderRadius: 2, opacity: menuOpen ? 0 : 1, transition: 'opacity 0.3s' }} />
          <span style={{ display: 'block', width: 20, height: 1.5, background: '#0d0d0d', borderRadius: 2, transition: 'all 0.3s', transform: menuOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none' }} />
        </button>
      </div>

      {/* Mobile menu */}
      <div style={{ maxHeight: menuOpen ? 260 : 0, overflow: 'hidden', transition: 'max-height 0.35s ease', background: 'rgba(250,248,245,0.97)', backdropFilter: 'blur(16px)', borderTop: menuOpen ? '1px solid #e8e4de' : 'none' }}>
        <div style={{ padding: '18px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Link href="/" style={{ fontSize: 14, color: '#3a3a3a', textDecoration: 'none', fontWeight: 500 }} onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="/mentors" style={{ fontSize: 14, color: '#3a3a3a', textDecoration: 'none', fontWeight: 500 }} onClick={() => setMenuOpen(false)}>Mentors</Link>
          {!user
            ? <Link href="/onboarding" style={{ fontSize: 13, fontWeight: 500, background: '#0d0d0d', color: '#faf8f5', padding: '11px 20px', borderRadius: 999, textDecoration: 'none', textAlign: 'center', letterSpacing: '0.03em' }} onClick={() => setMenuOpen(false)}>Get Started</Link>
            : <>
                <Link href={dashLink} style={{ fontSize: 14, color: '#3a3a3a', textDecoration: 'none' }} onClick={() => setMenuOpen(false)}>Dashboard</Link>
                <button onClick={() => { handleSignOut(); setMenuOpen(false) }} style={{ textAlign: 'left', fontSize: 14, color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Sign Out</button>
              </>
          }
        </div>
      </div>
    </nav>
  )
}
