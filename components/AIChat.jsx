'use client'
import { useState, useRef, useEffect } from 'react'

const SUGGESTIONS = [
  'Best CS colleges for 95 percentile?',
  'Colleges in Pune for 85 percentile',
  'Compare COEP vs VJTI',
  'IIT Bombay CSE cutoff?',
]

export default function AIChat() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm your MargaDarshak AI. Ask me anything about colleges, cutoffs, or JEE/CET guidance. 🎓" }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, loading])
  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 300) }, [open])

  const send = async (text) => {
    const msg = (text || input).trim()
    if (!msg || loading) return
    setInput('')
    const updated = [...messages, { role: 'user', content: msg }]
    setMessages(updated)
    setLoading(true)
    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply || 'Could not get a response.' }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Something went wrong. Please try again.' }])
    } finally { setLoading(false) }
  }

  return (
    <>
      {/* Toggle Button */}
      <button onClick={() => setOpen(!open)} aria-label="Toggle AI Chat" style={{
        position: 'fixed', bottom: 24, right: 24, zIndex: 50,
        width: 56, height: 56, borderRadius: '50%', background: '#0a0a0a',
        border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
        transition: 'transform 0.3s, background 0.2s',
        transform: open ? 'rotate(90deg)' : 'none',
      }}>
        {open
          ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        }
      </button>

      {/* Chat window */}
      <div style={{
        position: 'fixed', bottom: 92, right: 24, zIndex: 50,
        width: 360, maxWidth: 'calc(100vw - 32px)', height: 500,
        background: '#fff', borderRadius: 24, border: '1px solid #e5e7eb',
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        opacity: open ? 1 : 0,
        transform: open ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.96)',
        pointerEvents: open ? 'all' : 'none',
        transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
        transformOrigin: 'bottom right',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', borderBottom: '1px solid #f3f4f6', flexShrink: 0 }}>
          <div style={{ width: 36, height: 36, background: '#0a0a0a', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>
          </div>
          <div>
            <p style={{ fontWeight: 600, fontSize: 14 }}>AI College Guide</p>
            <p style={{ fontSize: 12, color: '#22c55e', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} /> Online
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="chat-scroll" style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '85%', padding: '10px 14px',
                borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                background: msg.role === 'user' ? '#0a0a0a' : '#f3f4f6',
                color: msg.role === 'user' ? '#fff' : '#0a0a0a',
                fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap',
              }}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{ background: '#f3f4f6', padding: '12px 16px', borderRadius: '18px 18px 18px 4px', display: 'flex', gap: 4, alignItems: 'center' }}>
                {[0, 1, 2].map(i => <span key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#9ca3af', display: 'inline-block', animation: 'bounce 1s ease infinite', animationDelay: `${i * 0.15}s` }} />)}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggestions */}
        {messages.length === 1 && (
          <div style={{ padding: '0 16px 8px', display: 'flex', gap: 8, overflowX: 'auto', flexShrink: 0 }}>
            {SUGGESTIONS.map((s, i) => (
              <button key={i} onClick={() => send(s)} style={{ fontSize: 12, color: '#374151', border: '1px solid #e5e7eb', borderRadius: 999, padding: '6px 12px', background: '#fff', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, fontFamily: 'inherit' }}>{s}</button>
            ))}
          </div>
        )}

        {/* Input */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid #f3f4f6', display: 'flex', gap: 8, flexShrink: 0 }}>
          <input ref={inputRef} type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Ask about colleges..." style={{ flex: 1, background: '#f3f4f6', border: 'none', borderRadius: 12, padding: '10px 16px', fontSize: 14, outline: 'none', fontFamily: 'inherit' }} />
          <button onClick={() => send()} disabled={!input.trim() || loading} style={{ width: 38, height: 38, borderRadius: 10, background: '#0a0a0a', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: (!input.trim() || loading) ? 0.3 : 1, flexShrink: 0, transition: 'opacity 0.2s' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>
      </div>
    </>
  )
}
