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
  const bc = BRANCH_COLORS[mentor.branch] || { bg: '#f3f4f6', color: '#374151' }

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
          background: '#fff', borderRadius: 20,
          border: `1px solid ${hovered ? '#d1d5db' : '#f3f4f6'}`,
          padding: 24, display: 'flex', flexDirection: 'column', gap: 16,
          boxShadow: hovered ? '0 8px 32px rgba(0,0,0,0.08)' : '0 1px 4px rgba(0,0,0,0.04)',
          transform: hovered ? 'translateY(-4px)' : 'none',
          transition: 'all 0.3s ease',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: mentor.photo ? 'transparent' : 'linear-gradient(135deg,#374151,#111827)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
            {mentor.photo
              ? <img src={mentor.photo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
              : <span style={{ color: '#fff', fontSize: 20, fontFamily: "'Playfair Display',Georgia,serif", fontWeight: 600 }}>{mentor.name?.charAt(0)}</span>
            }
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <p style={{ fontWeight: 600, fontSize: 15, color: '#0a0a0a' }}>{mentor.name}</p>
              {mentor.available === false && <span style={{ fontSize: 10, background: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: 999, fontWeight: 500 }}>Busy</span>}
            </div>
            <p style={{ fontSize: 13, color: '#6b7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{mentor.college}</p>
          </div>
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {mentor.branch && <span style={{ fontSize: 12, fontWeight: 500, padding: '4px 10px', borderRadius: 999, background: bc.bg, color: bc.color }}>{mentor.branch}</span>}
          {mentor.percentile && <span style={{ fontSize: 12, fontWeight: 500, padding: '4px 10px', borderRadius: 999, background: '#f3f4f6', color: '#374151' }}>{mentor.percentile}%ile</span>}
          {mentor.exam && <span style={{ fontSize: 12, fontWeight: 500, padding: '4px 10px', borderRadius: 999, background: '#f9fafb', color: '#6b7280' }}>{mentor.exam}</span>}
        </div>

        {/* Bio */}
        {mentor.bio && (
          <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.7, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{mentor.bio}</p>
        )}

        <button onClick={handleBook} disabled={mentor.available === false} style={{ width: '100%', padding: '11px 0', background: mentor.available === false ? '#f3f4f6' : '#0a0a0a', color: mentor.available === false ? '#9ca3af' : '#fff', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 500, cursor: mentor.available === false ? 'not-allowed' : 'pointer', transition: 'background 0.2s', fontFamily: 'inherit' }}>
          {mentor.available === false ? 'Not Available' : 'Book Session'}
        </button>
      </div>

      {showBooking && <BookingForm mentor={mentor} onClose={() => setShowBooking(false)} />}
    </>
  )
}
