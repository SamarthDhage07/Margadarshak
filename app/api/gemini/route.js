import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const { message } = await req.json()
    const apiKey = process.env.GROQ_API_KEY

    if (!apiKey) {
      return NextResponse.json({
        reply: "AI is not configured. Please add GROQ_API_KEY to your .env.local file. Get a free key at https://console.groq.com"
      })
    }

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: `You are MargaDarshak AI — a helpful and friendly college guidance assistant for Indian engineering students preparing for JEE and MHT-CET.

Your job is to:
- Help students choose the right college based on their percentile/rank
- Suggest colleges for specific branches (CS, IT, Electronics, Mechanical, Civil)
- Compare colleges (COEP vs VJTI, IIT vs NIT, etc.)
- Explain cutoffs, counselling processes (JoSAA, CAP rounds)
- Give career guidance for different branches

Focus on Maharashtra colleges: COEP, VJTI, PICT, MIT Pune, SPIT, RAIT, etc.
Also cover IITs, NITs, BITS Pilani when relevant.

Keep answers concise (under 200 words), use bullet points for lists.
Be encouraging and student-friendly.`
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 400,
      })
    })

    if (!res.ok) {
      const err = await res.json()
      console.error('Groq error:', err)
      return NextResponse.json({ reply: 'AI is temporarily unavailable. Please try again.' })
    }

    const data = await res.json()
    const reply = data.choices?.[0]?.message?.content || 'Could not generate a response.'
    return NextResponse.json({ reply })

  } catch (err) {
    console.error('API route error:', err)
    return NextResponse.json({ reply: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
