"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { authApi } from "@/lib/api"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const registered = searchParams.get("registered")

  const [email, setEmail]       = useState("")
  const [password, setPassword] = useState("")
  const [error, setError]       = useState("")
  const [loading, setLoading]   = useState(false)

  const handleLogin = async () => {
    if (!email || !password) return

    setLoading(true)
    setError("")

    try {
      const data = await authApi.login(email, password)
      localStorage.setItem("token", data.access_token)
      router.push("/dashboard")
    } catch (err) {
      setError(err.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin()
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow w-96">

        <h2 className="text-2xl font-bold mb-6">Login</h2>

        {registered && (
          <p className="text-green-600 text-sm mb-4 p-2 bg-green-50 rounded">
            Account created — please log in.
          </p>
        )}

        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 mb-4 rounded"
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-6 rounded"
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded disabled:opacity-40"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-sm text-center text-gray-500 mt-4">
          No account?{" "}
          <a href="/signup" className="underline">Sign up</a>
        </p>

      </div>
    </main>
  )
}