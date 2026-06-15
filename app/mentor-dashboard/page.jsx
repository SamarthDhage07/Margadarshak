'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/AuthContext'
import { getMentorBookings, updateMentorProfile } from '@/lib/firestore'
import MentorVerification from '@/components/MentorVerification'
import SlotManager from '@/components/SlotManager'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AIChat from '@/components/AIChat'

const BRANCHES = ['Computer Science', 'IT', 'Electronics', 'Mechanical', 'Civil', 'Other']
const EXAMS = ['MHT-CET', 'JEE Mains', 'JEE Advanced', 'BITSAT', 'Other']

export default function MentorDashboard() {
  const { user, profile, setProfile } = useAuth()
  const router = useRouter()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ college: '', branch: '', percentile: '', exam: '', bio: '', available: true })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (user === null) { router.push('/onboarding'); return }
    if (user === undefined) return
    if (profile?.role === 'student') { router.push('/dashboard'); return }

    setForm({
      college: profile?.college || '',
      branch: profile?.branch || '',
      percentile: profile?.percentile || '',
      exam: profile?.exam || '',
      bio: profile?.bio || '',
      available: profile?.available !== false,
    })

    async function load() {
      try {
        const b = await getMentorBookings(user.uid)
        setBookings(b)
      } catch (e) { console.error(e) }
      setLoading(false)
    }
    load()
  }, [user, profile])

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateMentorProfile(user.uid, form)
      setProfile(prev => ({ ...prev, ...form }))
      setEditing(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (e) { console.error(e) }
    setSaving(false)
  }

  const toggleAvailability = async () => {
    const newVal = !form.available
    setForm(prev => ({ ...prev, available: newVal }))
    try {
      await updateMentorProfile(user.uid, { available: newVal })
      setProfile(prev => ({ ...prev, available: newVal }))
    } catch (e) { console.error(e) }
  }

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

  const inp = { width: '100%', padding: '11px 14px', border: '1px solid #e5e7eb', borderRadius: 10, fontSize: 14, outline: 'none', background: '#f9fafb', fontFamily: 'inherit', color: '#0a0a0a' }

  return (
    <main style={{ minHeight: '100vh', background: '#fafafa' }}>
      <Navbar />

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '100px 24px 80px' }}>
        {/* Welcome */}
        <div className="fade-up" style={{ marginBottom: 36 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              {user?.photoURL
                ? <img src={user.photoURL} style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', border: '2px solid #f3f4f6' }} alt="" />
                : <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ color: '#fff', fontSize: 22, fontFamily: "'Playfair Display',Georgia,serif" }}>{user?.displayName?.charAt(0)}</span></div>
              }
              <div>
                <h1 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 'clamp(22px,4vw,30px)', fontWeight: 700 }}>
                  {user?.displayName} 👋
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 12, background: '#dbeafe', color: '#1d4ed8', padding: '2px 10px', borderRadius: 999, fontWeight: 500 }}>Mentor</span>
                  <span style={{ fontSize: 12, background: '#d1fae5', color: '#065f46', padding: '2px 10px', borderRadius: 999, fontWeight: 500 }}>✓ Verified</span>
                </div>
              </div>
            </div>

            {/* Availability toggle */}
            <button onClick={toggleAvailability} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 18px',
              background: form.available ? '#f0fdf4' : '#fef2f2',
              border: `1px solid ${form.available ? '#bbf7d0' : '#fecaca'}`,
              borderRadius: 999, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
            }}>
              <div style={{ width: 36, height: 20, background: form.available ? '#22c55e' : '#d1d5db', borderRadius: 999, position: 'relative', transition: 'background 0.3s', flexShrink: 0 }}>
                <div style={{ position: 'absolute', top: 2, left: form.available ? 18 : 2, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left 0.3s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 500, color: form.available ? '#15803d' : '#dc2626' }}>
                {form.available ? 'Available' : 'Not Available'}
              </span>
            </button>
          </div>
        </div>


        {/* ── VERIFICATION STATUS BANNER ── */}
        {!profile?.verified && (
          <div className="fade-up" style={{ marginBottom: 32 }}>
            {(!profile?.verificationStatus || profile?.verificationStatus === 'pending') && !profile?.college ? (
              <div style={{ background: '#fff', borderRadius: 24, border: '1px solid #e8e4de', overflow: 'hidden' }}>
                <div style={{ background: 'rgba(201,169,110,0.08)', borderBottom: '1px solid rgba(201,169,110,0.15)', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 20 }}>📋</span>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 14, color: '#0d0d0d' }}>Complete Your Mentor Application</p>
                    <p style={{ fontSize: 12, color: '#9a9a9a', marginTop: 2 }}>Upload your college proof to get verified and appear on the mentors page</p>
                  </div>
                </div>
                <div style={{ padding: '24px' }}>
                  <MentorVerification user={user} onComplete={() => window.location.reload()} />
                </div>
              </div>
            ) : profile?.verificationStatus === 'pending' ? (
              <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 16, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 24 }}>⏳</span>
                <div>
                  <p style={{ fontWeight: 600, fontSize: 14, color: '#92400e' }}>Verification Pending</p>
                  <p style={{ fontSize: 13, color: '#a16207', marginTop: 2 }}>Your documents are under review. We'll notify you within 24–48 hours.</p>
                </div>
              </div>
            ) : profile?.verificationStatus === 'rejected' ? (
              <div style={{ background: '#fee2e2', border: '1px solid #fecaca', borderRadius: 16, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 24 }}>❌</span>
                <div>
                  <p style={{ fontWeight: 600, fontSize: 14, color: '#991b1b' }}>Verification Rejected</p>
                  <p style={{ fontSize: 13, color: '#b91c1c', marginTop: 2 }}>Reason: {profile?.rejectionReason || 'Document not valid'}. Please resubmit.</p>
                </div>
              </div>
            ) : null}
          </div>
        )}
        {profile?.verified && (
          <div style={{ background: '#d1fae5', border: '1px solid #bbf7d0', borderRadius: 14, padding: '12px 18px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 20 }}>✅</span>
            <p style={{ fontSize: 13, color: '#065f46', fontWeight: 500 }}>Your profile is verified and live on the mentors page!</p>
          </div>
        )}

        {/* Stats */}
        <div className="fade-up d1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 14, marginBottom: 36 }}>
          {[
            { icon: '📅', label: 'Session Requests', value: bookings.length, bg: '#eff6ff' },
            { icon: '⭐', label: 'Profile Views', value: '—', bg: '#faf5ff' },
            { icon: '✅', label: 'Status', value: form.available ? 'Active' : 'Paused', bg: form.available ? '#f0fdf4' : '#fef2f2' },
          ].map(s => (
            <div key={s.label} style={{ background: '#fff', borderRadius: 18, padding: '20px', border: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 20 }}>{s.icon}</span>
              </div>
              <div>
                <p style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Playfair Display',Georgia,serif" }}>{s.value}</p>
                <p style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Profile Card */}
        <div className="fade-up d2" style={{ background: '#fff', borderRadius: 24, border: '1px solid #f3f4f6', padding: '28px', marginBottom: 36 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 20, fontWeight: 700 }}>Your Profile</h2>
            {!editing
              ? <button onClick={() => setEditing(true)} style={{ padding: '8px 18px', background: '#f3f4f6', border: 'none', borderRadius: 999, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>Edit Profile</button>
              : <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => setEditing(false)} style={{ padding: '8px 18px', background: '#f3f4f6', border: 'none', borderRadius: 999, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
                  <button onClick={handleSave} disabled={saving} style={{ padding: '8px 18px', background: '#0a0a0a', color: '#fff', border: 'none', borderRadius: 999, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', opacity: saving ? 0.7 : 1 }}>
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                </div>
            }
          </div>

          {saved && <div style={{ background: '#d1fae5', border: '1px solid #bbf7d0', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#065f46' }}>✅ Profile updated successfully!</div>}

          {editing ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: '#6b7280', display: 'block', marginBottom: 6 }}>College</label>
                <input value={form.college} onChange={e => setForm({ ...form, college: e.target.value })} placeholder="e.g. COEP Pune" style={inp} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: '#6b7280', display: 'block', marginBottom: 6 }}>Branch</label>
                <select value={form.branch} onChange={e => setForm({ ...form, branch: e.target.value })} style={{ ...inp, cursor: 'pointer' }}>
                  <option value="">Select Branch</option>
                  {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: '#6b7280', display: 'block', marginBottom: 6 }}>Percentile</label>
                <input value={form.percentile} onChange={e => setForm({ ...form, percentile: e.target.value })} placeholder="e.g. 99.2" style={inp} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: '#6b7280', display: 'block', marginBottom: 6 }}>Exam</label>
                <select value={form.exam} onChange={e => setForm({ ...form, exam: e.target.value })} style={{ ...inp, cursor: 'pointer' }}>
                  <option value="">Select Exam</option>
                  {EXAMS.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: '#6b7280', display: 'block', marginBottom: 6 }}>Bio</label>
                <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} placeholder="Tell students about yourself, your experience, what you can help with..." rows={3} style={{ ...inp, resize: 'none' }} />
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 16 }}>
              {[
                { label: 'College', value: form.college || '—' },
                { label: 'Branch', value: form.branch || '—' },
                { label: 'Percentile', value: form.percentile ? `${form.percentile}%ile` : '—' },
                { label: 'Exam', value: form.exam || '—' },
              ].map(f => (
                <div key={f.label} style={{ background: '#fafafa', borderRadius: 12, padding: '14px 16px' }}>
                  <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9ca3af', marginBottom: 6 }}>{f.label}</p>
                  <p style={{ fontSize: 15, fontWeight: 500, color: '#0a0a0a' }}>{f.value}</p>
                </div>
              ))}
              {form.bio && (
                <div style={{ gridColumn: '1 / -1', background: '#fafafa', borderRadius: 12, padding: '14px 16px' }}>
                  <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9ca3af', marginBottom: 6 }}>Bio</p>
                  <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.7 }}>{form.bio}</p>
                </div>
              )}
              {!form.college && !form.bio && (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '16px 0' }}>
                  <p style={{ fontSize: 14, color: '#9ca3af' }}>Complete your profile to attract more students</p>
                  <button onClick={() => setEditing(true)} style={{ marginTop: 8, padding: '8px 20px', background: '#0a0a0a', color: '#fff', border: 'none', borderRadius: 999, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>Complete Profile →</button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* SLOT MANAGER */}
        {profile?.verified && (
          <div className="fade-up d2" style={{ marginBottom: 32 }}>
            <SlotManager mentorId={user?.uid} />
          </div>
        )}

        {/* Session Requests */}
        <div className="fade-up d3">
          <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 22, fontWeight: 700, marginBottom: 18 }}>Session Requests</h2>
          {bookings.length === 0 ? (
            <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #f3f4f6', padding: '48px 24px', textAlign: 'center' }}>
              <p style={{ fontSize: 36, marginBottom: 12 }}>📭</p>
              <p style={{ fontWeight: 500, color: '#374151', marginBottom: 6 }}>No session requests yet</p>
              <p style={{ fontSize: 14, color: '#9ca3af' }}>Complete your profile to start receiving requests</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {bookings.map(b => (
                <div key={b.id} style={{ background: '#fff', borderRadius: 16, border: '1px solid #f3f4f6', padding: '20px 24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                    <div>
                      <p style={{ fontWeight: 600, color: '#0a0a0a', marginBottom: 4 }}>📩 {b.studentName}</p>
                      <p style={{ fontSize: 13, color: '#6b7280' }}>{b.studentEmail}</p>
                      <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>📅 {b.date} &nbsp;⏰ {b.time}</p>
                      {b.message && <p style={{ fontSize: 13, color: '#9ca3af', marginTop: 6, fontStyle: 'italic' }}>"{b.message}"</p>}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                      <span style={{ fontSize: 12, fontWeight: 500, padding: '4px 12px', borderRadius: 999, background: '#fef3c7', color: '#92400e' }}>Pending</span>
                      <a href={`tel:${b.mobile}`} style={{ fontSize: 12, color: '#0a0a0a', textDecoration: 'none', background: '#f3f4f6', padding: '4px 12px', borderRadius: 999 }}>📞 {b.mobile}</a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
      <AIChat />
    </main>
  )
}
