import { db } from './firebase'
import { collection, doc, setDoc, getDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore'

export const ALL_TIMES = [
  '09:00 AM','09:30 AM','10:00 AM','10:30 AM',
  '11:00 AM','11:30 AM','12:00 PM','12:30 PM',
  '02:00 PM','02:30 PM','03:00 PM','03:30 PM',
  '04:00 PM','04:30 PM','05:00 PM','05:30 PM',
  '06:00 PM','06:30 PM','07:00 PM','07:30 PM',
  '08:00 PM','08:30 PM',
]

export async function saveMentorAvailability(mentorId, availability) {
  return setDoc(doc(db, 'availability', mentorId), {
    mentorId, availability, updatedAt: serverTimestamp(),
  })
}

export async function getMentorAvailability(mentorId) {
  const snap = await getDoc(doc(db, 'availability', mentorId))
  return snap.exists() ? snap.data().availability : {}
}

export async function getBookedSlots(mentorId, date) {
  const q = query(
    collection(db, 'bookings'),
    where('mentorId', '==', mentorId),
    where('date', '==', date)
  )
  const snap = await getDocs(q)
  // Filter out cancelled bookings on client side
  return snap.docs
    .filter(d => d.data().status !== 'cancelled')
    .map(d => d.data().time)
}

export async function getAvailableSlots(mentorId, date) {
  if (!mentorId || !date) return []
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
  const dayName = days[new Date(date).getDay()]
  const availability = await getMentorAvailability(mentorId)
  const daySlots = availability[dayName] || []
  if (daySlots.length === 0) return []
  const booked = await getBookedSlots(mentorId, date)
  return daySlots.filter(slot => !booked.includes(slot))
}
