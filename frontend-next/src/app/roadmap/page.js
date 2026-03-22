"use client"

import { useState } from "react"

export default function RoadmapPage() {

  const [topic, setTopic] = useState("")
  const [result, setResult] = useState("")
  const [loading, setLoading] = useState(false)

  const generateRoadmap = async () => {

    if (!topic) return

    setLoading(true)

    try {

      const res = await fetch("http://localhost:8000/roadmap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ topic })
      })

      const data = await res.json()

      setResult(data.roadmap || "No roadmap generated")

    } catch (err) {
      console.error(err)
      setResult("Error generating roadmap")
    } finally {
      setLoading(false)
    }
  }

  return (

    <div className="p-10">

      <h1 className="text-3xl font-bold mb-6">
        🧠 Roadmap Generator
      </h1>

      <div className="flex gap-2 mb-4">

        <input
          value={topic}
          onChange={(e)=>setTopic(e.target.value)}
          placeholder="Enter topic (e.g. AI, DSA, Web Dev)"
          className="border p-2 w-96 rounded"
        />

        <button
          onClick={generateRoadmap}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Generate
        </button>

      </div>

      {loading && <p>Generating...</p>}

      <pre className="whitespace-pre-wrap bg-white p-4 rounded shadow">
        {result}
      </pre>

    </div>
  )
}