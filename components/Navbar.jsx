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
    const handleClick = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false) }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleSignOut = async () => {
    setDropOpen(false)
    await logout()
    router.push('/')
  }

  const dashLink = profile?.role === 'mentor' ? '/mentor-dashboard' : '/dashboard'

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      background: scrolled ? 'rgba(255,255,255,0.9)' : 'transparent',
      backdropFilter: scrolled ? 'blur(14px)' : 'none',
      borderBottom: scrolled ? '1px solid #f3f4f6' : '1px solid transparent',
      boxShadow: scrolled ? '0 1px 16px rgba(0,0,0,0.06)' : 'none',
      transition: 'all 0.4s',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <div style={{ width: 28, height: 28, background: '#0a0a0a', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>M</span>
          </div>
          <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 600, fontSize: 18, color: '#0a0a0a' }}>MargaDarshak</span>
        </Link>

        {/* Desktop nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }} className="hidden md:flex">
          <Link href="/" style={{ fontSize: 14, fontWeight: 500, color: '#6b7280', textDecoration: 'none' }}>Home</Link>
          <Link href="/mentors" style={{ fontSize: 14, fontWeight: 500, color: '#6b7280', textDecoration: 'none' }}>Mentors</Link>

          {!user ? (
            <Link href="/onboarding" style={{ padding: '8px 20px', background: '#0a0a0a', color: '#fff', borderRadius: 999, fontSize: 14, fontWeight: 500, textDecoration: 'none' }}>
              Get Started
            </Link>
          ) : (
            <div style={{ position: 'relative' }} ref={dropRef}>
              <button onClick={() => setDropOpen(!dropOpen)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: '1px solid #e5e7eb', borderRadius: 999, padding: '4px 12px 4px 4px', cursor: 'pointer' }}>
                {user.photoURL
                  ? <img src={user.photoURL} style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} alt="" />
                  : <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ color: '#fff', fontSize: 12 }}>{user.displayName?.charAt(0)}</span></div>
                }
                <span style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>{user.displayName?.split(' ')[0]}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              {dropOpen && (
                <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', background: '#fff', border: '1px solid #f3f4f6', borderRadius: 14, boxShadow: '0 8px 32px rgba(0,0,0,0.1)', minWidth: 160, overflow: 'hidden', zIndex: 100 }}>
                  <Link href={dashLink} style={{ display: 'block', padding: '12px 16px', fontSize: 14, color: '#0a0a0a', textDecoration: 'none' }} onClick={() => setDropOpen(false)}>Dashboard</Link>
                  <div style={{ height: 1, background: '#f3f4f6' }} />
                  <button onClick={handleSignOut} style={{ width: '100%', textAlign: 'left', padding: '12px 16px', fontSize: 14, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Sign Out</button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <span style={{ display: 'block', width: 20, height: 2, background: '#0a0a0a', borderRadius: 2, transition: 'all 0.3s', transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
            <span style={{ display: 'block', width: 20, height: 2, background: '#0a0a0a', borderRadius: 2, opacity: menuOpen ? 0 : 1, transition: 'opacity 0.3s' }} />
            <span style={{ display: 'block', width: 20, height: 2, background: '#0a0a0a', borderRadius: 2, transition: 'all 0.3s', transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      <div style={{ maxHeight: menuOpen ? 260 : 0, overflow: 'hidden', transition: 'max-height 0.3s ease', background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(12px)', borderTop: menuOpen ? '1px solid #f3f4f6' : 'none' }}>
        <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Link href="/" style={{ fontSize: 14, color: '#374151', textDecoration: 'none' }} onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="/mentors" style={{ fontSize: 14, color: '#374151', textDecoration: 'none' }} onClick={() => setMenuOpen(false)}>Mentors</Link>
          {!user
            ? <Link href="/onboarding" style={{ fontSize: 14, fontWeight: 500, background: '#0a0a0a', color: '#fff', padding: '10px 20px', borderRadius: 999, textDecoration: 'none', textAlign: 'center' }} onClick={() => setMenuOpen(false)}>Get Started</Link>
            : <>
                <Link href={dashLink} style={{ fontSize: 14, color: '#374151', textDecoration: 'none' }} onClick={() => setMenuOpen(false)}>Dashboard</Link>
                <button onClick={() => { handleSignOut(); setMenuOpen(false) }} style={{ textAlign: 'left', fontSize: 14, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Sign Out</button>
              </>
          }
        </div>
      </div>
    </nav>
  )
}
