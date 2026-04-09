"use client"

import { Suspense } from "react"
import { useState } from "react"
import { roadmapApi } from "@/lib/api"
import { useAuth } from "@/hooks/useAuth"

function RoadmapPageContent() {
  const { ready } = useAuth()
  const [topic, setTopic] = useState("")
  const [duration, setDuration] = useState("4 weeks")
  const [result, setResult] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const generateRoadmap = async () => {
    if (!topic.trim() || loading) return

    setLoading(true)
    setError("")
    setResult("")

    try {
      const data = await roadmapApi.generate(topic, duration)
      setResult(data.roadmap || "No roadmap generated.")
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") generateRoadmap()
  }

  if (!ready) return null

  return (
    <div className="p-10">

      <h1 className="text-3xl font-bold mb-2">Roadmap Generator</h1>
      <p className="text-gray-500 text-sm mb-8">
        Generate a structured weekly learning plan for any topic
      </p>

      <div className="flex gap-2 mb-6 flex-wrap">
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Topic (e.g. AI, DSA, Web Dev)"
          className="border p-2 w-80 rounded text-sm"
        />
        <select
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="border p-2 rounded bg-white text-sm"
        >
          <option>1 week</option>
          <option>2 weeks</option>
          <option>4 weeks</option>
          <option>8 weeks</option>
          <option>3 months</option>
          <option>6 months</option>
        </select>
        <button
          onClick={generateRoadmap}
          disabled={!topic.trim() || loading}
          className="bg-black text-white px-4 py-2 rounded disabled:opacity-40 text-sm"
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>

      {error && (
        <p className="text-red-500 text-sm mb-4">{error}</p>
      )}

      {result && (
        <pre className="whitespace-pre-wrap bg-white p-6 rounded-lg shadow-sm text-sm leading-relaxed max-w-3xl">
          {result}
        </pre>
      )}

    </div>
  )
}

export default function RoadmapPage() {
  return (
    <Suspense>
      <RoadmapPageContent />
    </Suspense>
  )
}