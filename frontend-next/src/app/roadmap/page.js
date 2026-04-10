"use client"

import { Suspense, useState } from "react"
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
      setResult(data.roadmap || "")
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") generateRoadmap()
  }

  // 🔥 PARSER FUNCTION (IMPORTANT)
  const parseRoadmap = (text) => {
    const lines = text.split("\n").filter(line => line.trim() !== "")

    let structured = []
    let currentMonth = null
    let currentWeek = null

    lines.forEach(line => {
      if (line.toLowerCase().includes("month")) {
        currentMonth = { title: line, weeks: [] }
        structured.push(currentMonth)
      } 
      else if (line.toLowerCase().includes("week")) {
        currentWeek = { title: line, topics: [] }
        currentMonth?.weeks.push(currentWeek)
      } 
      else {
        currentWeek?.topics.push(line)
      }
    })

    return structured
  }

  if (!ready) return null

  return (
    <main className="p-8 bg-[#0f172a] min-h-screen text-white">

      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Roadmap Generator</h1>
        <p className="text-gray-400">
          Generate a structured learning plan for any topic
        </p>
      </div>

      {/* FORM */}
      <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-6 mb-10 max-w-3xl shadow-lg">
        <div className="flex flex-col md:flex-row gap-4">

          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter topic (e.g. AI, DSA, Web Dev)"
            className="flex-1 px-4 py-3 rounded-xl 
            bg-[#020617] border border-[#334155] 
            text-white placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="px-4 py-3 rounded-xl 
            bg-[#020617] border border-[#334155] 
            text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
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
            className="px-6 py-3 rounded-xl font-medium
            bg-gradient-to-r from-purple-600 to-cyan-500
            hover:scale-105 hover:shadow-lg active:scale-95
            disabled:opacity-40 transition-all"
          >
            {loading ? "Generating..." : "Generate"}
          </button>

        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-6 px-4 py-3 rounded-lg 
        bg-red-500/10 border border-red-500/20 text-red-400 text-sm max-w-3xl">
          {error}
        </div>
      )}

      {/* RESULT */}
      {result && (
        <div className="max-w-4xl space-y-6">

          <h2 className="text-xl font-semibold">Generated Roadmap</h2>

          {parseRoadmap(result).map((month, i) => (
            <div
              key={i}
              className="bg-[#1e293b] border border-[#334155] rounded-2xl p-5"
            >
              {/* MONTH */}
              <h3 className="text-lg font-semibold mb-4 text-purple-400">
                {month.title}
              </h3>

              {month.weeks.map((week, j) => (
                <div key={j} className="mb-4 ml-2">

                  {/* WEEK */}
                  <h4 className="text-sm font-medium text-cyan-400 mb-2">
                    {week.title}
                  </h4>

                  {/* TOPICS */}
                  <ul className="space-y-2 ml-4">
                    {week.topics.map((topic, k) => (
                      <li
                        key={k}
                        className="text-sm text-gray-300 bg-[#020617] px-3 py-2 rounded-lg border border-[#334155]"
                      >
                        {topic}
                      </li>
                    ))}
                  </ul>

                </div>
              ))}

            </div>
          ))}

        </div>
      )}

    </main>
  )
}

export default function RoadmapPage() {
  return (
    <Suspense>
      <RoadmapPageContent />
    </Suspense>
  )
}