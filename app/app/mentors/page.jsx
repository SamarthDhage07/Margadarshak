'use client'
import { useState, useEffect, useMemo } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import MentorCard from '@/components/MentorCard'
import AIChat from '@/components/AIChat'
import { getMentors } from '@/lib/firestore'

// Fallback sample mentors for demo / when Firestore is empty
const SAMPLE_MENTORS = [
  { uid: 's1', name: 'Aryan Kulkarni', college: 'COEP Pune', branch: 'Computer Science', percentile: '99.4', exam: 'MHT-CET', bio: 'Final year CS student. Happy to guide on COEP admissions, cutoffs, and college life.', available: true },
  { uid: 's2', name: 'Sneha Patil', college: 'VJTI Mumbai', branch: 'Electronics', percentile: '98.7', exam: 'MHT-CET', bio: 'Secured ECE at VJTI. Can help with Mumbai college options and hostel queries.', available: true },
  { uid: 's3', name: 'Rahul Sharma', college: 'IIT Bombay', branch: 'Computer Science', percentile: '99.9', exam: 'JEE Advanced', bio: 'JEE AIR 312. Ready to discuss JEE strategy, IIT life, and branch selection.', available: true },
  { uid: 's4', name: 'Priya Mehta', college: 'MIT Pune', branch: 'IT', percentile: '97.2', exam: 'MHT-CET', bio: 'MIT Pune IT student. Can guide on MITAOE vs MIT Pune comparison.', available: true },
  { uid: 's5', name: 'Karthik Nair', college: 'NIT Trichy', branch: 'Computer Science', percentile: '98.1', exam: 'JEE Mains', bio: 'NIT Trichy CSE. Expert in JoSAA counselling and branch upgrade strategies.', available: true },
  { uid: 's6', name: 'Anjali Desai', college: 'PICT Pune', branch: 'Computer Science', percentile: '95.8', exam: 'MHT-CET', bio: 'PICT 3rd year CS. Can clarify doubts about PICT placements and environment.', available: true },
  { uid: 's7', name: 'Vikram Singh', college: 'IIT Delhi', branch: 'Mechanical', percentile: '99.7', exam: 'JEE Advanced', bio: 'IIT Delhi Mech, placed at Bain & Co. Discuss IIT placements and MBA paths.', available: false },
  { uid: 's8', name: 'Rutuja Bhosale', college: 'SPIT Mumbai', branch: 'Electronics', percentile: '94.5', exam: 'MHT-CET', bio: 'SPIT ECE. Helps with Mumbai autonomous college options in 90-96 percentile range.', available: true },
  { uid: 's9', name: 'Aditya Joshi', college: 'IIIT Hyderabad', branch: 'Computer Science', percentile: '99.2', exam: 'JEE Mains', bio: 'IIIT-H CSD. Guidance on IIIT admissions through JEE and UGEE exam.', available: true },
  { uid: 's10', name: 'Meera Iyer', college: 'Symbiosis Pune', branch: 'IT', percentile: '88.3', exam: 'MHT-CET', bio: 'Can guide students with 80-92 percentile to find good private colleges in Pune.', available: true },
  { uid: 's11', name: 'Ishaan Verma', college: 'BITS Pilani', branch: 'Computer Science', percentile: '99.6', exam: 'BITSAT', bio: 'BITS CS with dual degree. Guidance on BITSAT prep and BITS vs IIT comparison.', available: true },
  { uid: 's12', name: 'Shubham Gaikwad', college: 'GCEK Karad', branch: 'Civil', percentile: '82.6', exam: 'MHT-CET', bio: 'Government college with great civil infra. Helping peers with tier-2 choices.', available: true },
]

const BRANCHES = ['All', 'Computer Science', 'IT', 'Electronics', 'Mechanical', 'Civil']
const EXAMS = ['All', 'MHT-CET', 'JEE Mains', 'JEE Advanced', 'BITSAT']

