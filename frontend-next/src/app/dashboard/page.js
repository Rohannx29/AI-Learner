"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"

const FEATURES = [
  {
    label: "Notes Chat",
    description: "Ask questions from your uploaded notes",
    route: "/chat",
    icon: "💬",
  },
  {
    label: "AI Tutor",
    description: "General tutoring — ask anything",
    route: "/tutor",
    icon: "🎓",
  },
  {
    label: "Upload Notes",
    description: "Index PDFs, DOCX, and text files",
    route: "/notes",
    icon: "📄",
  },
  {
    label: "Roadmap",
    description: "Generate a weekly learning plan",
    route: "/roadmap",
    icon: "🧠",
  },
]

export default function Dashboard() {
  const { ready } = useAuth()
  const router = useRouter()

  if (!ready) return null

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-gray-500 mb-8">What do you want to do today?</p>

      <div className="grid grid-cols-1 gap-4 max-w-xl">
        {FEATURES.map((f) => (
          <button
            key={f.route}
            onClick={() => router.push(f.route)}
            className="flex items-start gap-4 bg-white p-5 rounded-lg shadow-sm
                       hover:shadow-md transition-shadow text-left w-full"
          >
            <span className="text-2xl">{f.icon}</span>
            <div>
              <p className="font-semibold">{f.label}</p>
              <p className="text-sm text-gray-500">{f.description}</p>
            </div>
          </button>
        ))}
      </div>
    </main>
  )
}