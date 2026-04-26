'use client'
import { useEffect, useState } from 'react'
import { getAllMentorsForAdmin, approveMentor, rejectMentor } from '@/lib/firestore'

const ADMIN_EMAIL    = process.env.NEXT_PUBLIC_ADMIN_EMAIL    || 'admin@margadarshak.in'
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin@123'

const STATUS_STYLE = {
  pending:  { bg: '#fef3c7', color: '#92400e', label: '⏳ Pending'  },
  approved: { bg: '#d1fae5', color: '#065f46', label: '✅ Approved' },
  rejected: { bg: '#fee2e2', color: '#991b1b', label: '❌ Rejected' },
}

/* ── Admin Login Screen ── */
function AdminLogin({ onLogin }) {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 600)) // slight delay for UX
    if (email.trim() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      sessionStorage.setItem('md_admin', 'true')
      onLogin()
    } else {
      setError('Invalid email or password')
    }
    setLoading(false)
  }

  const inp = (err) => ({
    width: '100%', padding: '13px 16px',
    border: `1px solid ${err ? '#fca5a5' : '#e8e4de'}`,
    borderRadius: 13, fontSize: 14, outline: 'none',
    background: '#faf8f5', fontFamily: 'inherit',
    color: '#0d0d0d', transition: 'border 0.2s',
  })

  return (
    <div style={{ minHeight: '100vh', background: '#faf8f5', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, position: 'relative', overflow: 'hidden' }}>
      {/* BG decoration */}
      <div style={{ position: 'fixed', top: '8%', right: '4%',  width: 380, height: 380, borderRadius: '50%', border: '1px solid rgba(201,169,110,0.12)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '8%', left: '4%', width: 280, height: 280, borderRadius: '50%', border: '1px solid rgba(201,169,110,0.08)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', inset: 0, opacity: 0.25, backgroundImage: 'radial-gradient(circle, #d4cfc8 1px, transparent 1px)', backgroundSize: '30px 30px', pointerEvents: 'none' }} />

      <div className="fade-up" style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{ width: 36, height: 36, background: '#0d0d0d', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(0,0,0,0.15)' }}>
              <span style={{ color: '#c9a96e', fontSize: 16, fontFamily: "'Cormorant Garamond',Georgia,serif", fontWeight: 700 }}>M</span>
            </div>
            <span style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontWeight: 600, fontSize: 22, color: '#0d0d0d' }}>MargaDarshak</span>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.25)', borderRadius: 999, padding: '4px 14px', fontSize: 11, color: '#a07840', fontWeight: 600, letterSpacing: '0.08em' }}>
            🔐 ADMIN ACCESS
          </div>
        </div>

        {/* Card */}
        <div style={{ background: '#fff', borderRadius: 28, padding: '40px 36px', border: '1px solid #e8e4de', boxShadow: '0 8px 48px rgba(0,0,0,0.07)', position: 'relative', overflow: 'hidden' }}>
          {/* Gold top line */}
          <div style={{ position: 'absolute', top: 0, left: '15%', right: '15%', height: 1, background: 'linear-gradient(90deg, transparent, rgba(201,169,110,0.5), transparent)' }} />

          <h1 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 26, fontWeight: 600, textAlign: 'center', marginBottom: 6, color: '#0d0d0d' }}>Admin Login</h1>
          <p style={{ fontSize: 13, color: '#9a9a9a', textAlign: 'center', marginBottom: 30 }}>Enter your admin credentials to continue</p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Email */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: '#6b6b6b', display: 'block', marginBottom: 6 }}>Admin Email</label>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError('') }}
                placeholder="admin@margadarshak.in"
                style={inp(error)}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: '#6b6b6b', display: 'block', marginBottom: 6 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError('') }}
                  placeholder="Enter admin password"
                  style={{ ...inp(error), paddingRight: 44 }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9a9a9a', fontSize: 16, padding: 0 }}
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#dc2626', textAlign: 'center' }}>
                ❌ {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', marginTop: 8, padding: '14px 0',
                background: '#0d0d0d', color: '#faf8f5',
                border: '1px solid rgba(201,169,110,0.2)',
                borderRadius: 14, fontSize: 14, fontWeight: 500,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit', letterSpacing: '0.03em',
                opacity: loading ? 0.7 : 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'all 0.2s',
              }}
            >
              {loading
                ? <><svg className="spinner" width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.2)" strokeWidth="3"/><path d="M12 2a10 10 0 0 1 10 10" stroke="#c9a96e" strokeWidth="3" strokeLinecap="round"/></svg>Verifying...</>
                : '🔐 Login to Admin Panel'
              }
            </button>
          </form>

          <p style={{ fontSize: 12, color: '#b0aba4', textAlign: 'center', marginTop: 20 }}>
            This page is restricted to MargaDarshak admins only
          </p>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20 }}>
          <a href="/" style={{ fontSize: 13, color: '#9a9a9a', textDecoration: 'none' }}>← Back to website</a>
        </p>
      </div>
    </div>
  )
}

