'use client'
import { useState } from 'react'
import { submitVerificationRequest } from '@/lib/firestore'

const BRANCHES  = ['Computer Science', 'IT', 'Electronics', 'Mechanical', 'Civil', 'Other']
const EXAMS     = ['MHT-CET', 'JEE Mains', 'JEE Advanced', 'BITSAT', 'Other']
const DOC_TYPES = [
  { id: 'college_id',  label: 'College ID Card',      icon: '🪪' },
  { id: 'admission',   label: 'Admission Letter',      icon: '📄' },
  { id: 'fee_receipt', label: 'Fee Receipt',           icon: '🧾' },
  { id: 'marksheet',   label: 'Marksheet / Result',    icon: '📊' },
  { id: 'bonafide',    label: 'Bonafide Certificate',  icon: '📜' },
]

export default function MentorVerification({ user, onComplete }) {
  const [step, setStep]         = useState(1)
  const [form, setForm]         = useState({ college: '', branch: '', percentile: '', exam: '', bio: '', docType: '' })
  const [file, setFile]         = useState(null)
  const [preview, setPreview]   = useState(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress]   = useState(0)
  const [errors, setErrors]       = useState({})

  const validateStep1 = () => {
    const e = {}
    if (!form.college.trim())    e.college    = 'Required'
    if (!form.branch)            e.branch     = 'Required'
    if (!form.percentile.trim()) e.percentile = 'Required'
    if (!form.exam)              e.exam       = 'Required'
    return e
  }

  const validateStep2 = () => {
    const e = {}
    if (!form.docType) e.docType = 'Please select document type'
    if (!file)         e.file    = 'Please upload a document'
    return e
  }

  const handleFileChange = (e) => {
    const f = e.target.files[0]
    if (!f) return
    if (f.size > 5 * 1024 * 1024) { setErrors({ file: 'File must be under 5MB' }); return }
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
    if (!allowed.includes(f.type)) { setErrors({ file: 'Only JPG, PNG, WEBP or PDF allowed' }); return }
    setFile(f)
    setErrors({})
    if (f.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (ev) => setPreview(ev.target.result)
      reader.readAsDataURL(f)
    } else {
      setPreview('pdf')
    }
  }

  const handleSubmit = async () => {
    const errs = validateStep2()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setUploading(true)
    setProgress(20)

    try {
      // Upload via our API route → Cloudinary
      const uploadForm = new FormData()
      uploadForm.append('file', file)
      uploadForm.append('userId', user.uid)

      setProgress(50)

      const res = await fetch('/api/upload', { method: 'POST', body: uploadForm })
      const data = await res.json()

      if (!res.ok || !data.url) throw new Error(data.error || 'Upload failed')

      setProgress(80)

      // Save to Firestore
      await submitVerificationRequest(user.uid, {
        college:     form.college,
        branch:      form.branch,
        percentile:  form.percentile,
        exam:        form.exam,
        bio:         form.bio,
        docType:     form.docType,
        docURL:      data.url,
        docFileName: file.name,
      })

      setProgress(100)
      setStep(3)
    } catch (err) {
      console.error(err)
      setErrors({ file: err.message || 'Upload failed. Please try again.' })
    } finally {
      setUploading(false)
    }
  }

  const inp = (field) => ({
    width: '100%', padding: '12px 16px',
    border: `1px solid ${errors[field] ? '#fca5a5' : '#e8e4de'}`,
    borderRadius: 12, fontSize: 14, outline: 'none',
    background: '#faf8f5', fontFamily: 'inherit',
    color: '#0d0d0d', transition: 'border 0.2s',
  })

  return (
    <div style={{ background: '#fff', borderRadius: 28, border: '1px solid #e8e4de', overflow: 'hidden' }}>

      {/* Progress Steps */}
      <div style={{ background: '#faf8f5', borderBottom: '1px solid #e8e4de', padding: '20px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', maxWidth: 320, margin: '0 auto' }}>
          {[1, 2, 3].map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < 2 ? 1 : 'none' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0, background: step >= s ? '#0d0d0d' : '#e8e4de', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}>
                {step > s
                  ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  : <span style={{ fontSize: 12, fontWeight: 600, color: step >= s ? '#c9a96e' : '#9a9a9a' }}>{s}</span>
                }
              </div>
              {i < 2 && <div style={{ flex: 1, height: 1, background: step > s ? '#0d0d0d' : '#e8e4de', margin: '0 4px', transition: 'background 0.3s' }} />}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: 320, margin: '8px auto 0' }}>
          {['Profile', 'Documents', 'Done'].map((l, i) => (
            <span key={l} style={{ fontSize: 11, fontWeight: step === i + 1 ? 600 : 400, color: step === i + 1 ? '#0d0d0d' : '#9a9a9a', flex: 1, textAlign: i === 0 ? 'left' : i === 1 ? 'center' : 'right' }}>{l}</span>
          ))}
        </div>
      </div>

      <div style={{ padding: '28px' }}>

        {/* STEP 1 — Profile */}
        {step === 1 && (
          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 22, fontWeight: 600, marginBottom: 6 }}>Your Profile</h2>
            <p style={{ fontSize: 13, color: '#9a9a9a', marginBottom: 22 }}>Tell students about your college and achievements</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: '#6b6b6b', display: 'block', marginBottom: 6 }}>College Name *</label>
                <input value={form.college} onChange={e => setForm({ ...form, college: e.target.value })} placeholder="e.g. COEP Pune, IIT Bombay" style={inp('college')} />
                {errors.college && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 4 }}>{errors.college}</p>}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 500, color: '#6b6b6b', display: 'block', marginBottom: 6 }}>Branch *</label>
                  <select value={form.branch} onChange={e => setForm({ ...form, branch: e.target.value })} style={{ ...inp('branch'), cursor: 'pointer' }}>
                    <option value="">Select Branch</option>
                    {BRANCHES.map(b => <option key={b}>{b}</option>)}
                  </select>
                  {errors.branch && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 4 }}>{errors.branch}</p>}
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 500, color: '#6b6b6b', display: 'block', marginBottom: 6 }}>Percentile / Rank *</label>
                  <input value={form.percentile} onChange={e => setForm({ ...form, percentile: e.target.value })} placeholder="e.g. 99.2" style={inp('percentile')} />
                  {errors.percentile && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 4 }}>{errors.percentile}</p>}
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: '#6b6b6b', display: 'block', marginBottom: 6 }}>Entrance Exam *</label>
                <select value={form.exam} onChange={e => setForm({ ...form, exam: e.target.value })} style={{ ...inp('exam'), cursor: 'pointer' }}>
                  <option value="">Select Exam</option>
                  {EXAMS.map(e => <option key={e}>{e}</option>)}
                </select>
                {errors.exam && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 4 }}>{errors.exam}</p>}
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: '#6b6b6b', display: 'block', marginBottom: 6 }}>Bio <span style={{ color: '#b0aba4' }}>(optional)</span></label>
                <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} placeholder="Tell students about yourself..." rows={3} style={{ ...inp('bio'), resize: 'none' }} />
              </div>
            </div>

            <button onClick={() => { const e = validateStep1(); if (Object.keys(e).length) { setErrors(e); return } setErrors({}); setStep(2) }} style={{ width: '100%', marginTop: 22, padding: '13px 0', background: '#0d0d0d', color: '#faf8f5', border: 'none', borderRadius: 14, fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
              Continue to Documents →
            </button>
          </div>
        )}

        {/* STEP 2 — Upload */}
        {step === 2 && (
          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 22, fontWeight: 600, marginBottom: 6 }}>Upload Proof</h2>
            <p style={{ fontSize: 13, color: '#9a9a9a', marginBottom: 22 }}>Upload any document proving you're a student of <strong>{form.college}</strong></p>

            {/* Doc type */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 12, fontWeight: 500, color: '#6b6b6b', display: 'block', marginBottom: 10 }}>Document Type *</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {DOC_TYPES.map(dt => (
                  <button key={dt.id} onClick={() => { setForm({ ...form, docType: dt.id }); setErrors({ ...errors, docType: '' }) }} style={{ padding: '10px 12px', borderRadius: 12, textAlign: 'left', cursor: 'pointer', border: `1.5px solid ${form.docType === dt.id ? '#c9a96e' : '#e8e4de'}`, background: form.docType === dt.id ? 'rgba(201,169,110,0.08)' : '#faf8f5', fontFamily: 'inherit', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 16 }}>{dt.icon}</span>
                    <span style={{ fontSize: 12, fontWeight: form.docType === dt.id ? 600 : 400, color: form.docType === dt.id ? '#a07840' : '#6b6b6b' }}>{dt.label}</span>
                  </button>
                ))}
              </div>
              {errors.docType && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 6 }}>{errors.docType}</p>}
            </div>

            {/* File upload */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: '#6b6b6b', display: 'block', marginBottom: 8 }}>Upload Document *</label>
              <label htmlFor="doc-upload" style={{ display: 'block', border: `2px dashed ${errors.file ? '#fca5a5' : file ? '#c9a96e' : '#e8e4de'}`, borderRadius: 16, padding: '28px 20px', textAlign: 'center', cursor: 'pointer', background: file ? 'rgba(201,169,110,0.04)' : '#faf8f5', transition: 'all 0.2s' }}>
                {preview && preview !== 'pdf' ? (
                  <div>
                    <img src={preview} alt="preview" style={{ maxHeight: 150, maxWidth: '100%', borderRadius: 10, marginBottom: 8, objectFit: 'contain' }} />
                    <p style={{ fontSize: 12, color: '#22c55e', fontWeight: 500 }}>✅ {file.name}</p>
                  </div>
                ) : preview === 'pdf' ? (
                  <div>
                    <span style={{ fontSize: 40, display: 'block', marginBottom: 8 }}>📄</span>
                    <p style={{ fontSize: 12, color: '#22c55e', fontWeight: 500 }}>✅ {file.name}</p>
                  </div>
                ) : (
                  <>
                    <span style={{ fontSize: 36, display: 'block', marginBottom: 10 }}>📁</span>
                    <p style={{ fontSize: 14, fontWeight: 500, color: '#0d0d0d', marginBottom: 4 }}>Click to upload document</p>
                    <p style={{ fontSize: 12, color: '#9a9a9a' }}>JPG, PNG, PDF — Max 5MB</p>
                  </>
                )}
                <input id="doc-upload" type="file" accept=".jpg,.jpeg,.png,.webp,.pdf" onChange={handleFileChange} style={{ display: 'none' }} />
              </label>
              {errors.file && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 6 }}>{errors.file}</p>}
            </div>

            {/* Security note */}
            <div style={{ background: 'rgba(201,169,110,0.08)', border: '1px solid rgba(201,169,110,0.2)', borderRadius: 12, padding: '12px 16px', marginTop: 14, fontSize: 13, color: '#a07840' }}>
              🔒 Stored securely on Cloudinary. Only admins can view your document.
            </div>

            {/* Upload progress */}
            {uploading && (
              <div style={{ marginTop: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: '#6b6b6b' }}>Uploading...</span>
                  <span style={{ fontSize: 12, fontWeight: 600 }}>{progress}%</span>
                </div>
                <div style={{ height: 4, background: '#e8e4de', borderRadius: 999 }}>
                  <div style={{ height: '100%', background: 'linear-gradient(90deg, #c9a96e, #e8d5b0)', borderRadius: 999, width: `${progress}%`, transition: 'width 0.4s ease' }} />
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
              <button onClick={() => setStep(1)} style={{ flex: 1, padding: '12px 0', background: '#faf8f5', color: '#6b6b6b', border: '1px solid #e8e4de', borderRadius: 14, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>← Back</button>
              <button onClick={handleSubmit} disabled={uploading} style={{ flex: 2, padding: '12px 0', background: '#0d0d0d', color: '#faf8f5', border: 'none', borderRadius: 14, fontSize: 14, fontWeight: 500, cursor: uploading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: uploading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                {uploading ? <><svg className="spinner" width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.2)" strokeWidth="3"/><path d="M12 2a10 10 0 0 1 10 10" stroke="#c9a96e" strokeWidth="3" strokeLinecap="round"/></svg>Uploading...</> : '🚀 Submit Application'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 — Success */}
        {step === 3 && (
          <div style={{ textAlign: 'center', padding: '12px 0' }}>
            <div style={{ width: 68, height: 68, background: '#0d0d0d', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 24, fontWeight: 600, marginBottom: 8 }}>Application Submitted! 🎉</h2>
            <p style={{ fontSize: 13, color: '#8a8a8a', lineHeight: 1.7, marginBottom: 16, maxWidth: 320, margin: '0 auto 16px' }}>
              Our team will verify your documents within <strong>24–48 hours</strong>.
            </p>
            <div style={{ background: 'rgba(201,169,110,0.08)', border: '1px solid rgba(201,169,110,0.2)', borderRadius: 14, padding: '14px 18px', marginBottom: 16, textAlign: 'left' }}>
              {['✅ Document uploaded securely', "📧 You'll get notified once verified", '🎓 Profile goes live after approval'].map(t => (
                <p key={t} style={{ fontSize: 13, color: '#8a8a8a', marginBottom: 4 }}>{t}</p>
              ))}
            </div>
            <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 12, padding: '10px 14px', marginBottom: 20 }}>
              <p style={{ fontSize: 12, color: '#92400e' }}>⏳ Status: <strong>Pending Verification</strong></p>
            </div>
            {onComplete && (
              <button onClick={onComplete} style={{ width: '100%', padding: '13px 0', background: '#0d0d0d', color: '#faf8f5', border: 'none', borderRadius: 14, fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
                Go to Dashboard
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
