'use client'
import { useState, useEffect } from 'react'
import { saveMentorAvailability, getMentorAvailability, ALL_TIMES } from '@/lib/slots'

const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
const DAY_FULL = { Mon:'Monday',Tue:'Tuesday',Wed:'Wednesday',Thu:'Thursday',Fri:'Friday',Sat:'Saturday',Sun:'Sunday' }

export default function SlotManager({ mentorId }) {
  const [availability, setAvailability] = useState({ Mon:[],Tue:[],Wed:[],Thu:[],Fri:[],Sat:[],Sun:[] })
  const [saving, setSaving]     = useState(false)
  const [saved, setSaved]       = useState(false)
  const [loading, setLoading]   = useState(true)
  const [activeDay, setActiveDay] = useState('Mon')

  useEffect(() => {
    if (!mentorId) return
    getMentorAvailability(mentorId).then(data => {
      if (data && Object.keys(data).length > 0) setAvailability(prev => ({ ...prev, ...data }))
      setLoading(false)
    })
  }, [mentorId])

  const toggleSlot = (day, time) => {
    setAvailability(prev => {
      const cur = prev[day] || []
      return { ...prev, [day]: cur.includes(time) ? cur.filter(t => t !== time) : [...cur, time].sort() }
    })
    setSaved(false)
  }

  const toggleAll = (day) => {
    const all = ALL_TIMES.every(t => (availability[day]||[]).includes(t))
    setAvailability(prev => ({ ...prev, [day]: all ? [] : [...ALL_TIMES] }))
    setSaved(false)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await saveMentorAvailability(mentorId, availability)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch(e) { console.error(e) }
    setSaving(false)
  }

  const totalSlots = Object.values(availability).reduce((a, b) => a + b.length, 0)

  if (loading) return (
    <div style={{ padding: '30px', textAlign: 'center' }}>
      <svg className="spinner" width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ margin: '0 auto', display: 'block' }}>
        <circle cx="12" cy="12" r="10" stroke="#e8e4de" strokeWidth="3"/>
        <path d="M12 2a10 10 0 0 1 10 10" stroke="#c9a96e" strokeWidth="3" strokeLinecap="round"/>
      </svg>
    </div>
  )

  return (
    <div style={{ background: '#fff', borderRadius: 24, border: '1px solid #e8e4de', overflow: 'hidden', marginBottom: 32 }}>

      {/* Header */}
      <div style={{ padding: '20px 24px', borderBottom: '1px solid #f0ede8', background: '#faf8f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h3 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 20, fontWeight: 600, color: '#0d0d0d' }}>Manage Availability</h3>
          <p style={{ fontSize: 12, color: '#9a9a9a', marginTop: 3 }}>
            {totalSlots > 0 ? `${totalSlots} time slots set this week` : 'No slots added yet — select your available times below'}
          </p>
        </div>
        <button onClick={handleSave} disabled={saving} style={{
          padding: '10px 22px', background: saved ? '#22c55e' : '#0d0d0d',
          color: '#fff', border: 'none', borderRadius: 12,
          fontSize: 13, fontWeight: 500, cursor: saving ? 'not-allowed' : 'pointer',
          fontFamily: 'inherit', transition: 'all 0.3s', opacity: saving ? 0.7 : 1,
          display: 'flex', alignItems: 'center', gap: 7,
        }}>
          {saving
            ? <><svg className="spinner" width="13" height="13" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/><path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round"/></svg>Saving...</>
            : saved ? '✓ Saved!' : 'Save Slots'
          }
        </button>
      </div>

      {/* Day tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #f0ede8', overflowX: 'auto' }}>
        {DAYS.map(day => {
          const count = (availability[day]||[]).length
          const active = activeDay === day
          return (
            <button key={day} onClick={() => setActiveDay(day)} style={{
              flex: 1, minWidth: 62, padding: '13px 6px', border: 'none',
              background: active ? '#fff' : '#faf8f5',
              borderBottom: active ? '2px solid #0d0d0d' : '2px solid transparent',
              cursor: 'pointer', fontFamily: 'inherit', position: 'relative', transition: 'all 0.2s',
            }}>
              <p style={{ fontSize: 12, fontWeight: active ? 600 : 400, color: active ? '#0d0d0d' : '#9a9a9a' }}>{day}</p>
              {count > 0 && (
                <span style={{ position: 'absolute', top: 5, right: '50%', transform: 'translateX(10px)', width: 15, height: 15, borderRadius: '50%', background: '#c9a96e', fontSize: 8, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{count}</span>
              )}
            </button>
          )
        })}
      </div>

      {/* Slot grid */}
      <div style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <p style={{ fontSize: 13, fontWeight: 500, color: '#0d0d0d' }}>{DAY_FULL[activeDay]}</p>
          <button onClick={() => toggleAll(activeDay)} style={{ fontSize: 11, padding: '4px 12px', borderRadius: 999, border: '1px solid #e8e4de', background: '#faf8f5', color: '#6b6b6b', cursor: 'pointer', fontFamily: 'inherit' }}>
            {ALL_TIMES.every(t => (availability[activeDay]||[]).includes(t)) ? 'Deselect All' : 'Select All'}
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(105px,1fr))', gap: 8 }}>
          {ALL_TIMES.map(time => {
            const sel = (availability[activeDay]||[]).includes(time)
            return (
              <button key={time} onClick={() => toggleSlot(activeDay, time)} style={{
                padding: '10px 6px', borderRadius: 10, fontSize: 12, fontWeight: 500,
                cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
                border: `1.5px solid ${sel ? '#c9a96e' : '#e8e4de'}`,
                background: sel ? 'rgba(201,169,110,0.1)' : '#faf8f5',
                color: sel ? '#a07840' : '#6b6b6b',
                transform: sel ? 'scale(1.03)' : 'scale(1)',
              }}>{time}</button>
            )
          })}
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 14, marginTop: 16, paddingTop: 14, borderTop: '1px solid #f0ede8' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: 'rgba(201,169,110,0.15)', border: '1.5px solid #c9a96e' }} />
            <span style={{ fontSize: 11, color: '#8a8a8a' }}>Available</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: '#faf8f5', border: '1.5px solid #e8e4de' }} />
            <span style={{ fontSize: 11, color: '#8a8a8a' }}>Not available</span>
          </div>
        </div>
      </div>

      {/* Weekly summary */}
      <div style={{ padding: '14px 24px', borderTop: '1px solid #f0ede8', background: '#faf8f5' }}>
        <p style={{ fontSize: 10, fontWeight: 600, color: '#9a9a9a', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Weekly Summary</p>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {DAYS.map(day => {
            const count = (availability[day]||[]).length
            return (
              <span key={day} style={{ fontSize: 11, padding: '3px 10px', borderRadius: 999, background: count > 0 ? 'rgba(201,169,110,0.1)' : '#f0ede8', color: count > 0 ? '#a07840' : '#b0aba4', border: count > 0 ? '1px solid rgba(201,169,110,0.25)' : '1px solid transparent' }}>
                {day}: {count > 0 ? `${count}` : 'Off'}
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}