/* ── Main Admin Dashboard ── */
export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)
  const [mentors, setMentors]         = useState([])
  const [loading, setLoading]         = useState(true)
  const [filter, setFilter]           = useState('all')
  const [selected, setSelected]       = useState(null)
  const [rejReason, setRejReason]     = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    const logged = sessionStorage.getItem('md_admin') === 'true'
    setIsLoggedIn(logged)
    setAuthChecked(true)
    if (logged) loadMentors()
  }, [])

  const loadMentors = async () => {
    setLoading(true)
    try { setMentors(await getAllMentorsForAdmin()) }
    catch (e) { console.error(e) }
    setLoading(false)
  }

  const handleLogin = () => { setIsLoggedIn(true); loadMentors() }

  const handleLogout = () => {
    sessionStorage.removeItem('md_admin')
    setIsLoggedIn(false)
    setMentors([])
  }

  const handleApprove = async (uid) => {
    setActionLoading(true)
    try { await approveMentor(uid); await loadMentors(); setSelected(null) }
    catch (e) { console.error(e) }
    setActionLoading(false)
  }

  const handleReject = async (uid) => {
    setActionLoading(true)
    try { await rejectMentor(uid, rejReason); await loadMentors(); setSelected(null); setRejReason('') }
    catch (e) { console.error(e) }
    setActionLoading(false)
  }

  const filtered = mentors.filter(m => {
    if (filter === 'pending')  return m.verificationStatus === 'pending'  || (!m.verificationStatus && !m.verified)
    if (filter === 'approved') return m.verificationStatus === 'approved' || m.verified === true
    if (filter === 'rejected') return m.verificationStatus === 'rejected'
    return true
  })

  const counts = {
    all:      mentors.length,
    pending:  mentors.filter(m => m.verificationStatus === 'pending'  || (!m.verificationStatus && !m.verified)).length,
    approved: mentors.filter(m => m.verificationStatus === 'approved' || m.verified === true).length,
    rejected: mentors.filter(m => m.verificationStatus === 'rejected').length,
  }

  if (!authChecked) return null
  if (!isLoggedIn)  return <AdminLogin onLogin={handleLogin} />

  return (
    <main style={{ minHeight: '100vh', background: '#faf8f5' }}>

      {/* Admin Navbar */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, background: 'rgba(250,248,245,0.92)', backdropFilter: 'blur(14px)', borderBottom: '1px solid #e8e4de', height: 64 }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 28, height: 28, background: '#0d0d0d', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#c9a96e', fontSize: 13, fontFamily: "'Cormorant Garamond',Georgia,serif", fontWeight: 700 }}>M</span>
            </div>
            <span style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontWeight: 600, fontSize: 18, color: '#0d0d0d' }}>MargaDarshak</span>
            <span style={{ fontSize: 11, background: 'rgba(201,169,110,0.12)', color: '#a07840', border: '1px solid rgba(201,169,110,0.25)', padding: '2px 10px', borderRadius: 999, fontWeight: 600, letterSpacing: '0.06em' }}>ADMIN</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <a href="/" style={{ fontSize: 13, color: '#6b6b6b', textDecoration: 'none' }}>← Website</a>
            <button onClick={handleLogout} style={{ padding: '7px 18px', background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca', borderRadius: 999, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
              Logout
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '96px 24px 80px' }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#c9a96e', marginBottom: 10 }}>Admin Panel</p>
          <h1 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 40, fontWeight: 600, color: '#0d0d0d' }}>Mentor Verification</h1>
          <p style={{ fontSize: 14, color: '#9a9a9a', marginTop: 6 }}>Review and approve mentor applications</p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 12, marginBottom: 28 }}>
          {[
            { label: 'Total',    value: counts.all,      bg: '#f0ede8', color: '#0d0d0d' },
            { label: 'Pending',  value: counts.pending,  bg: '#fef3c7', color: '#92400e' },
            { label: 'Approved', value: counts.approved, bg: '#d1fae5', color: '#065f46' },
            { label: 'Rejected', value: counts.rejected, bg: '#fee2e2', color: '#991b1b' },
          ].map(s => (
            <div key={s.label} style={{ background: s.bg, borderRadius: 16, padding: '16px 18px', border: '1px solid rgba(0,0,0,0.05)' }}>
              <p style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 32, fontWeight: 600, color: s.color, lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontSize: 12, color: s.color, opacity: 0.7, marginTop: 4 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filter + Refresh */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          {['all', 'pending', 'approved', 'rejected'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '7px 18px', borderRadius: 999, fontSize: 13, fontWeight: 500,
              cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
              background: filter === f ? '#0d0d0d' : '#fff',
              color: filter === f ? '#faf8f5' : '#6b6b6b',
              border: `1px solid ${filter === f ? '#0d0d0d' : '#e8e4de'}`,
              textTransform: 'capitalize',
            }}>
              {f} ({counts[f] ?? 0})
            </button>
          ))}
          <button onClick={loadMentors} style={{ padding: '7px 16px', borderRadius: 999, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', background: '#faf8f5', border: '1px solid #e8e4de', color: '#6b6b6b', marginLeft: 'auto' }}>
            🔄 Refresh
          </button>
        </div>

        {/* Mentor List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <svg className="spinner" width="28" height="28" viewBox="0 0 24 24" fill="none" style={{ margin: '0 auto 12px', display: 'block' }}>
              <circle cx="12" cy="12" r="10" stroke="#e8e4de" strokeWidth="3"/>
              <path d="M12 2a10 10 0 0 1 10 10" stroke="#c9a96e" strokeWidth="3" strokeLinecap="round"/>
            </svg>
            <p style={{ fontSize: 14, color: '#9a9a9a' }}>Loading applications...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', background: '#fff', borderRadius: 20, border: '1px solid #e8e4de' }}>
            <p style={{ fontSize: 40, marginBottom: 12 }}>📭</p>
            <p style={{ color: '#9a9a9a', fontSize: 14 }}>No {filter === 'all' ? '' : filter} applications found</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtered.map(m => {
              const st = STATUS_STYLE[m.verificationStatus] || (m.verified ? STATUS_STYLE.approved : STATUS_STYLE.pending)
              return (
                <div key={m.uid} style={{ background: '#fff', borderRadius: 18, border: '1px solid #e8e4de', padding: '18px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14, transition: 'box-shadow 0.2s' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    {m.photo
                      ? <img src={m.photo} style={{ width: 44, height: 44, borderRadius: 13, objectFit: 'cover' }} alt="" />
                      : <div style={{ width: 44, height: 44, borderRadius: 13, background: '#0d0d0d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ color: '#c9a96e', fontSize: 18, fontFamily: "'Cormorant Garamond',Georgia,serif", fontWeight: 600 }}>{m.name?.charAt(0)}</span>
                        </div>
                    }
                    <div>
                      <p style={{ fontWeight: 600, fontSize: 14, color: '#0d0d0d', marginBottom: 2 }}>{m.name}</p>
                      <p style={{ fontSize: 12, color: '#8a8a8a' }}>{m.email}</p>
                      <p style={{ fontSize: 12, color: '#9a9a9a', marginTop: 2 }}>
                        {m.college || '—'} · {m.branch || '—'} · {m.percentile ? `${m.percentile}%ile` : '—'}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 11, fontWeight: 500, padding: '4px 12px', borderRadius: 999, background: st.bg, color: st.color }}>{st.label}</span>
                    {m.docURL && (
                      <a href={m.docURL} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, padding: '6px 14px', borderRadius: 999, background: '#faf8f5', border: '1px solid #e8e4de', color: '#6b6b6b', textDecoration: 'none', fontWeight: 500 }}>
                        📄 View Doc
                      </a>
                    )}
                    {(m.verificationStatus === 'pending' || (!m.verificationStatus && !m.verified)) && (
                      <button onClick={() => setSelected(m)} style={{ fontSize: 12, padding: '6px 16px', borderRadius: 999, background: '#0d0d0d', color: '#faf8f5', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 }}>
                        Review →
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {selected && (
        <div onClick={e => e.target === e.currentTarget && setSelected(null)} style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: '#fff', borderRadius: 28, width: '100%', maxWidth: 460, boxShadow: '0 24px 64px rgba(0,0,0,0.15)', border: '1px solid #e8e4de', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #f0ede8', background: '#faf8f5' }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 22, fontWeight: 600 }}>Review Application</h2>
              <button onClick={() => setSelected(null)} style={{ width: 32, height: 32, borderRadius: '50%', background: '#e8e4de', border: 'none', cursor: 'pointer', fontSize: 18, color: '#6b6b6b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
            </div>
            <div style={{ padding: '22px 24px' }}>
              <div style={{ background: '#faf8f5', borderRadius: 14, padding: '14px 16px', marginBottom: 16 }}>
                <p style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{selected.name}</p>
                <p style={{ fontSize: 13, color: '#6b6b6b' }}>{selected.email}</p>
                <p style={{ fontSize: 13, color: '#8a8a8a', marginTop: 4 }}>{selected.college} · {selected.branch} · {selected.percentile}%ile · {selected.exam}</p>
                {selected.bio && <p style={{ fontSize: 12, color: '#9a9a9a', marginTop: 6, fontStyle: 'italic' }}>"{selected.bio}"</p>}
                {selected.docType && <p style={{ fontSize: 12, color: '#c9a96e', marginTop: 6, fontWeight: 500 }}>Document type: {selected.docType.replace('_', ' ')}</p>}
              </div>

              {selected.docURL ? (
                <div style={{ marginBottom: 16 }}>
                  <p style={{ fontSize: 12, fontWeight: 500, color: '#6b6b6b', marginBottom: 8 }}>Submitted Document:</p>
                  {selected.docFileName?.endsWith('.pdf') ? (
                    <a href={selected.docURL} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: '#faf8f5', border: '1px solid #e8e4de', borderRadius: 12, textDecoration: 'none' }}>
                      <span style={{ fontSize: 28 }}>📄</span>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 500, color: '#0d0d0d' }}>{selected.docFileName}</p>
                        <p style={{ fontSize: 11, color: '#9a9a9a' }}>Click to open PDF</p>
                      </div>
                    </a>
                  ) : (
                    <a href={selected.docURL} target="_blank" rel="noopener noreferrer">
                      <img src={selected.docURL} alt="document" style={{ width: '100%', borderRadius: 12, border: '1px solid #e8e4de', maxHeight: 200, objectFit: 'contain', background: '#f0ede8' }} />
                    </a>
                  )}
                </div>
              ) : (
                <div style={{ background: '#fef3c7', borderRadius: 12, padding: '12px 14px', marginBottom: 16, fontSize: 13, color: '#92400e' }}>⚠️ No document uploaded yet</div>
              )}

              <div style={{ marginBottom: 18 }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: '#6b6b6b', display: 'block', marginBottom: 6 }}>Rejection reason (fill only if rejecting):</label>
                <input value={rejReason} onChange={e => setRejReason(e.target.value)} placeholder="e.g. Document not clearly visible" style={{ width: '100%', padding: '10px 14px', border: '1px solid #e8e4de', borderRadius: 10, fontSize: 13, outline: 'none', background: '#faf8f5', fontFamily: 'inherit', color: '#0d0d0d' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <button onClick={() => handleReject(selected.uid)} disabled={actionLoading} style={{ padding: '13px 0', background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca', borderRadius: 14, fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', opacity: actionLoading ? 0.6 : 1 }}>
                  ❌ Reject
                </button>
                <button onClick={() => handleApprove(selected.uid)} disabled={actionLoading} style={{ padding: '13px 0', background: '#0d0d0d', color: '#faf8f5', border: 'none', borderRadius: 14, fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', opacity: actionLoading ? 0.6 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  {actionLoading ? '...' : '✅ Approve'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
