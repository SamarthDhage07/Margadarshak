'use client'
import { useState, useEffect } from 'react'
import { bookSession, getMentorEmail } from '@/lib/firestore'
import { generateMeetLink, sendBookingEmails } from '@/lib/email'
import { getAvailableSlots } from '@/lib/slots'
import { useAuth } from '@/lib/AuthContext'

export default function BookingForm({ mentor, onClose }) {
  const { user } = useAuth()
  const [form, setForm] = useState({
    fullName: user?.displayName || '',
    mobile: '',
    email: user?.email || '',
    date: '',
    time: '',
    message: '',
  })
  const [errors, setErrors]             = useState({})
  const [status, setStatus]             = useState('idle')
  const [meetLink, setMeetLink]         = useState('')
  const [emailStatus, setEmailStatus]   = useState('')
  const [availableSlots, setAvailableSlots] = useState([])
  const [loadingSlots, setLoadingSlots]     = useState(false)
  const [noSlots, setNoSlots]               = useState(false)

  useEffect(() => {
    if (!form.date || !mentor?.uid) return
    setLoadingSlots(true)
    setAvailableSlots([])
    setNoSlots(false)
    setForm(prev => ({ ...prev, time: '' }))

    getAvailableSlots(mentor.uid, form.date).then(slots => {
      setAvailableSlots(slots)
      setNoSlots(slots.length === 0)
      setLoadingSlots(false)
    }).catch(() => setLoadingSlots(false))
  }, [form.date, mentor?.uid])

  const validate = () => {
    const e = {}
    if (!form.fullName.trim()) e.fullName = 'Required'
    if (!/^[6-9]\d{9}$/.test(form.mobile)) e.mobile = 'Enter valid 10-digit number'
    if (!form.date) e.date = 'Required'
    if (!form.time) e.time = 'Please select a time slot'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setStatus('loading')

    try {
      const link = generateMeetLink()
      setMeetLink(link)

      await bookSession({
        studentName:  form.fullName,
        studentEmail: form.email,
        mentorId:     mentor.uid,
        mentorName:   mentor.name,
        mentorEmail:  mentor.email || '',
        date:         form.date,
        time:         form.time,
        message:      form.message,
        mobile:       form.mobile,
        meetLink:     link,
      })

      setEmailStatus('sending')
      const mentorEmail = mentor.email || await getMentorEmail(mentor.uid)
      if (mentorEmail) {
        await sendBookingEmails({
          studentName: form.fullName, studentEmail: form.email,
          mentorName: mentor.name, mentorEmail,
          date: form.date, time: form.time, meetLink: link,
        })
        setEmailStatus('sent')
      } else {
        setEmailStatus('failed')
      }
      setStatus('success')
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }

  const inp = (field) => ({
    width: '100%', padding: '12px 16px',
    border: `1px solid ${errors[field] ? '#fca5a5' : '#e8e4de'}`,
    borderRadius: 12, fontSize: 14, outline: 'none',
    background: '#faf8f5', fontFamily: 'inherit',
    color: '#0d0d0d', transition: 'border 0.2s',
  })

  const today = new Date().toISOString().split('T')[0]

  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
    }}>
      <div style={{
        background: '#fff', borderRadius: 28, width: '100%', maxWidth: 500,
        boxShadow: '0 24px 64px rgba(0,0,0,0.12)', border: '1px solid #f3f4f6',
        maxHeight: '92vh', overflowY: 'auto',
      }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '22px 24px 16px', position: 'sticky', top: 0, background: '#fff', borderRadius: '28px 28px 0 0', zIndex: 1, borderBottom: '1px solid #f0ede8' }}>
          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 22, fontWeight: 700 }}>Book a Session</h2>
            {mentor && <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>with {mentor.name} · {mentor.college}</p>}
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: '50%', background: '#f3f4f6', border: 'none', cursor: 'pointer', fontSize: 18, color: '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>×</button>
        </div>

        {/* SUCCESS */}
        {status === 'success' ? (
          <div style={{ padding: '24px 24px 32px', textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, background: '#0d0d0d', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h3 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 24, fontWeight: 600, marginBottom: 8 }}>Session Booked!</h3>
            <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 20, lineHeight: 1.7 }}>
              Your session with <strong>{mentor?.name}</strong> is confirmed for <strong>{form.date}</strong> at <strong>{form.time}</strong>.
            </p>
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 16, padding: '16px 18px', marginBottom: 14, textAlign: 'left' }}>
              <p style={{ fontWeight: 600, fontSize: 13, color: '#065f46', marginBottom: 8 }}>Meet Link</p>
              <div style={{ display: 'flex', gap: 8 }}>
                <code style={{ fontSize: 11, background: '#fff', padding: '6px 10px', borderRadius: 8, border: '1px solid #d1fae5', flex: 1, wordBreak: 'break-all', color: '#065f46' }}>{meetLink}</code>
                <button onClick={() => navigator.clipboard.writeText(meetLink)} style={{ padding: '6px 12px', background: '#065f46', color: '#fff', border: 'none', borderRadius: 8, fontSize: 11, cursor: 'pointer' }}>Copy</button>
              </div>
              <a href={meetLink} target="_blank" rel="noopener noreferrer" style={{ display: 'block', marginTop: 10, textAlign: 'center', padding: '9px', background: '#22c55e', color: '#fff', borderRadius: 10, fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>Open Meet</a>
            </div>
            {emailStatus === 'sent' && <p style={{ fontSize: 12, color: '#16a34a', marginBottom: 16 }}>Confirmation email sent to you and {mentor?.name}</p>}
            <button onClick={onClose} style={{ width: '100%', padding: '13px 0', background: '#0d0d0d', color: '#fff', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>Done</button>
          </div>

        ) : status === 'error' ? (
          <div style={{ padding: '24px', textAlign: 'center' }}>
            <p style={{ marginBottom: 16, color: '#6b7280' }}>Something went wrong. Please try again.</p>
            <button onClick={() => setStatus('idle')} style={{ width: '100%', padding: '13px 0', background: '#0d0d0d', color: '#fff', border: 'none', borderRadius: 12, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>Try Again</button>
          </div>

        ) : (
          <form onSubmit={handleSubmit} style={{ padding: '18px 24px 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Name + Mobile */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: '#6b6b6b', display: 'block', marginBottom: 5 }}>Full Name *</label>
                <input value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} style={inp('fullName')} placeholder="Your name" />
                {errors.fullName && <p style={{ fontSize: 11, color: '#ef4444', marginTop: 3 }}>{errors.fullName}</p>}
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: '#6b6b6b', display: 'block', marginBottom: 5 }}>Mobile *</label>
                <input type="tel" value={form.mobile} onChange={e => setForm({ ...form, mobile: e.target.value })} style={inp('mobile')} placeholder="10-digit number" />
                {errors.mobile && <p style={{ fontSize: 11, color: '#ef4444', marginTop: 3 }}>{errors.mobile}</p>}
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: '#6b6b6b', display: 'block', marginBottom: 5 }}>Email</label>
              <input type="email" value={form.email} readOnly style={{ ...inp('email'), background: '#f0ede8', cursor: 'not-allowed', color: '#9a9a9a' }} />
            </div>

            {/* Date */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: '#6b6b6b', display: 'block', marginBottom: 5 }}>Select Date *</label>
              <input type="date" value={form.date} min={today} onChange={e => setForm({ ...form, date: e.target.value, time: '' })} style={inp('date')} />
              {errors.date && <p style={{ fontSize: 11, color: '#ef4444', marginTop: 3 }}>{errors.date}</p>}
            </div>

            {/* SLOT PICKER */}
            {form.date && (
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: '#6b6b6b', display: 'block', marginBottom: 8 }}>
                  Available Time Slots *
                </label>

                {loadingSlots ? (
                  <div style={{ padding: '20px', textAlign: 'center', background: '#faf8f5', borderRadius: 12, border: '1px solid #e8e4de' }}>
                    <svg className="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ margin: '0 auto', display: 'block' }}>
                      <circle cx="12" cy="12" r="10" stroke="#e8e4de" strokeWidth="3"/>
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="#c9a96e" strokeWidth="3" strokeLinecap="round"/>
                    </svg>
                    <p style={{ fontSize: 12, color: '#9a9a9a', marginTop: 8 }}>Checking mentor availability...</p>
                  </div>

                ) : noSlots ? (
                  <div style={{ padding: '16px', textAlign: 'center', background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 12 }}>
                    <p style={{ fontSize: 13, color: '#92400e', fontWeight: 500 }}>No slots available on this date</p>
                    <p style={{ fontSize: 12, color: '#a16207', marginTop: 4 }}>Please try a different date</p>
                  </div>

                ) : (
                  <div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px,1fr))', gap: 7 }}>
                      {availableSlots.map(slot => (
                        <button key={slot} type="button"
                          onClick={() => { setForm({ ...form, time: slot }); setErrors({ ...errors, time: '' }) }}
                          style={{
                            padding: '10px 6px', borderRadius: 10, fontSize: 12, fontWeight: 500,
                            cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
                            border: `1.5px solid ${form.time === slot ? '#c9a96e' : '#e8e4de'}`,
                            background: form.time === slot ? 'rgba(201,169,110,0.1)' : '#faf8f5',
                            color: form.time === slot ? '#a07840' : '#6b6b6b',
                            transform: form.time === slot ? 'scale(1.04)' : 'scale(1)',
                          }}
                        >{slot}</button>
                      ))}
                    </div>
                    {form.time && (
                      <div style={{ marginTop: 10, padding: '8px 14px', background: 'rgba(201,169,110,0.08)', border: '1px solid rgba(201,169,110,0.2)', borderRadius: 10, fontSize: 12, color: '#a07840', fontWeight: 500 }}>
                        Selected: {form.time} on {form.date}
                      </div>
                    )}
                    {errors.time && <p style={{ fontSize: 11, color: '#ef4444', marginTop: 4 }}>{errors.time}</p>}
                  </div>
                )}
              </div>
            )}

            {/* Message */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: '#6b6b6b', display: 'block', marginBottom: 5 }}>Message <span style={{ color: '#b0aba4' }}>(optional)</span></label>
              <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="e.g. I got 87 percentile in MHT-CET and want guidance on college selection..." rows={3} style={{ ...inp('message'), resize: 'none' }} />
            </div>

            {/* Info */}
            <div style={{ background: 'rgba(201,169,110,0.06)', border: '1px solid rgba(201,169,110,0.2)', borderRadius: 12, padding: '11px 14px', fontSize: 13, color: '#a07840' }}>
              A Meet link and confirmation email will be sent to both you and {mentor?.name} after booking.
            </div>

            <button type="submit" disabled={status === 'loading' || noSlots} style={{
              width: '100%', padding: '14px 0', background: '#0d0d0d', color: '#fff',
              border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 500,
              cursor: (status === 'loading' || noSlots) ? 'not-allowed' : 'pointer',
              opacity: (status === 'loading' || noSlots) ? 0.6 : 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'inherit',
            }}>
              {status === 'loading'
                ? <><svg className="spinner" width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity="0.3"/><path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round"/></svg>Booking...</>
                : 'Confirm Booking'
              }
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
