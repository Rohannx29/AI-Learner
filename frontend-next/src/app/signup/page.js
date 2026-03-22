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
    errors.password = `Password must be at least ${PASSWORD_MIN_LENGTH} characters`
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

  const [email, setEmail]       = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm]   = useState("")
  const [errors, setErrors]     = useState({})
  const [apiError, setApiError] = useState("")
  const [loading, setLoading]   = useState(false)

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

      // Auto-login immediately after signup
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
    <main className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow w-96">

        <h2 className="text-2xl font-bold mb-6">Create account</h2>

        {apiError && (
          <p className="text-red-500 text-sm mb-4 p-2 bg-red-50 rounded">
            {apiError}
          </p>
        )}

        <div className="mb-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setErrors((prev) => ({ ...prev, email: undefined }))
            }}
            onKeyDown={handleKeyDown}
            className={`w-full border p-2 rounded ${errors.email ? "border-red-400" : ""}`}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        <div className="mb-4">
          <input
            type="password"
            placeholder={`Password (min ${PASSWORD_MIN_LENGTH} characters)`}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setErrors((prev) => ({ ...prev, password: undefined }))
            }}
            onKeyDown={handleKeyDown}
            className={`w-full border p-2 rounded ${errors.password ? "border-red-400" : ""}`}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
        </div>

        <div className="mb-6">
          <input
            type="password"
            placeholder="Confirm password"
            value={confirm}
            onChange={(e) => {
              setConfirm(e.target.value)
              setErrors((prev) => ({ ...prev, confirm: undefined }))
            }}
            onKeyDown={handleKeyDown}
            className={`w-full border p-2 rounded ${errors.confirm ? "border-red-400" : ""}`}
          />
          {errors.confirm && (
            <p className="text-red-500 text-xs mt-1">{errors.confirm}</p>
          )}
        </div>

        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded disabled:opacity-40"
        >
          {loading ? "Creating account..." : "Sign up"}
        </button>

        <p className="text-sm text-center text-gray-500 mt-4">
          Already have an account?{" "}
          <a href="/login" className="underline">Log in</a>
        </p>

      </div>
    </main>
  )
}