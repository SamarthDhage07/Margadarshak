import { signInWithPopup, signOut } from 'firebase/auth'
import { auth, googleProvider, db } from './firebase'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'

export async function signInWithGoogle(role) {
  const result = await signInWithPopup(auth, googleProvider)
  const user = result.user
  const ref = doc(db, 'users', user.uid)
  const snap = await getDoc(ref)
  if (!snap.exists()) {
    await setDoc(ref, {
      name: user.displayName,
      email: user.email,
      photo: user.photoURL,
      role,
      available: true,
      createdAt: serverTimestamp(),
    })
  }
  return { user, role: snap.exists() ? snap.data().role : role }
}

export async function logout() {
  await signOut(auth)
}

export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, 'users', uid))
  return snap.exists() ? { uid, ...snap.data() } : null
}
