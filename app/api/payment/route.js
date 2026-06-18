import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const Razorpay = (await import('razorpay')).default

    const razorpay = new Razorpay({
      key_id:     process.env.RAZORPAY_KEY_ID     || 'placeholder',
      key_secret: process.env.RAZORPAY_KEY_SECRET || 'placeholder',
    })

    const { amount, currency = 'INR', receipt } = await req.json()

    const order = await razorpay.orders.create({
      amount:   amount * 100,
      currency,
      receipt,
    })

    return NextResponse.json({ orderId: order.id, amount: order.amount, currency: order.currency })
  } catch (err) {
    console.error('Razorpay order error:', err)
    return NextResponse.json({ error: 'Payment initiation failed' }, { status: 500 })
  }
}
