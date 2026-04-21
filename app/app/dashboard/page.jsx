'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/AuthContext'
import { getStudentBookings, getMentors } from '@/lib/firestore'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AIChat from '@/components/AIChat'

function StatCard({ icon, label, value, color }) {
  return (
    <div style={{ background: '#fff', borderRadius: 20, padding: '24px', border: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ width: 48, height: 48, borderRadius: 14, background: color || '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <span style={{ fontSize: 22 }}>{icon}</span>
      </div>
      <div>
        <p style={{ fontSize: 26, fontWeight: 700, color: '#0a0a0a', fontFamily: "'Playfair Display',Georgia,serif" }}>{value}</p>
        <p style={{ fontSize: 13, color: '#6b7280', marginTop: 2 }}>{label}</p>
      </div>
    </div>
  )
}

const STATUS_STYLE = {
  pending:   { bg: '#fef3c7', color: '#92400e', label: 'Pending' },
  confirmed: { bg: '#d1fae5', color: '#065f46', label: 'Confirmed' },
  cancelled: { bg: '#fee2e2', color: '#991b1b', label: 'Cancelled' },
}

export default function StudentDashboard() {
  const { user, profile } = useAuth()
  const router = useRouter()
  const [bookings, setBookings] = useState([])
  const [mentorCount, setMentorCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user === null) { router.push('/onboarding'); return }
    if (user === undefined) return
    if (profile?.role === 'mentor') { router.push('/mentor-dashboard'); return }

    async function load() {
      try {
        const [b, m] = await Promise.all([
          getStudentBookings(user.email),
          getMentors(),
        ])
        setBookings(b)
        setMentorCount(m.length)
      } catch (e) { console.error(e) }
      setLoading(false)
    }
    load()
  }, [user, profile])

  if (user === undefined || loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa' }}>
        <div style={{ textAlign: 'center' }}>
          <svg className="spinner" width="32" height="32" viewBox="0 0 24 24" fill="none" style={{ margin: '0 auto 12px' }}><circle cx="12" cy="12" r="10" stroke="#e5e7eb" strokeWidth="3"/><path d="M12 2a10 10 0 0 1 10 10" stroke="#0a0a0a" strokeWidth="3" strokeLinecap="round"/></svg>
          <p style={{ fontSize: 14, color: '#6b7280' }}>Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <main style={{ minHeight: '100vh', background: '#fafafa' }}>
      <Navbar />

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '100px 24px 80px' }}>
        {/* Welcome */}
        <div className="fade-up" style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
            {user?.photoURL
              ? <img src={user.photoURL} style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', border: '2px solid #f3f4f6' }} alt="" />
              : <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ color: '#fff', fontSize: 22, fontFamily: "'Playfair Display',Georgia,serif" }}>{user?.displayName?.charAt(0)}</span></div>
            }
            <div>
              <h1 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 'clamp(24px,4vw,32px)', fontWeight: 700 }}>
                Welcome back, {user?.displayName?.split(' ')[0]} 👋
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                <span style={{ fontSize: 12, background: '#d1fae5', color: '#065f46', padding: '2px 10px', borderRadius: 999, fontWeight: 500 }}>✓ Verified</span>
                <span style={{ fontSize: 13, color: '#6b7280' }}>{user?.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="fade-up d1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 40 }}>
          <StatCard icon="👨‍🏫" label="Mentors Available" value={mentorCount} color="#eff6ff" />
          <StatCard icon="📅" label="Sessions Booked" value={bookings.length} color="#f0fdf4" />
          <StatCard icon="🤖" label="AI Guidance" value="24/7" color="#faf5ff" />
        </div>

        {/* Quick Actions */}
        <div className="fade-up d2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 48 }}>
          <Link href="/mentors" style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '18px 22px',
            background: '#0a0a0a', color: '#fff', borderRadius: 18, textDecoration: 'none',
            transition: 'background 0.2s',
          }}>
            <span style={{ fontSize: 22 }}>🔍</span>
            <div>
              <p style={{ fontWeight: 600, fontSize: 14 }}>Browse Mentors</p>
              <p style={{ fontSize: 12, opacity: 0.6, marginTop: 2 }}>Find your perfect match</p>
            </div>
          </Link>
          <button onClick={() => document.querySelector('[aria-label="Toggle AI Chat"]')?.click()} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '18px 22px',
            background: '#fff', border: '1px solid #f3f4f6', borderRadius: 18, cursor: 'pointer',
            transition: 'border-color 0.2s', fontFamily: 'inherit', textAlign: 'left',
          }}>
            <span style={{ fontSize: 22 }}>🤖</span>
            <div>
              <p style={{ fontWeight: 600, fontSize: 14, color: '#0a0a0a' }}>Ask AI Guide</p>
              <p style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>Instant college advice</p>
            </div>
          </button>
        </div>

        {/* My Bookings */}
        <div className="fade-up d3">
          <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 24, fontWeight: 700, marginBottom: 20 }}>My Bookings</h2>
          {bookings.length === 0 ? (
            <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #f3f4f6', padding: '48px 24px', textAlign: 'center' }}>
              <p style={{ fontSize: 40, marginBottom: 12 }}>📭</p>
              <p style={{ fontWeight: 500, color: '#374151', marginBottom: 6 }}>No sessions yet</p>
              <p style={{ fontSize: 14, color: '#9ca3af', marginBottom: 20 }}>Browse mentors and book your first guidance session</p>
              <Link href="/mentors" style={{ display: 'inline-block', padding: '10px 24px', background: '#0a0a0a', color: '#fff', borderRadius: 999, fontSize: 14, fontWeight: 500, textDecoration: 'none' }}>
                Find a Mentor →
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {bookings.map(b => {
                const st = STATUS_STYLE[b.status] || STATUS_STYLE.pending
                return (
                  <div key={b.id} style={{ background: '#fff', borderRadius: 16, border: '1px solid #f3f4f6', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                    <div>
                      <p style={{ fontWeight: 600, color: '#0a0a0a', marginBottom: 4 }}>Session with {b.mentorName}</p>
                      <p style={{ fontSize: 13, color: '#6b7280' }}>📅 {b.date} &nbsp;⏰ {b.time}</p>
                      {b.message && <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>{b.message}</p>}
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 500, padding: '5px 12px', borderRadius: 999, background: st.bg, color: st.color }}>{st.label}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <Footer />
      <AIChat />
    </main>
  )
}
