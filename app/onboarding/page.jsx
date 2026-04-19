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

  // If already logged in, redirect
  if (profile) {
    router.push(profile.role === 'mentor' ? '/mentor-dashboard' : '/dashboard')
    return null
  }

  const handleSignIn = async () => {
    if (!selectedRole) { setError('Please choose your role first'); return }
    setLoading(true)
    setError('')
    try {
      const { role } = await signInWithGoogle(selectedRole)
      router.push(role === 'mentor' ? '/mentor-dashboard' : '/dashboard')
    } catch (err) {
      console.error(err)
      setError('Sign-in failed. Please try again.')
      setLoading(false)
    }
  }

  const roles = [
    { id: 'student', icon: '🎓', title: 'I am a Student', desc: 'Find mentors, book sessions & get college guidance' },
    { id: 'mentor', icon: '👨‍🏫', title: 'I am a Mentor', desc: 'Help students, share your experience & grow' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      {/* Background dots */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, opacity: 0.4, backgroundImage: 'radial-gradient(circle, #d1d5db 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      <div className="fade-up" style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 480 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{ width: 36, height: 36, background: '#0a0a0a', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#fff', fontSize: 16, fontWeight: 700 }}>M</span>
            </div>
            <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: 22, color: '#0a0a0a' }}>MargaDarshak</span>
          </div>
          <p style={{ fontSize: 14, color: '#6b7280' }}>Your college guidance platform</p>
        </div>

        {/* Card */}
        <div style={{ background: '#fff', borderRadius: 28, padding: '36px 32px', border: '1px solid #f3f4f6', boxShadow: '0 8px 40px rgba(0,0,0,0.08)' }}>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 26, fontWeight: 700, textAlign: 'center', marginBottom: 6 }}>
            Choose your role
          </h1>
          <p style={{ fontSize: 14, color: '#6b7280', textAlign: 'center', marginBottom: 28 }}>
            Tell us who you are to get started
          </p>

          {/* Role cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 24 }}>
            {roles.map(role => (
              <button
                key={role.id}
                onClick={() => { setSelectedRole(role.id); setError('') }}
                style={{
                  padding: '20px 16px', borderRadius: 18, textAlign: 'center', cursor: 'pointer',
                  border: `2px solid ${selectedRole === role.id ? '#0a0a0a' : '#f3f4f6'}`,
                  background: selectedRole === role.id ? '#0a0a0a' : '#fafafa',
                  transition: 'all 0.2s', fontFamily: 'inherit',
                  transform: selectedRole === role.id ? 'scale(1.02)' : 'none',
                }}
              >
                <span style={{ fontSize: 32, display: 'block', marginBottom: 10 }}>{role.icon}</span>
                <p style={{ fontSize: 14, fontWeight: 600, color: selectedRole === role.id ? '#fff' : '#0a0a0a', marginBottom: 6 }}>{role.title}</p>
                <p style={{ fontSize: 12, color: selectedRole === role.id ? 'rgba(255,255,255,0.7)' : '#9ca3af', lineHeight: 1.5 }}>{role.desc}</p>
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#dc2626', textAlign: 'center' }}>
              {error}
            </div>
          )}

          {/* Google Sign In */}
          <button
            onClick={handleSignIn}
            disabled={loading || !selectedRole}
            style={{
              width: '100%', padding: '14px 0',
              background: selectedRole ? '#0a0a0a' : '#f3f4f6',
              color: selectedRole ? '#fff' : '#9ca3af',
              border: 'none', borderRadius: 14, fontSize: 14, fontWeight: 600,
              cursor: selectedRole ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              transition: 'all 0.2s', fontFamily: 'inherit',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? (
              <><svg className="spinner" width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity="0.3"/><path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round"/></svg> Signing in...</>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill={selectedRole ? "#4285F4" : "#9ca3af"}/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill={selectedRole ? "#34A853" : "#9ca3af"}/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill={selectedRole ? "#FBBC05" : "#9ca3af"}/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill={selectedRole ? "#EA4335" : "#9ca3af"}/></svg>
                Continue with Google
              </>
            )}
          </button>

          <p style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center', marginTop: 16 }}>
            By continuing, you agree to our terms of service
          </p>
        </div>

        {/* Back to home */}
        <p style={{ textAlign: 'center', marginTop: 20 }}>
          <a href="/" style={{ fontSize: 13, color: '#6b7280', textDecoration: 'none' }}>← Back to home</a>
        </p>
      </div>
    </div>
  )
}
