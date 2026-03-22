"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export function useAuth() {
  const router = useRouter()

  // Lazy initializer runs once synchronously on mount — no setState inside effect
  const [ready] = useState(() => {
    if (typeof window === "undefined") return false
    return !!localStorage.getItem("token")
  })

  // Effect is now only responsible for the redirect — correct usage
  useEffect(() => {
    if (!ready) {
      router.replace("/login")
    }
  }, [ready, router])

  return { ready }
}