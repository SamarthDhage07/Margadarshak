'use client'
import { useState } from 'react'
import BookingForm from './BookingForm'
import { useAuth } from '@/lib/AuthContext'
import { useRouter } from 'next/navigation'

const BRANCH_COLORS = {
  'Computer Science': { bg: '#eff6ff', color: '#1d4ed8' },
  'Mechanical':       { bg: '#fff7ed', color: '#c2410c' },
  'Electronics':      { bg: '#faf5ff', color: '#7e22ce' },
  'Civil':            { bg: '#f0fdf4', color: '#15803d' },
  'IT':               { bg: '#ecfeff', color: '#0e7490' },
}

export default function MentorCard({ mentor }) {
  const { user, profile } = useAuth()
  const [hovered, setHovered] = useState(false)
  const [showBooking, setShowBooking] = useState(false)
  const router = useRouter()
  const bc = BRANCH_COLORS[mentor.branch] || { bg: '#f0ede8', color: '#6b4c2a' }

  const handleBook = () => {
    if (!user) { router.push('/onboarding'); return }
    if (profile?.role === 'mentor') { alert('Mentors cannot book sessions.'); return }
    setShowBooking(true)
  }

  return (
    <>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: '#fff', borderRadius: 24,
          border: `1px solid ${hovered ? 'rgba(201,169,110,0.3)' : '#e8e4de'}`,
          padding: '28px', display: 'flex', flexDirection: 'column', gap: 18,
          boxShadow: hovered ? '0 16px 48px rgba(0,0,0,0.08), 0 0 0 1px rgba(201,169,110,0.15)' : '0 1px 4px rgba(0,0,0,0.04)',
          transform: hovered ? 'translateY(-5px)' : 'none',
          transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
          position: 'relative', overflow: 'hidden',
        }}
      >
        {/* Top accent line on hover */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, #c9a96e, transparent)', opacity: hovered ? 1 : 0, transition: 'opacity 0.3s' }} />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 52, height: 52, borderRadius: 16, background: mentor.photo ? 'transparent' : 'linear-gradient(135deg, #1a1a1a, #2a2a2a)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden', boxShadow: '0 4px 14px rgba(0,0,0,0.12)' }}>
            {mentor.photo
              ? <img src={mentor.photo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
              : <span style={{ color: '#c9a96e', fontSize: 22, fontFamily: "'Cormorant Garamond',Georgia,serif", fontWeight: 600 }}>{mentor.name?.charAt(0)}</span>
            }
          </div>
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <p style={{ fontWeight: 600, fontSize: 15, color: '#0d0d0d' }}>{mentor.name}</p>
              {mentor.available === false && <span style={{ fontSize: 10, background: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: 999, fontWeight: 500 }}>Busy</span>}
            </div>
            <p style={{ fontSize: 13, color: '#8a8a8a', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{mentor.college}</p>
          </div>
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
          {mentor.branch && <span style={{ fontSize: 11, fontWeight: 500, padding: '4px 11px', borderRadius: 999, background: bc.bg, color: bc.color }}>{mentor.branch}</span>}
          {mentor.percentile && <span style={{ fontSize: 11, fontWeight: 500, padding: '4px 11px', borderRadius: 999, background: 'rgba(201,169,110,0.1)', color: '#a07840' }}>{mentor.percentile}%ile</span>}
          {mentor.exam && <span style={{ fontSize: 11, padding: '4px 11px', borderRadius: 999, background: '#f0ede8', color: '#8a8a8a' }}>{mentor.exam}</span>}
        </div>

        {/* Bio */}
        {mentor.bio && (
          <p style={{ fontSize: 13, color: '#8a8a8a', lineHeight: 1.75, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{mentor.bio}</p>
        )}

        <button onClick={handleBook} disabled={mentor.available === false} style={{
          width: '100%', padding: '12px 0',
          background: mentor.available === false ? '#f0ede8' : '#0d0d0d',
          color: mentor.available === false ? '#9a9a9a' : '#faf8f5',
          border: 'none', borderRadius: 14, fontSize: 13, fontWeight: 500,
          cursor: mentor.available === false ? 'not-allowed' : 'pointer',
          fontFamily: 'inherit', letterSpacing: '0.03em', transition: 'all 0.2s',
        }}>
          {mentor.available === false ? 'Not Available' : 'Book Session'}
        </button>
      </div>

      {showBooking && <BookingForm mentor={mentor} onClose={() => setShowBooking(false)} />}
    </>
  )
}
