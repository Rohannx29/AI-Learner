"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { authApi } from "@/lib/api"

const PASSWORD_MIN_LENGTH = 8

function validate(email, password, confirm) {
  const errors = {}

  if (!email.trim()) {
    errors.email = "Email is required"
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.email = "Enter a valid email address"
  }

  if (!password) {
    errors.password = "Password is required"
  } else if (password.length < PASSWORD_MIN_LENGTH) {
    errors.password = `Minimum ${PASSWORD_MIN_LENGTH} characters required`
  }

  if (!confirm) {
    errors.confirm = "Please confirm your password"
  } else if (password !== confirm) {
    errors.confirm = "Passwords do not match"
  }

  return errors
}

export default function SignupPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSignup = async () => {
    const validationErrors = validate(email, password, confirm)

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setErrors({})
    setApiError("")
    setLoading(true)

    try {
      const normalizedEmail = email.trim().toLowerCase()

      await authApi.signup(normalizedEmail, password)

      // auto login
      const data = await authApi.login(normalizedEmail, password)
      localStorage.setItem("token", data.access_token)

      router.push("/dashboard")
    } catch (err) {
      setApiError(err.message || "Signup failed")
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSignup()
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
          Create account
        </h2>
        <p className="text-sm text-gray-400 mb-6">
          Start your AI-powered learning journey
        </p>

        {/* API ERROR */}
        {apiError && (
          <div className="mb-4 px-3 py-2 rounded-lg 
            bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {apiError}
          </div>
        )}

        {/* INPUTS */}
        <div className="space-y-4">

          {/* EMAIL */}
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setErrors((prev) => ({ ...prev, email: undefined }))
              }}
              onKeyDown={handleKeyDown}
              className={`w-full px-4 py-3 rounded-xl 
              bg-[#020617] border 
              ${errors.email ? "border-red-500" : "border-[#334155]"}
              text-white placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* PASSWORD */}
          <div>
            <input
              type="password"
              placeholder={`Password (min ${PASSWORD_MIN_LENGTH})`}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setErrors((prev) => ({ ...prev, password: undefined }))
              }}
              onKeyDown={handleKeyDown}
              className={`w-full px-4 py-3 rounded-xl 
              bg-[#020617] border 
              ${errors.password ? "border-red-500" : "border-[#334155]"}
              text-white placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
            {errors.password && (
              <p className="text-red-400 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* CONFIRM */}
          <div>
            <input
              type="password"
              placeholder="Confirm password"
              value={confirm}
              onChange={(e) => {
                setConfirm(e.target.value)
                setErrors((prev) => ({ ...prev, confirm: undefined }))
              }}
              onKeyDown={handleKeyDown}
              className={`w-full px-4 py-3 rounded-xl 
              bg-[#020617] border 
              ${errors.confirm ? "border-red-500" : "border-[#334155]"}
              text-white placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
            {errors.confirm && (
              <p className="text-red-400 text-xs mt-1">{errors.confirm}</p>
            )}
          </div>

        </div>

        {/* BUTTON */}
        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full mt-6 py-3 rounded-xl font-medium
          bg-gradient-to-r from-purple-600 to-cyan-500
          hover:scale-105 hover:shadow-lg active:scale-95
          disabled:opacity-40 transition-all"
        >
          {loading ? "Creating account..." : "Sign up"}
        </button>

        {/* FOOTER */}
        <p className="text-sm text-center text-gray-400 mt-6">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-purple-400 hover:underline cursor-pointer"
          >
            Log in
          </span>
        </p>

      </div>
    </main>
  )
}