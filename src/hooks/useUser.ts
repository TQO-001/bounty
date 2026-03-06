"use client"

import { useState, useEffect } from "react"
import type { User } from "@/types"

interface UseUserResult {
  user: User | null
  loading: boolean
  error: string | null
}

export function useUser(): UseUserResult {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/profile")
      .then(res => {
        if (!res.ok) throw new Error("Not authenticated")
        return res.json()
      })
      .then(data => setUser(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return { user, loading, error }
}
