"use client"

import { useState } from "react"

export default function SignupPage() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSignup = async () => {

    try {

      const response = await fetch("http://localhost:8000/signup", {
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
        throw new Error(err.detail || "Signup failed")
      }

      const data = await response.json()

      alert("Signup successful!")

      console.log(data)

    } catch (err) {

      console.error(err)

      setError(err.message || "Something went wrong")
    }
  }

  return (

    <main className="flex min-h-screen items-center justify-center bg-gray-100">

      <div className="bg-white p-10 rounded-lg shadow w-96">

        <h2 className="text-2xl font-bold mb-6">Sign Up</h2>

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
          onClick={handleSignup}
          className="w-full bg-black text-white py-2 rounded"
        >
          Sign Up
        </button>

      </div>

    </main>
  )
}