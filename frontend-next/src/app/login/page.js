"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {

  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = async () => {

    try {

      const response = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.detail || "Login failed")
      }

      const data = await response.json()

      // 🔐 STORE TOKEN
      localStorage.setItem("token", data.access_token)

      // ✅ REDIRECT TO DASHBOARD
      router.push("/dashboard")

    } catch (err) {

      console.error(err)
      setError(err.message || "Something went wrong")

    }
  }

  return (

    <main className="flex min-h-screen items-center justify-center bg-gray-100">

      <div className="bg-white p-10 rounded-lg shadow w-96">

        <h2 className="text-2xl font-bold mb-6">Login</h2>

        {error && (
          <p className="text-red-500 mb-3">{error}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 mb-4"
          onChange={(e)=>setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-4"
          onChange={(e)=>setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-black text-white py-2 rounded"
        >
          Login
        </button>

      </div>

    </main>
  )
}