import { auth } from '@/lib/firebase'
import {
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth'

export interface LoginPayload {
  email: string
  password: string
}

export async function login({ email, password }: LoginPayload): Promise<User> {
  const credential = await signInWithEmailAndPassword(auth, email, password)
  return credential.user
}

export function logout(): Promise<void> {
  return signOut(auth)
}
