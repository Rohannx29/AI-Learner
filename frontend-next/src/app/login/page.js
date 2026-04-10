"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { authApi } from "@/lib/api"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const registered = searchParams.get("registered")

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

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
    <main className="relative flex min-h-screen items-center justify-center bg-[#0f172a] text-white overflow-hidden">

      {/* BACKGROUND GLOW */}
      <div className="absolute w-[400px] h-[400px] bg-purple-600/20 blur-[120px] rounded-full top-10 left-10" />
      <div className="absolute w-[300px] h-[300px] bg-cyan-500/20 blur-[120px] rounded-full bottom-10 right-10" />

      {/* CARD */}
      <div className="relative z-10 w-full max-w-md p-8 rounded-2xl 
        bg-[#020617]/70 backdrop-blur-xl border border-[#1e293b] shadow-xl">

        {/* TITLE */}
        <h2 className="text-2xl font-semibold mb-2">
          Welcome back
        </h2>
        <p className="text-sm text-gray-400 mb-6">
          Login to continue your learning journey
        </p>

        {/* SUCCESS MESSAGE */}
        {registered && (
          <div className="mb-4 px-3 py-2 rounded-lg 
            bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
            Account created — please log in.
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="mb-4 px-3 py-2 rounded-lg 
            bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* INPUTS */}
        <div className="space-y-4">

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full px-4 py-3 rounded-xl 
            bg-[#020617] border border-[#334155] 
            text-white placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-purple-500 
            transition-all"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full px-4 py-3 rounded-xl 
            bg-[#020617] border border-[#334155] 
            text-white placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-purple-500 
            transition-all"
          />

        </div>

        {/* BUTTON */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full mt-6 py-3 rounded-xl font-medium
          bg-gradient-to-r from-purple-600 to-cyan-500
          hover:scale-105 hover:shadow-lg active:scale-95
          disabled:opacity-40 transition-all"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* FOOTER */}
        <p className="text-sm text-center text-gray-400 mt-6">
          Don’t have an account?{" "}
          <span
            onClick={() => router.push("/signup")}
            className="text-purple-400 hover:underline cursor-pointer"
          >
            Sign up
          </span>
        </p>

      </div>
    </main>
  )
}