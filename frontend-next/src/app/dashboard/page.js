"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function Dashboard() {

  const router = useRouter()

  const [response, setResponse] = useState("Loading...")
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    const fetchData = async () => {

      try {

        const token = localStorage.getItem("token")

        // 🔐 If no token → redirect to login
        if (!token) {
          router.push("/login")
          return
        }

        const res = await fetch("http://localhost:8000/ask-notes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",

            // ✅ JWT token sent
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            question: "Explain Artificial Intelligence briefly"
          })
        })

        if (!res.ok) {
          throw new Error("Unauthorized or API error")
        }

        const data = await res.json()

        setResponse(data.answer || "No response received")

      } catch (err) {

        console.error(err)
        setResponse("Error calling API")

      } finally {
        setLoading(false)
      }
    }

    fetchData()

  }, [router])

  return (

    <main className="flex min-h-screen items-center justify-center bg-gray-100">

      <div className="bg-white p-10 rounded-lg shadow text-center w-[400px]">

        <h1 className="text-3xl font-bold mb-4">
          Dashboard 🚀
        </h1>

        <p className="text-gray-600 mb-4">
          Protected API Test (JWT Enabled)
        </p>

        <div className="text-sm text-left bg-gray-100 p-3 rounded min-h-[100px]">
          {loading ? "Loading..." : response}
        </div>

        {/* 🔥 Navigate to Chat */}
        <button
          onClick={() => router.push("/chat")}
          className="mt-6 bg-black text-white px-4 py-2 rounded w-full"
        >
          Go to AI Chat
        </button>

        {/* 🔓 Logout */}
        <button
          onClick={() => {
            localStorage.removeItem("token")
            router.push("/login")
          }}
          className="mt-3 border border-black px-4 py-2 rounded w-full"
        >
          Logout
        </button>

      </div>

    </main>
  )
}