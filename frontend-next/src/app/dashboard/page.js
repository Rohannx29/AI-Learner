"use client"

import { useEffect, useState } from "react"

export default function Dashboard() {

  const [response, setResponse] = useState("Loading...")

  useEffect(() => {

    const fetchData = async () => {

      try {

        const res = await fetch("http://localhost:8000/ask-notes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",

            // ✅ Step 3 (JWT token)
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify({
            question: "What is AI?"
          })
        })

        const data = await res.json()

        setResponse(data.answer || "No response")

      } catch (err) {

        console.error(err)
        setResponse("Error calling API")

      }
    }

    fetchData()

  }, [])

  return (

    <main className="flex min-h-screen items-center justify-center bg-gray-100">

      <div className="bg-white p-10 rounded-lg shadow text-center w-96">

        <h1 className="text-2xl font-bold mb-4">
          Dashboard 🚀
        </h1>

        <p className="text-gray-600 mb-4">
          Protected API Test
        </p>

        <div className="text-sm text-left bg-gray-100 p-3 rounded">
          {response}
        </div>

      </div>

    </main>
  )
}