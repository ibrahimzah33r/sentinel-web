import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { getCurrentUser } from '../api/auth'

type ProtectedRouteProps = {
  children: ReactNode
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    async function checkAuthentication() {
      try {
        await getCurrentUser()
        setAuthenticated(true)
      } catch {
        setAuthenticated(false)
      }
    }

    checkAuthentication()
  }, [])

  if (authenticated === null) {
    return <p>Loading...</p>
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute