import { db } from './firebase'
import {
  collection, addDoc, getDocs, query,
  where, doc, updateDoc, serverTimestamp
} from 'firebase/firestore'

// Get all mentors
export async function getMentors() {
  const q = query(collection(db, 'users'), where('role', '==', 'mentor'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ uid: d.id, ...d.data() }))
}

// Get single mentor email by uid
export async function getMentorEmail(uid) {
  const q = query(collection(db, 'users'), where('role', '==', 'mentor'))
  const snap = await getDocs(q)
  const mentor = snap.docs.find(d => d.id === uid)
  return mentor ? mentor.data().email : null
}

// Book a session — includes meetLink
export async function bookSession(data) {
  return addDoc(collection(db, 'bookings'), {
    ...data,
    status: 'pending',
    createdAt: serverTimestamp(),
  })
}

// Get bookings for a student
export async function getStudentBookings(email) {
  const q = query(collection(db, 'bookings'), where('studentEmail', '==', email))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

// Get bookings for a mentor
export async function getMentorBookings(mentorId) {
  const q = query(collection(db, 'bookings'), where('mentorId', '==', mentorId))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

// Update mentor profile
export async function updateMentorProfile(uid, data) {
  return updateDoc(doc(db, 'users', uid), data)
}
