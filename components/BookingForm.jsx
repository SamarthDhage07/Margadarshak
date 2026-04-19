'use client'
import { useState } from 'react'
import { bookSession, getMentorEmail } from '@/lib/firestore'
import { generateMeetLink, sendBookingEmails } from '@/lib/email'
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
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [meetLink, setMeetLink] = useState('')
  const [emailStatus, setEmailStatus] = useState('') // '', 'sending', 'sent', 'failed'

  const validate = () => {
    const e = {}
    if (!form.fullName.trim()) e.fullName = 'Required'
    if (!/^[6-9]\d{9}$/.test(form.mobile)) e.mobile = 'Enter valid 10-digit number'
    if (!form.date) e.date = 'Required'
    if (!form.time) e.time = 'Required'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setStatus('loading')

    try {
      // 1. Generate unique Google Meet link
      const link = generateMeetLink()
      setMeetLink(link)

      // 2. Save booking to Firestore (with meet link)
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

      // 3. Send emails to both parties
      setEmailStatus('sending')
      const mentorEmail = mentor.email || await getMentorEmail(mentor.uid)

      if (mentorEmail) {
        await sendBookingEmails({
          studentName:  form.fullName,
          studentEmail: form.email,
          mentorName:   mentor.name,
          mentorEmail:  mentorEmail,
          date:         form.date,
          time:         form.time,
          meetLink:     link,
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
    border: `1px solid ${errors[field] ? '#fca5a5' : '#e5e7eb'}`,
    borderRadius: 12, fontSize: 14, outline: 'none',
    background: '#f9fafb', fontFamily: 'inherit',
    color: '#0a0a0a', transition: 'border 0.2s',
  })

  return (
    <div onClick={(e) => e.target === e.currentTarget && onClose()} style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
    }}>
      <div className="fade-up" style={{ background: '#fff', borderRadius: 28, width: '100%', maxWidth: 480, boxShadow: '0 24px 64px rgba(0,0,0,0.12)', border: '1px solid #f3f4f6', maxHeight: '90vh', overflowY: 'auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '24px 24px 16px', position: 'sticky', top: 0, background: '#fff', borderRadius: '28px 28px 0 0', zIndex: 1 }}>
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, fontWeight: 700 }}>Book a Session</h2>
            {mentor && <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>with {mentor.name} · {mentor.college}</p>}
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: '50%', background: '#f3f4f6', border: 'none', cursor: 'pointer', fontSize: 18, color: '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>×</button>
        </div>

        {/* SUCCESS STATE */}
        {status === 'success' ? (
          <div style={{ padding: '8px 24px 32px', textAlign: 'center' }}>
            {/* Check icon */}
            <div style={{ width: 64, height: 64, background: '#0a0a0a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Session Booked! 🎉</h3>
            <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 24, lineHeight: 1.7 }}>
              Your session with <strong>{mentor?.name}</strong> is confirmed for <strong>{form.date}</strong> at <strong>{form.time}</strong>.
            </p>

            {/* Meet Link Box */}
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 16, padding: '18px 20px', marginBottom: 20, textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 20 }}>🎥</span>
                <p style={{ fontWeight: 600, fontSize: 14, color: '#065f46' }}>Google Meet Link</p>
              </div>
              <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 10 }}>Use this link to join your session at the scheduled time:</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <code style={{ fontSize: 12, background: '#fff', padding: '6px 12px', borderRadius: 8, border: '1px solid #d1fae5', flex: 1, wordBreak: 'break-all', color: '#065f46', fontFamily: 'monospace' }}>
                  {meetLink}
                </code>
                <button
                  onClick={() => { navigator.clipboard.writeText(meetLink) }}
                  style={{ padding: '6px 14px', background: '#065f46', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}
                >
                  Copy
                </button>
              </div>
              <a href={meetLink} target="_blank" rel="noopener noreferrer" style={{ display: 'block', marginTop: 10, textAlign: 'center', padding: '10px', background: '#22c55e', color: '#fff', borderRadius: 10, fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>
                Open Google Meet →
              </a>
            </div>

            {/* Email status */}
            <div style={{ marginBottom: 20 }}>
              {emailStatus === 'sending' && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 13, color: '#6b7280' }}>
                  <svg className="spinner" width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#d1d5db" strokeWidth="3"/><path d="M12 2a10 10 0 0 1 10 10" stroke="#0a0a0a" strokeWidth="3" strokeLinecap="round"/></svg>
                  Sending confirmation emails...
                </div>
              )}
              {emailStatus === 'sent' && (
                <div style={{ fontSize: 13, color: '#16a34a', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '8px 14px' }}>
                  ✅ Confirmation emails sent to you and {mentor?.name}
                </div>
              )}
              {emailStatus === 'failed' && (
                <div style={{ fontSize: 13, color: '#dc2626', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '8px 14px' }}>
                  ⚠️ Email sending failed — but your session is confirmed! Share the meet link manually.
                </div>
              )}
            </div>

            <button onClick={onClose} style={{ width: '100%', padding: '13px 0', background: '#0a0a0a', color: '#fff', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
              Done
            </button>
          </div>

        ) : status === 'error' ? (
          <div style={{ padding: '16px 24px 32px', textAlign: 'center' }}>
            <p style={{ fontSize: 36, marginBottom: 12 }}>❌</p>
            <h3 style={{ fontWeight: 600, marginBottom: 8 }}>Something went wrong</h3>
            <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 20 }}>Please try again or check your connection.</p>
            <button onClick={() => setStatus('idle')} style={{ width: '100%', padding: '13px 0', background: '#0a0a0a', color: '#fff', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
              Try Again
            </button>
          </div>

        ) : (
          /* FORM */
          <form onSubmit={handleSubmit} style={{ padding: '0 24px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <input type="text" placeholder="Full Name" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} style={inp('fullName')} />
              {errors.fullName && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 4 }}>{errors.fullName}</p>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <input type="tel" placeholder="Mobile Number" value={form.mobile} onChange={e => setForm({ ...form, mobile: e.target.value })} style={inp('mobile')} />
                {errors.mobile && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 4 }}>{errors.mobile}</p>}
              </div>
              <div>
                <input type="email" placeholder="Email" value={form.email} readOnly style={{ ...inp('email'), background: '#f3f4f6', cursor: 'not-allowed', color: '#6b7280' }} />
              </div>
              <div>
                <input type="date" value={form.date} min={new Date().toISOString().split('T')[0]} onChange={e => setForm({ ...form, date: e.target.value })} style={inp('date')} />
                {errors.date && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 4 }}>{errors.date}</p>}
              </div>
              <div>
                <select value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} style={{ ...inp('time'), cursor: 'pointer' }}>
                  <option value="">Preferred Time</option>
                  {['9:00 AM','10:00 AM','11:00 AM','12:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM','6:00 PM','7:00 PM'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                {errors.time && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 4 }}>{errors.time}</p>}
              </div>
            </div>

            <textarea placeholder="Message (optional) — e.g. I got 87 percentile in MHT-CET..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={3} style={{ ...inp('message'), resize: 'none' }} />

            {/* What happens on submit info */}
            <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 12, padding: '12px 14px', fontSize: 13, color: '#0369a1' }}>
              📧 A Google Meet link + confirmation email will be sent to you and {mentor?.name} automatically.
            </div>

            <button type="submit" disabled={status === 'loading'} style={{ width: '100%', padding: '14px 0', background: '#0a0a0a', color: '#fff', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 500, cursor: status === 'loading' ? 'not-allowed' : 'pointer', opacity: status === 'loading' ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'inherit' }}>
              {status === 'loading'
                ? <><svg className="spinner" width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity="0.3"/><path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round"/></svg> Booking & Sending Meet Link...</>
                : '🎥 Confirm & Get Meet Link'
              }
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
