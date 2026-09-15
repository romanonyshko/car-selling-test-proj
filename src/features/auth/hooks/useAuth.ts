import { useContext } from 'react'
import { AuthContext } from '../model/authContext'

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth має викликатись усередині <AuthProvider>')
  }
  return context
}
