import { db } from './firebase'
import {
  collection, addDoc, getDocs, query,
  where, doc, updateDoc, serverTimestamp, getDoc
} from 'firebase/firestore'

// Get all VERIFIED mentors only
export async function getMentors() {
  const q = query(
    collection(db, 'users'),
    where('role', '==', 'mentor'),
    where('verified', '==', true)
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ uid: d.id, ...d.data() }))
}

// Get all mentors for admin (verified + pending)
export async function getAllMentorsForAdmin() {
  const q = query(collection(db, 'users'), where('role', '==', 'mentor'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ uid: d.id, ...d.data() }))
}

// Get mentor email by uid
export async function getMentorEmail(uid) {
  const snap = await getDoc(doc(db, 'users', uid))
  return snap.exists() ? snap.data().email : null
}

// Book a session
export async function bookSession(data) {
  return addDoc(collection(db, 'bookings'), {
    ...data, status: 'pending', createdAt: serverTimestamp(),
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

// Submit mentor verification request
export async function submitVerificationRequest(uid, data) {
  return updateDoc(doc(db, 'users', uid), {
    ...data,
    verified: false,
    verificationStatus: 'pending',
    verificationSubmittedAt: serverTimestamp(),
  })
}

// Admin: approve mentor
export async function approveMentor(uid) {
  return updateDoc(doc(db, 'users', uid), {
    verified: true,
    verificationStatus: 'approved',
    verifiedAt: serverTimestamp(),
  })
}

// Admin: reject mentor
export async function rejectMentor(uid, reason) {
  return updateDoc(doc(db, 'users', uid), {
    verified: false,
    verificationStatus: 'rejected',
    rejectionReason: reason || 'Document not valid',
    rejectedAt: serverTimestamp(),
  })
}
