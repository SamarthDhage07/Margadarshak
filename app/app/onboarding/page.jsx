'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signInWithGoogle } from '@/lib/auth'
import { useAuth } from '@/lib/AuthContext'

export default function OnboardingPage() {
  const [selectedRole, setSelectedRole] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const { profile } = useAuth()

  if (profile) { router.push(profile.role === 'mentor' ? '/mentor-dashboard' : '/dashboard'); return null }

  const handleSignIn = async () => {
    if (!selectedRole) { setError('Please choose your role first'); return }
    setLoading(true); setError('')
    try {
      const { role } = await signInWithGoogle(selectedRole)
      router.push(role === 'mentor' ? '/mentor-dashboard' : '/dashboard')
    } catch (err) { console.error(err); setError('Sign-in failed. Please try again.'); setLoading(false) }
  }

  const roles = [
    { id: 'student', icon: '🎓', title: 'I am a Student', desc: 'Find mentors, book sessions & get college guidance' },
    { id: 'mentor', icon: '👨‍🏫', title: 'I am a Mentor', desc: 'Help students, share your experience & grow' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#faf8f5', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, position: 'relative', overflow: 'hidden' }}>
      {/* BG circles */}
      <div style={{ position: 'fixed', top: '10%', right: '5%', width: 400, height: 400, borderRadius: '50%', border: '1px solid rgba(201,169,110,0.1)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', top: '15%', right: '10%', width: 240, height: 240, borderRadius: '50%', border: '1px solid rgba(201,169,110,0.08)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '10%', left: '5%', width: 300, height: 300, borderRadius: '50%', border: '1px solid rgba(201,169,110,0.08)', pointerEvents: 'none' }} />
      {/* BG dots */}
      <div style={{ position: 'fixed', inset: 0, opacity: 0.3, backgroundImage: 'radial-gradient(circle, #d4cfc8 1px, transparent 1px)', backgroundSize: '32px 32px', pointerEvents: 'none' }} />

      <div className="fade-up" style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 480 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{ width: 36, height: 36, background: '#0d0d0d', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}>
              <span style={{ color: '#c9a96e', fontSize: 16, fontWeight: 700, fontFamily: "'Cormorant Garamond',Georgia,serif" }}>M</span>
            </div>
            <span style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontWeight: 600, fontSize: 24, color: '#0d0d0d' }}>MargaDarshak</span>
          </div>
          <p style={{ fontSize: 13, color: '#9a9a9a', letterSpacing: '0.03em' }}>Your college guidance platform</p>
        </div>

        {/* Card */}
        <div style={{ background: '#fff', borderRadius: 28, padding: '40px 36px', border: '1px solid #e8e4de', boxShadow: '0 8px 48px rgba(0,0,0,0.07), 0 0 0 1px rgba(201,169,110,0.05)' }}>
          {/* Gold top border */}
          <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: 1, background: 'linear-gradient(90deg, transparent, rgba(201,169,110,0.4), transparent)', borderRadius: 999 }} />

          <h1 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 28, fontWeight: 600, textAlign: 'center', marginBottom: 6, color: '#0d0d0d' }}>Choose your role</h1>
          <p style={{ fontSize: 13, color: '#9a9a9a', textAlign: 'center', marginBottom: 32, letterSpacing: '0.02em' }}>Tell us who you are to get started</p>

          {/* Role cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 28 }}>
            {roles.map(role => (
              <button key={role.id} onClick={() => { setSelectedRole(role.id); setError('') }} style={{
                padding: '22px 16px', borderRadius: 20, textAlign: 'center', cursor: 'pointer',
                border: `1.5px solid ${selectedRole === role.id ? '#c9a96e' : '#e8e4de'}`,
                background: selectedRole === role.id ? '#0d0d0d' : '#faf8f5',
                transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)', fontFamily: 'inherit',
                transform: selectedRole === role.id ? 'scale(1.02)' : 'none',
                boxShadow: selectedRole === role.id ? '0 8px 24px rgba(0,0,0,0.15)' : 'none',
              }}>
                <span style={{ fontSize: 34, display: 'block', marginBottom: 10 }}>{role.icon}</span>
                <p style={{ fontSize: 13, fontWeight: 600, color: selectedRole === role.id ? '#faf8f5' : '#0d0d0d', marginBottom: 6 }}>{role.title}</p>
                <p style={{ fontSize: 11, color: selectedRole === role.id ? 'rgba(255,255,255,0.5)' : '#9a9a9a', lineHeight: 1.5 }}>{role.desc}</p>
                {selectedRole === role.id && <div style={{ width: 20, height: 1, background: '#c9a96e', margin: '10px auto 0' }} />}
              </button>
            ))}
          </div>

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, padding: '10px 14px', marginBottom: 18, fontSize: 13, color: '#dc2626', textAlign: 'center' }}>{error}</div>
          )}

          {/* Google Sign In */}
          <button onClick={handleSignIn} disabled={loading || !selectedRole} style={{
            width: '100%', padding: '15px 0',
            background: selectedRole ? '#0d0d0d' : '#f0ede8',
            color: selectedRole ? '#faf8f5' : '#9a9a9a',
            border: selectedRole ? '1px solid rgba(201,169,110,0.2)' : '1px solid transparent',
            borderRadius: 16, fontSize: 14, fontWeight: 500,
            cursor: selectedRole ? 'pointer' : 'not-allowed',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            fontFamily: 'inherit', letterSpacing: '0.03em',
            transition: 'all 0.25s', opacity: loading ? 0.7 : 1,
            boxShadow: selectedRole ? '0 4px 20px rgba(0,0,0,0.1)' : 'none',
          }}>
            {loading ? (
              <><svg className="spinner" width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.2)" strokeWidth="3"/><path d="M12 2a10 10 0 0 1 10 10" stroke="#c9a96e" strokeWidth="3" strokeLinecap="round"/></svg> Signing in...</>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill={selectedRole ? "#4285F4" : "#9ca3af"}/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill={selectedRole ? "#34A853" : "#9ca3af"}/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill={selectedRole ? "#FBBC05" : "#9ca3af"}/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill={selectedRole ? "#EA4335" : "#9ca3af"}/></svg>
                Continue with Google
              </>
            )}
          </button>

          <p style={{ fontSize: 11, color: '#b0aba4', textAlign: 'center', marginTop: 16, lineHeight: 1.6 }}>
            By continuing, you agree to our terms of service
          </p>
        </div>

        <p style={{ textAlign: 'center', marginTop: 24 }}>
          <a href="/" style={{ fontSize: 13, color: '#9a9a9a', textDecoration: 'none', letterSpacing: '0.02em' }}>← Back to home</a>
        </p>
      </div>
    </div>
  )
}