const selStyle = { padding: '10px 16px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, fontSize: 14, outline: 'none', cursor: 'pointer', color: '#374151', fontFamily: 'inherit' }

export default function MentorsPage() {
  const [mentors, setMentors] = useState([])
  const [loadingMentors, setLoadingMentors] = useState(true)
  const [search, setSearch] = useState('')
  const [branch, setBranch] = useState('All')
  const [exam, setExam] = useState('All')

  useEffect(() => {
    async function load() {
      try {
        const data = await getMentors()
        // Merge real mentors with sample (real ones first, deduplicated)
        const realIds = new Set(data.map(m => m.uid))
        const combined = [...data, ...SAMPLE_MENTORS.filter(s => !realIds.has(s.uid))]
        setMentors(combined)
      } catch (e) {
        console.error(e)
        setMentors(SAMPLE_MENTORS)
      }
      setLoadingMentors(false)
    }
    load()
  }, [])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return mentors.filter(m => {
      const matchSearch = !q || m.name?.toLowerCase().includes(q) || m.college?.toLowerCase().includes(q) || m.branch?.toLowerCase().includes(q)
      return matchSearch && (branch === 'All' || m.branch === branch) && (exam === 'All' || m.exam === exam)
    })
  }, [mentors, search, branch, exam])

  return (
    <main style={{ minHeight: '100vh', background: '#fafafa' }}>
      <Navbar />

      {/* Header */}
      <section style={{ padding: '120px 24px 48px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <p className="fade-up" style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#9ca3af', marginBottom: 12 }}>Real People. Real Colleges.</p>
          <h1 className="fade-up d1" style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 'clamp(40px,7vw,64px)', fontWeight: 700, color: '#0a0a0a', marginBottom: 12 }}>Find Your Mentor</h1>
          <p className="fade-up d2" style={{ fontSize: 17, color: '#6b7280', maxWidth: 480 }}>Connect with students from your dream college. Book a free session and get clarity.</p>
        </div>
      </section>

      {/* Sticky filters */}
      <div style={{ position: 'sticky', top: 64, zIndex: 30, background: 'rgba(250,250,250,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #f3f4f6', padding: '12px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
            <svg style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" placeholder="Search by name, college, or branch..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...selStyle, width: '100%', paddingLeft: 40 }} />
          </div>
          <select value={branch} onChange={e => setBranch(e.target.value)} style={selStyle}>{BRANCHES.map(b => <option key={b}>{b}</option>)}</select>
          <select value={exam} onChange={e => setExam(e.target.value)} style={selStyle}>{EXAMS.map(e => <option key={e}>{e}</option>)}</select>
        </div>
      </div>

      {/* Results */}
      <section style={{ padding: '32px 24px 80px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <p style={{ fontSize: 13, color: '#9ca3af', marginBottom: 24 }}>
            {loadingMentors ? 'Loading...' : `${filtered.length} mentor${filtered.length !== 1 ? 's' : ''} found`}
          </p>

          {loadingMentors ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 20 }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: 20, padding: 24, border: '1px solid #f3f4f6', height: 220, animation: 'pulse 1.5s ease infinite', opacity: 0.7 }} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <p style={{ fontSize: 40, marginBottom: 12 }}>🔍</p>
              <p style={{ fontWeight: 500, color: '#374151', marginBottom: 8 }}>No mentors found</p>
              <button onClick={() => { setSearch(''); setBranch('All'); setExam('All') }} style={{ fontSize: 14, color: '#0a0a0a', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'inherit' }}>Clear filters</button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 20 }}>
              {filtered.map(mentor => <MentorCard key={mentor.uid} mentor={mentor} />)}
            </div>
          )}
        </div>
      </section>

      <Footer />
      <AIChat />
      <style>{`@keyframes pulse { 0%,100%{opacity:0.7} 50%{opacity:0.4} }`}</style>
    </main>
  )
}
