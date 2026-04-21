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
      const res = await fetch('/api/gemini', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: msg }) })
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
        position: 'fixed', bottom: 28, right: 28, zIndex: 50,
        width: 58, height: 58, borderRadius: '50%',
        background: open ? '#1a1a1a' : 'linear-gradient(135deg, #0d0d0d, #2a2a2a)',
        border: '1px solid rgba(201,169,110,0.3)',
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(201,169,110,0.1)',
        transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
        transform: open ? 'rotate(90deg) scale(0.95)' : 'scale(1)',
      }}>
        {open
          ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        }
      </button>

      {/* Chat Window */}
      <div style={{
        position: 'fixed', bottom: 98, right: 28, zIndex: 50,
        width: 368, maxWidth: 'calc(100vw - 32px)', height: 520,
        background: '#fff', borderRadius: 28,
        border: '1px solid #e8e4de',
        boxShadow: '0 24px 80px rgba(0,0,0,0.12), 0 0 0 1px rgba(201,169,110,0.08)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        opacity: open ? 1 : 0,
        transform: open ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.96)',
        pointerEvents: open ? 'all' : 'none',
        transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
        transformOrigin: 'bottom right',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '18px 20px', borderBottom: '1px solid #f0ede8', flexShrink: 0, background: '#faf8f5' }}>
          <div style={{ width: 38, height: 38, background: '#0d0d0d', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ color: '#c9a96e', fontSize: 16, fontFamily: "'Cormorant Garamond',Georgia,serif", fontWeight: 600 }}>AI</span>
          </div>
          <div>
            <p style={{ fontWeight: 600, fontSize: 14, color: '#0d0d0d', fontFamily: "'Outfit',sans-serif" }}>AI College Guide</p>
            <p style={{ fontSize: 12, color: '#22c55e', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 6px #22c55e' }} /> Online
            </p>
          </div>
          <div style={{ marginLeft: 'auto', fontSize: 11, color: '#c9a96e', fontWeight: 500, background: 'rgba(201,169,110,0.1)', padding: '3px 10px', borderRadius: 999, border: '1px solid rgba(201,169,110,0.2)' }}>
            LLaMA 3.1
          </div>
        </div>

        {/* Messages */}
        <div className="chat-scroll" style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 12, background: '#faf8f5' }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '85%', padding: '10px 15px',
                borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                background: msg.role === 'user' ? '#0d0d0d' : '#fff',
                color: msg.role === 'user' ? '#faf8f5' : '#0d0d0d',
                fontSize: 13.5, lineHeight: 1.65, whiteSpace: 'pre-wrap',
                border: msg.role === 'assistant' ? '1px solid #e8e4de' : 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              }}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{ background: '#fff', padding: '12px 16px', borderRadius: '18px 18px 18px 4px', display: 'flex', gap: 4, alignItems: 'center', border: '1px solid #e8e4de' }}>
                {[0,1,2].map(i => <span key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#c9a96e', display: 'inline-block', animation: 'bounce 1s ease infinite', animationDelay: `${i*0.15}s` }} />)}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggestions */}
        {messages.length === 1 && (
          <div style={{ padding: '0 14px 8px', display: 'flex', gap: 7, overflowX: 'auto', flexShrink: 0, background: '#faf8f5' }}>
            {SUGGESTIONS.map((s, i) => (
              <button key={i} onClick={() => send(s)} style={{ fontSize: 11, color: '#6b6b6b', border: '1px solid #e8e4de', borderRadius: 999, padding: '6px 13px', background: '#fff', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, fontFamily: 'inherit', transition: 'all 0.2s' }}>{s}</button>
            ))}
          </div>
        )}

        {/* Input */}
        <div style={{ padding: '12px 14px', borderTop: '1px solid #e8e4de', display: 'flex', gap: 8, flexShrink: 0, background: '#fff' }}>
          <input ref={inputRef} type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Ask about colleges..." style={{ flex: 1, background: '#faf8f5', border: '1px solid #e8e4de', borderRadius: 14, padding: '10px 15px', fontSize: 13.5, outline: 'none', fontFamily: 'inherit', color: '#0d0d0d', transition: 'border 0.2s' }} />
          <button onClick={() => send()} disabled={!input.trim() || loading} style={{ width: 40, height: 40, borderRadius: 12, background: '#0d0d0d', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: (!input.trim() || loading) ? 0.3 : 1, flexShrink: 0, transition: 'opacity 0.2s' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>
      </div>
    </>
  )
}
